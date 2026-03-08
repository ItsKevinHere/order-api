const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

/* MONGODB CONNECTION */
mongoose.connect("mongodb://127.0.0.1:27017/ordersDB");

mongoose.connection.once("open", () => {
    console.log("Conectado ao MongoDB 🚀");
});

/* SCHEMA */
const OrderSchema = new mongoose.Schema({
    orderId: String,
    value: Number,
    creationDate: Date,
    items: [
        {
            productId: Number,
            quantity: Number,
            price: Number
        }
    ]
});

const Order = mongoose.model("Order", OrderSchema);

/* TESTE */
app.get("/", (req, res) => {
    res.send("API de pedidos funcionando");
});

/* CREATE ORDER */
app.post("/order", async (req, res) => {

    const body = req.body;

    const mappedOrder = {
        orderId: body.numeroPedido,
        value: body.valorTotal,
        creationDate: body.dataCriacao,
        items: body.items.map(item => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };

    try {

        const newOrder = new Order(mappedOrder);
        await newOrder.save();

        res.status(201).json({
            message: "Pedido criado com sucesso",
            order: newOrder
        });

    } catch (error) {

        res.status(500).json({
            message: "Erro ao salvar pedido",
            error: error.message
        });

    }

});

/* LIST ORDERS */
app.get("/order/list", async (req, res) => {

    const orders = await Order.find();
    res.json(orders);

});

/* GET ORDER BY ID */
app.get("/order/:id", async (req, res) => {

    try {

        const order = await Order.findOne({ orderId: req.params.id });

        if (!order) {
            return res.status(404).json({
                message: "Pedido não encontrado"
            });
        }

        res.json(order);

    } catch (error) {

        res.status(500).json({
            message: "Erro ao buscar pedido"
        });

    }

});

/* UPDATE ORDER */
app.put("/order/:id", async (req, res) => {

    try {

        const body = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            {
                orderId: body.numeroPedido,
                value: body.valorTotal,
                creationDate: body.dataCriacao,
                items: body.items.map(item => ({
                    productId: Number(item.idItem),
                    quantity: item.quantidadeItem,
                    price: item.valorItem
                }))
            },
            { returnDocument: 'after' }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Pedido não encontrado"
            });
        }

        res.json({
            message: "Pedido atualizado com sucesso",
            order: updatedOrder
        });

    } catch (error) {

        res.status(500).json({
            message: "Erro ao atualizar pedido"
        });

    }

});

/* DELETE ORDER */
app.delete("/order/:id", async (req, res) => {

    try {

        const deleted = await Order.findOneAndDelete({ orderId: req.params.id });

        if (!deleted) {
            return res.status(404).json({
                message: "Pedido não encontrado"
            });
        }

        res.json({
            message: "Pedido deletado com sucesso"
        });

    } catch (error) {

        res.status(500).json({
            message: "Erro ao deletar pedido"
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});