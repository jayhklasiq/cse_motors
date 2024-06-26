const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  This function retrieves data for a specific vehicle based on the inventory ID
 * ************************** */
async function getVehicleDataById(inventoryId) {
  try {
    const data = await pool.query('SELECT * FROM public.inventory WHERE inv_id = $1', [inventoryId]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

/* ***************************
 *  This function adds a classification name to the classification table
 * ************************** */
async function addClassificationName(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUEs ($1)"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* ***************************
 *  This function adds data to the inventory table
 * ************************** */
async function addCarDetailsToInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateCarInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* ***************************
 *  Search inventory by input
 * ************************** */
async function searchInventory(searchInput) {
  try {
    const searchTerm = `%${searchInput}%`;
    const data = await pool.query(
      `SELECT * 
      FROM public.inventory AS i 
      JOIN public.classification AS c ON i.classification_id = c.classification_id 
      WHERE 
        i.inv_make ILIKE $1 OR
        i.inv_model ILIKE $1 OR
        i.inv_description ILIKE $1 OR
        c.classification_name ILIKE $1`,
      [searchTerm]
    );

    return data.rows;
  } catch (error) {
    return error.message;
  }
}



module.exports = { getClassifications, getInventoryByClassificationId, getVehicleDataById, addClassificationName, addCarDetailsToInventory, updateCarInventory, searchInventory };