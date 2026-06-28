async function setNickname(member, nome, id, client = null) {
    if (!member) return;

    const newNick = `${nome} | ${id}`;

    try {
        // tenta mudar nickname
        await member.setNickname(newNick);

        console.log(`[NICK] Alterado com sucesso: ${member.user.tag} -> ${newNick}`);

        // LOG opcional no console
        if (client) {
            const log = `[NICK OK] ${member.user.tag} -> ${newNick}`;
            console.log(log);
        }

        return true;

    } catch (err) {

        console.log(`[NICK ERROR] ${member.user.tag}`);
        console.log(err.message);

        // 🔥 FALLBACK AUTOMÁTICO
        try {

            // tenta alternativa: só nome ou só ID
            const fallback1 = `${nome}`;
            await member.setNickname(fallback1);

            console.log(`[NICK FALLBACK 1] usado: ${fallback1}`);

        } catch (err2) {

            try {

                // fallback final: só ID
                const fallback2 = `${id}`;
                await member.setNickname(fallback2);

                console.log(`[NICK FALLBACK 2] usado: ${fallback2}`);

            } catch (err3) {

                console.log(`[NICK FAILED COMPLETELY] não foi possível alterar nickname`);

                // aqui NÃO quebra o bot em hipótese nenhuma
                return false;
            }
        }

        return false;
    }
}

module.exports = { setNickname };
