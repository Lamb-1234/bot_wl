function validateName(name) {

    if (!name) {
        return "Informe um nome.";
    }

    if (name.length > 100) {
        return "O nome pode ter no máximo 100 caracteres.";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length < 2) {
        return "Informe nome e sobrenome.";
    }

    return null;
}

function validateId(id) {

    if (!/^\d+$/.test(id)) {
        return "O ID deve conter apenas números.";
    }

    return null;
}

module.exports = {
    validateName,
    validateId
};
