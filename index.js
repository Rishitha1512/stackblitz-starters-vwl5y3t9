const express = require('express');
const mongoose = require('mongoose');

const MenuItem = require('./schema.js'); 
require('dotenv').config()
const app = express();


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Failed to connect to MongoDB Atlas', err);
});


app.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Check if required fields are missing
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and Price are required' });
    }

    // Find menu item by ID and update it
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /menu/:id - Delete an existing menu item
app.delete('/menu/:id', async (req, res) => {
  try {
    // Find and delete the menu item
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: menuItem
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
