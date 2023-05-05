const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuarios = [
    {
        id: "f9de07",
        nombre: "Carlos",
        email: "carlos@gmail.com",
    },
];

app.listen(3000, () =>
    console.log("Servidor escuchando en http://localhost:3000")
);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/usuarios", (req, res) => {
    res.status(200).send({ status: 200, usuarios });
});

app.get("/usuarios/:id", (req, res) => {
    let { id } = req.params;
    let found = usuarios.find((usuario) => usuario.id == id);
    if (found) {
        res.status(200).send({ status: 200, usuario: found });
    } else {
        res.status(404).send({ status: 404, message: "Usuario no encontrado" });
    }
});

app.post("/usuarios", (req, res) => {
    let { nombre, email } = req.body;
    let nuevoUsuario = {
        id: uuidv4().slice(0, 6),
        nombre,
        email,
    };
    usuarios.push(nuevoUsuario);

    res.status(201).send({ status: 201, usuario: nuevoUsuario });
});

app.put("/usuarios", (req, res) => {
    let { id, nombre, email } = req.body;
    let found = usuarios.find((usuario) => usuario.id == id);
    if (found) {
        found.nombre = nombre;
        found.email = email;
        res.status(201).send({
            status: 201,
            usuario: found,
            message: "Usuario actualizado con éxito",
        });
    } else {
        res.status(404).send({
            status: 404,
            message: "no fue encontrado un usuario con dicho ID.",
        });
    }
});

app.delete("/usuarios/:id", (req, res) => {
    let { id } = req.params;
    let found = usuarios.find((usuario) => usuario.id == id);
    if (found) {
        usuarios = usuarios.filter((usuario) => usuario.id != id);
        res.status(200).send({ status: 200, message: "Usuario eliminado." });
    } else {
        res.status(404).send({ status: 404, message: "Usuario no encontrado" });
    }
});
