function validateName(name) {
    if (!name) return "Nome obrigatório.";

    const clean = name.trim();

    if (clean.length > 100) {
        return "Nome máximo de 100 caracteres.";
    }

    const parts = clean.split(/\s+/);

    if (parts.length < 2) {
        return "Informe nome e sobrenome.";
    }

    return null;
}

function validateId(id) {
    if (!id) return "ID obrigatório.";

    if (!/^\d+$/.test(id)) {
        return "ID deve conter apenas números.";
    }

    return null;
}

module.exports = {
    validateName,
    validateId
};
