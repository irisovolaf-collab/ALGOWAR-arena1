const logElement = document.getElementById('log');

function print(text) {
    logElement.innerHTML += `<p>${text}</p>`;
}

const titan = { name: "Код-Титан", hp: 200, atk: 15, hasShield: true };
const assassin = { name: "Скрипт-Убийца", hp: 80, atk: 40 };

logElement.innerHTML = "<b>Битва начинается!</b><br>";

// Логика атаки
function battle(a, b) {
    print(`⚔️ ${a.name} атакует ${b.name}!`);
    let dmg = a.atk;
    if (b.name === "Код-Титан" && b.hasShield) {
        print("🛡️ Щит Титана поглотил 50% урона!");
        dmg = dmg * 0.5;
        b.hasShield = false;
    }
    b.hp -= dmg;
    print(`💥 Урон: ${dmg}. У ${b.name} осталось ${b.hp} HP.`);
}

battle(assassin, titan);
battle(titan, assassin);