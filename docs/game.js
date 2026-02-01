const logElement = document.getElementById('log');
const titan = { name: "Код-Титан", hp: 200, maxHp: 200, atk: 15, hasShield: true };
const assassin = { name: "Скрипт-Убийца", hp: 80, maxHp: 80, atk: 40 };
const medic = { name: "Бит-Медик", healPower: 25 };

function updateUI() {
    // Обновляем полоску Титана
    const titanPct = (titan.hp / titan.maxHp) * 100;
    document.getElementById('titan-hp-bar').style.width = Math.max(0, titanPct) + "%";
    document.getElementById('titan-hp-text').innerText = `${Math.round(titan.hp)}/${titan.maxHp}`;

    // Обновляем полоску Убийцы
    const assassinPct = (assassin.hp / assassin.maxHp) * 100;
    document.getElementById('assassin-hp-bar').style.width = Math.max(0, assassinPct) + "%";
    document.getElementById('assassin-hp-text').innerText = `${Math.round(assassin.hp)}/${assassin.maxHp}`;
}

function print(text) {
    logElement.innerHTML += `<p>${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

function playerAttack() {
    if (titan.hp <= 0 || assassin.hp <= 0) return;

    // Удар игрока
    let dmg = assassin.atk;
    if (titan.hasShield) {
        dmg *= 0.5;
        titan.hasShield = false;
        print("🛡️ Щит Титана поглотил урон!");
    }
    titan.hp -= dmg;
    print(`⚔️ Ты нанес ${dmg} урона Титану!`);
    updateUI();

    // Ответ врагов
    if (titan.hp > 0) {
        setTimeout(() => {
            assassin.hp -= titan.atk;
            print(`🤖 Титан ударил на ${titan.atk}!`);
            
            if (titan.hp < 100) {
                titan.hp += medic.healPower;
                print(`💉 Медик подлечил Титана на ${medic.healPower}!`);
            }
            updateUI();
        }, 500);
    } else {
        print("🏆 ПОБЕДА!");
    }
}