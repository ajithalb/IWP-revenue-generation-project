const db = require('../database/db');

function submitContact(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Name, Email, Subject, and Message.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    const insert = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'New')
    `);

    const result = insert.run(
      name.trim(),
      email.trim(),
      phone ? phone.trim() : '',
      subject.trim(),
      message.trim()
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Sasti Boutique! We have received your message and will respond promptly.',
      contactId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('[Contact Controller] Error saving message:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit contact message: ' + err.message });
  }
}

function getAllContacts(req, res) {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const messages = db.prepare(query).all(...params);

    return res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['New', 'Read', 'Replied'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(status, id);

    return res.json({ success: true, message: `Message marked as "${status}".` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email.' });
    }

    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to our newsletter! Thank you.' });
    }

    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email.trim().toLowerCase());

    return res.json({
      success: true,
      message: 'Thank you for subscribing! You will receive our latest boutique collections and special discounts.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  submitContact,
  getAllContacts,
  updateContactStatus,
  subscribeNewsletter
};
