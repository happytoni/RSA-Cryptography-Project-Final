// Modular Exponentiation: (base^exp) % mod
function power(base, exp, mod) {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % mod;
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return res;
}

function gcd(a, b) {
    while (b !== 0n) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
}

function processRSA() {
    const pInput = document.getElementById('p').value;
    const qInput = document.getElementById('q').value;
    const msgText = document.getElementById('message').value;

    if (!pInput || !qInput || !msgText) {
        alert("Please enter p, q, and a message!");
        return;
    }

    const p = BigInt(pInput);
    const q = BigInt(qInput);
    
    // 1. Key Generation
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    let e = 65537n; 
    if (gcd(e, phi) !== 1n) e = 3n;

    // Find d (Modular Inverse)
    let d = 0n;
    for (let i = 1n; i < phi; i++) {
        if ((e * i) % phi === 1n) {
            d = i;
            break;
        }
    }

    //loop for all letters
    let cipherArray = [];
    let decryptedText = "";
    let signatureArray = [];

    for (let i = 0; i < msgText.length; i++) {
        let m = BigInt(msgText.charCodeAt(i));
        
        // Encrypt each letter
        let c = power(m, e, n);
        cipherArray.push(c.toString());
        
        // Decrypt back to letter
        let mBack = power(c, d, n);
        decryptedText += String.fromCharCode(Number(mBack));
        
        // Sign (Authentication)
        let s = power(m, d, n);
        signatureArray.push(s.toString());
    }

    // 2. Display Results
    document.getElementById('pubKey').innerText = `n=${n}, e=${e}`;
    document.getElementById('cipher').innerText = cipherArray.join(" | ");
    document.getElementById('decrypted').innerText = decryptedText;
    document.getElementById('signature').innerText = signatureArray.join(" | ");
}
