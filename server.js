const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

const leerUsuarios = () => {
    let usuarios = JSON.parse(
        fs.readFileSync(__dirname + "/usuarios.json", "utf8")
    );
    return usuarios.data;
};

const guardarUsuarios = (usuarios) => {
    let users = JSON.parse(
        fs.readFileSync(__dirname + "/usuarios.json", "utf8")
    );
    users.data = usuarios;
    fs.writeFileSync(
        __dirname + "/usuarios.json",
        JSON.stringify(users, null, 4),
        "utf8"
    );
};

app.listen(3000, () => console.log("Servidor escuchando..."));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/usuarios", (req, res) => {
    let usuarios = leerUsuarios();
    res.status(200).send({ status: 200, usuarios });
});

app.get("/usuarios/:id", (req, res) => {
    let { id } = req.params;
    let usuarios = leerUsuarios();
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
    let usuarios = leerUsuarios();
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    res.status(201).send({ status: 201, usuario: nuevoUsuario });
});

app.put("/usuarios", (req, res) => {
    let { id, nombre, email } = req.body;
    let usuarios = leerUsuarios();
    let found = usuarios.find((usuario) => usuario.id == id);
    if (found) {
        found.nombre = nombre;
        found.email = email;
        guardarUsuarios(usuarios);
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
    let usuarios = leerUsuarios();
    let found = usuarios.find((usuario) => usuario.id == id);
    if (found) {
        usuarios = usuarios.filter((usuario) => usuario.id != id);
        guardarUsuarios(usuarios);
        res.status(200).send({ status: 200, message: "Usuario eliminado." });
    } else {
        res.status(404).send({ status: 404, message: "Usuario no encontrado" });
    }
});
