async function setNickname(member, nome, id) {
    if (!member) return;

    const newNick = `${nome} | ${id}`;

    try {
        await member.setNickname(newNick);
    } catch (err) {
        console.log("Erro ao mudar nickname:", err.message);
    }
}

module.exports = { setNickname };
