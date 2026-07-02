const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./wl.db", (err) => {

    if (err) {
        console.error(err);
    } else {
        console.log("SQLite conectado.");
    }

});

// cria tabela
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS whitelist (
            userId TEXT PRIMARY KEY,
            nome TEXT,
            idJogador TEXT,
            status TEXT,
            messageId TEXT
        )
`, (err)=>{

    if(err){
        console.error(err);
    }else{
        console.log("Tabela criada.");
    }
    );

    db.run(
    "INSERT INTO whitelist(userId, nome, idJogador, status, messageId) VALUES(?, ?, ?, ?, ?)",
    ["1230123", "Ricardo", "1331313", "online", "1521995023430717533"],
    function(err){

        if(err){
            console.error(err);
        }else{
            console.log("Registro inserido:", this.lastID);
        }

    }
    );
    db.all("SELECT * FROM whitelist", [], (err, rows)=>{

    if(err){
        console.error(err);
    }else{
        console.log(rows);
    }

    });
});
    
module.exports = db;
