const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const itemsPool = require('./dbConfig')

app.get('/', (req, res) => {
    res.send('Simple API homepage');
})

app.get('/api/items', async (req, res) => {
    try {
        const result = await itemsPool.query('SELECT * FROM items');
        res.json({ items: result.rows }); 
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// ...existing code...

app.get('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await itemsPool.query(
            'SELECT * FROM items WHERE id = $1',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ item: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// ...existing

app.post('/api/items', async (req, res) => {
    const { description } = req.body;
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO items (description) VALUES ($1) RETURNING *',
            [description]
        );
        if (newItem.rowCount === 0) {
            return res.status(400).json({ message: "Failed to add new item" });
        }
        console.log("New item added:", newItem.rows[0]);

        res.status(201).json({ 
            message: "New item added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.listen(5070, () => {
    console.log("Server running on port 5070");
})
