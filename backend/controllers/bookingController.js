const db = require('../database/db');

function generateBookingRef() {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SB-BRK-${yearMonth}-${randomSuffix}`;
}

function parseServiceFields(srv) {
  if (!srv) return null;
  let features = [];
  try {
    features = srv.features ? JSON.parse(srv.features) : [];
  } catch (e) {
    features = typeof srv.features === 'string' ? srv.features.split(',').map(f => f.trim()) : [];
  }
  return { ...srv, features };
}

function getServices(req, res) {
  try {
    const rows = db.prepare('SELECT * FROM makeup_services ORDER BY price DESC').all();
    const services = rows.map(parseServiceFields);
    return res.json({ success: true, count: services.length, services });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function updateServicePrice(req, res) {
  try {
    const { id } = req.params;
    const { price, duration, description } = req.body;

    const existing = db.prepare('SELECT * FROM makeup_services WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const newPrice = price !== undefined ? Number(price) : existing.price;
    const newDuration = duration !== undefined ? duration : existing.duration;
    const newDesc = description !== undefined ? description : existing.description;

    db.prepare('UPDATE makeup_services SET price = ?, duration = ?, description = ? WHERE id = ?')
      .run(newPrice, newDuration, newDesc, id);

    const updated = db.prepare('SELECT * FROM makeup_services WHERE id = ?').get(id);
    return res.json({ success: true, message: 'Makeup service updated successfully.', service: parseServiceFields(updated) });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function createBooking(req, res) {
  try {
    const {
      customer_name,
      contact_number,
      email,
      service_id,
      event_date,
      event_time,
      event_location,
      guest_count = 1,
      additional_requirements = '',
      budget = ''
    } = req.body;

    // Validate required fields
    if (
      !customer_name ||
      !contact_number ||
      !email ||
      !service_id ||
      !event_date ||
      !event_time ||
      !event_location
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required booking fields: Name, Phone, Email, Service, Date, Time, and Location.'
      });
    }

    const cleanPhone = contact_number.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.'
      });
    }

    // Verify service exists
    const service = db.prepare('SELECT * FROM makeup_services WHERE id = ?').get(service_id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'The selected bridal/makeup service was not found.'
      });
    }

    // Check for duplicate pending/confirmed booking for the same customer on the exact same date & time
    const existingSameCustomer = db.prepare(`
      SELECT * FROM makeup_bookings 
      WHERE (contact_number = ? OR email = ?) AND event_date = ? AND event_time = ? AND status != 'Cancelled'
    `).get(cleanPhone, email.trim(), event_date, event_time);

    if (existingSameCustomer) {
      return res.status(400).json({
        success: false,
        message: `You already have an active appointment scheduled for ${event_date} at ${event_time} (Ref: ${existingSameCustomer.booking_ref}).`
      });
    }

    // Check slot availability (conflict check)
    const slotConflict = db.prepare(`
      SELECT * FROM makeup_bookings 
      WHERE event_date = ? AND event_time = ? AND status IN ('Pending', 'Confirmed')
    `).get(event_date, event_time);

    let conflictNotice = null;
    if (slotConflict) {
      conflictNotice = `Notice: Another appointment request exists for ${event_date} at ${event_time}. Our team will review schedule availability and confirm your slot.`;
    }

    const bookingRef = generateBookingRef();

    const insertStmt = db.prepare(`
      INSERT INTO makeup_bookings (
        booking_ref, customer_name, contact_number, email,
        service_id, service_name, event_date, event_time,
        event_location, guest_count, additional_requirements, budget, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `);

    const result = insertStmt.run(
      bookingRef,
      customer_name.trim(),
      cleanPhone,
      email.trim(),
      service.id,
      service.name,
      event_date,
      event_time,
      event_location.trim(),
      Math.max(1, parseInt(guest_count, 10) || 1),
      additional_requirements.trim(),
      budget ? budget.trim() : `₹${service.price.toLocaleString('en-IN')}`
    );

    const savedBooking = db.prepare('SELECT * FROM makeup_bookings WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Bridal makeup booking request submitted successfully! Your appointment status is currently Pending confirmation by our boutique artist.',
      conflictNotice,
      booking: savedBooking,
      shopContact: {
        phone: '7904871123',
        email: 'nisanth08.connect@gamil.com',
        businessHours: '10:00 AM - 08:30 PM (Mon - Sun)'
      }
    });
  } catch (err) {
    console.error('[Booking Controller] Error creating booking:', err);
    return res.status(500).json({ success: false, message: 'Failed to record booking: ' + err.message });
  }
}

function getBookingByRef(req, res) {
  try {
    const { ref } = req.params;
    const term = ref.trim();

    const booking = db.prepare('SELECT * FROM makeup_bookings WHERE booking_ref = ?').get(term);

    if (!booking) {
      // Try searching by phone
      const bookingsByPhone = db.prepare('SELECT * FROM makeup_bookings WHERE contact_number = ? ORDER BY event_date DESC').all(term);
      if (bookingsByPhone.length > 0) {
        return res.json({
          success: true,
          multiple: true,
          bookings: bookingsByPhone
        });
      }

      return res.status(404).json({
        success: false,
        message: `No bridal makeup booking found with reference or phone "${ref}".`
      });
    }

    return res.json({
      success: true,
      multiple: false,
      booking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function getAllBookings(req, res) {
  try {
    const { status, date, search } = req.query;
    let query = 'SELECT * FROM makeup_bookings WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND event_date = ?';
      params.push(date);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' AND (booking_ref LIKE ? OR customer_name LIKE ? OR contact_number LIKE ? OR service_name LIKE ?)';
      params.push(term, term, term, term);
    }

    query += ' ORDER BY event_date ASC, created_at DESC';

    const bookings = db.prepare(query).all(...params);

    return res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const booking = db.prepare('SELECT * FROM makeup_bookings WHERE id = ?').get(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    db.prepare('UPDATE makeup_bookings SET status = ? WHERE id = ?').run(status, id);

    const updated = db.prepare('SELECT * FROM makeup_bookings WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: `Booking #${booking.booking_ref} status changed to "${status}".`,
      booking: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getServices,
  updateServicePrice,
  createBooking,
  getBookingByRef,
  getAllBookings,
  updateBookingStatus
};
