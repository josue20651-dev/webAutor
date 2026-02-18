const crypto = require("crypto");

function firmar(params, secretKey){
    
    const keys = Object.keys(params).sort();

    let stringFirmar = "";

    keys.forEach(key => {
        stringFirmar += key + params[key];
    });

    return crypto
        .createHmac("sha256", secretKey)
        .update(stringFirmar)
        .digest("hex");
}

module.exports = firmar;