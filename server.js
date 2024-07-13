const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());

let mongourl = 'mongodb+srv://jashwa-29:fXxQeI3RwO487uU5@cluster0.0tbvc4t.mongodb.net/mernapp';
mongoose.connect(mongourl).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log(err);
});

const todoschema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
});
const todomodel = mongoose.model('todo', todoschema);

app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newtodo = new todomodel({ title, description });
        await newtodo.save();
        res.status(201).json(newtodo);
        console.log(newtodo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error saving the todo');
    }
});

app.get('/todos', async (req, res) => {
    try {
        const gettingtodo = await todomodel.find();
        res.json(gettingtodo);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving todos');
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updatetodomodel = await todomodel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatetodomodel) {
            return res.status(404).send('Todo not found');
        }
        res.json(updatetodomodel);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating the todo');
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedtodo = await todomodel.findByIdAndDelete(id);
        if (!deletedtodo) {
            return res.status(404).send('Todo not found');
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting the todo');
    }
});

let port = 8200;

app.listen(port, () => {
    console.log('Server is running on port', port);
});
