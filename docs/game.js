// Характеристики персонажей
const titan = {
    name: "Код-Титан",
    hp: 200,
    atk: 15,
    def: 10,
    hasShield: true // Тот самый авто-щит
};

const assassin = {
    name: "Скрипт-Убийца",
    hp: 80,
    atk: 40,
    def: 5
};

// Простая функция атаки
function attack(attacker, target) {
    console.log(`${attacker.name} атакует ${target.name}!`);
    let damage = attacker.atk;

    // Логика щита Титана
    if (target.name === "Код-Титан" && target.hasShield) {
        console.log("🛡️ Баг-щит сработал! Урон снижен.");
        damage = damage * 0.5; // Пробитие защиты на 50%
        target.hasShield = false; // Щит ломается после удара
    }

    target.hp -= damage;
    console.log(`Остаток HP у ${target.name}: ${target.hp}`);
}

// Тестовый бой
attack(assassin, titan);