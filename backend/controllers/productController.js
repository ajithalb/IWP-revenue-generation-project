const db = require('../database/db');

function parseProductFields(product) {
  if (!product) return null;
  let sizes = [];
  let colors = [];
  let additionalImages = [];

  try {
    sizes = product.sizes ? JSON.parse(product.sizes) : [];
  } catch (e) {
    sizes = typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : [];
  }

  try {
    colors = product.colors ? JSON.parse(product.colors) : [];
  } catch (e) {
    colors = typeof product.colors === 'string' ? product.colors.split(',').map(c => c.trim()) : [];
  }

  try {
    additionalImages = product.additional_images ? JSON.parse(product.additional_images) : [];
  } catch (e) {
    additionalImages = [];
  }

  return {
    ...product,
    sizes,
    colors,
    additional_images: additionalImages,
    in_stock: product.stock > 0
  };
}

function getAllProducts(req, res) {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      size,
      color,
      featured,
      is_new,
      inStockOnly,
      search,
      sort
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (subcategory && subcategory !== 'all') {
      query += ' AND LOWER(subcategory) = LOWER(?)';
      params.push(subcategory);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND featured = 1';
    }

    if (is_new === 'true' || is_new === '1') {
      query += ' AND is_new = 1';
    }

    if (inStockOnly === 'true' || inStockOnly === '1') {
      query += ' AND stock > 0';
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' AND (name LIKE ? OR subcategory LIKE ? OR description LIKE ?)';
      params.push(term, term, term);
    }

    if (size) {
      query += ' AND sizes LIKE ?';
      params.push(`%${size}%`);
    }

    if (color) {
      query += ' AND colors LIKE ?';
      params.push(`%${color}%`);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price DESC';
        break;
      case 'newest':
        query += ' ORDER BY created_at DESC';
        break;
      case 'popular':
        query += ' ORDER BY review_count DESC, rating DESC';
        break;
      default:
        query += ' ORDER BY featured DESC, id ASC';
        break;
    }

    const rows = db.prepare(query).all(...params);
    const parsed = rows.map(parseProductFields);

    return res.json({
      success: true,
      count: parsed.length,
      products: parsed
    });
  } catch (err) {
    console.error('[Product Controller] Error fetching products:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products from database.'
    });
  }
}

function getProductById(req, res) {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    const product = parseProductFields(row);

    // Fetch up to 4 related products from same category
    const relatedRows = db.prepare('SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4').all(row.category, id);
    const related = relatedRows.map(parseProductFields);

    return res.json({
      success: true,
      product,
      related
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

function getCategories(req, res) {
  try {
    const chuditharSub = db.prepare('SELECT DISTINCT subcategory, COUNT(*) as count FROM products WHERE category = "chudithar" GROUP BY subcategory').all();
    const makeupSub = db.prepare('SELECT DISTINCT subcategory, COUNT(*) as count FROM products WHERE category = "makeup" GROUP BY subcategory').all();
    const counts = db.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();

    return res.json({
      success: true,
      chuditharSubcategories: chuditharSub,
      makeupSubcategories: makeupSub,
      categoryCounts: counts
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function createProduct(req, res) {
  try {
    const {
      name,
      category,
      subcategory,
      price,
      original_price,
      discount_percent,
      description,
      details,
      sizes,
      colors,
      stock,
      image_url,
      additional_images,
      featured,
      is_new
    } = req.body;

    if (!name || !category || !subcategory || !price || stock === undefined || !image_url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, subcategory, price, stock, and image_url.'
      });
    }

    const sizesStr = Array.isArray(sizes) ? JSON.stringify(sizes) : (sizes || '[]');
    const colorsStr = Array.isArray(colors) ? JSON.stringify(colors) : (colors || '[]');
    const addImgsStr = Array.isArray(additional_images) ? JSON.stringify(additional_images) : (additional_images || '[]');

    const origPrice = original_price ? Number(original_price) : null;
    const calcDiscount = origPrice && origPrice > Number(price)
      ? Math.round(((origPrice - Number(price)) / origPrice) * 100)
      : (discount_percent ? Number(discount_percent) : 0);

    const insert = db.prepare(`
      INSERT INTO products (
        name, category, subcategory, price, original_price, discount_percent,
        description, details, sizes, colors, stock, image_url, additional_images,
        featured, is_new, rating, review_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5.0, 1)
    `);

    const result = insert.run(
      name,
      category.toLowerCase(),
      subcategory,
      Number(price),
      origPrice,
      calcDiscount,
      description || '',
      details || '',
      sizesStr,
      colorsStr,
      Math.max(0, parseInt(stock, 10)),
      image_url,
      addImgsStr,
      featured ? 1 : 0,
      is_new ? 1 : 0
    );

    const newProd = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: parseProductFields(newProd)
    });
  } catch (err) {
    console.error('[Product Controller] Create Product Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name,
      category,
      subcategory,
      price,
      original_price,
      discount_percent,
      description,
      details,
      sizes,
      colors,
      stock,
      image_url,
      additional_images,
      featured,
      is_new
    } = req.body;

    const sizesStr = sizes !== undefined ? (Array.isArray(sizes) ? JSON.stringify(sizes) : sizes) : existing.sizes;
    const colorsStr = colors !== undefined ? (Array.isArray(colors) ? JSON.stringify(colors) : colors) : existing.colors;
    const addImgsStr = additional_images !== undefined ? (Array.isArray(additional_images) ? JSON.stringify(additional_images) : additional_images) : existing.additional_images;

    const newPrice = price !== undefined ? Number(price) : existing.price;
    const newOrigPrice = original_price !== undefined ? (original_price ? Number(original_price) : null) : existing.original_price;
    const newDiscount = newOrigPrice && newOrigPrice > newPrice
      ? Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100)
      : (discount_percent !== undefined ? Number(discount_percent) : existing.discount_percent);

    const update = db.prepare(`
      UPDATE products SET
        name = ?,
        category = ?,
        subcategory = ?,
        price = ?,
        original_price = ?,
        discount_percent = ?,
        description = ?,
        details = ?,
        sizes = ?,
        colors = ?,
        stock = ?,
        image_url = ?,
        additional_images = ?,
        featured = ?,
        is_new = ?
      WHERE id = ?
    `);

    update.run(
      name !== undefined ? name : existing.name,
      category !== undefined ? category.toLowerCase() : existing.category,
      subcategory !== undefined ? subcategory : existing.subcategory,
      newPrice,
      newOrigPrice,
      newDiscount,
      description !== undefined ? description : existing.description,
      details !== undefined ? details : existing.details,
      sizesStr,
      colorsStr,
      stock !== undefined ? Math.max(0, parseInt(stock, 10)) : existing.stock,
      image_url !== undefined ? image_url : existing.image_url,
      addImgsStr,
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      is_new !== undefined ? (is_new ? 1 : 0) : existing.is_new,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      product: parseProductFields(updated)
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    return res.json({
      success: true,
      message: `Product "${existing.name}" deleted successfully.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};
