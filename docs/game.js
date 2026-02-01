const logElement = document.getElementById('log');

function print(text) {
    logElement.innerHTML += `<p>${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight; // Авто-прокрутка вниз
}

const titan = { name: "Код-Титан", hp: 200, atk: 15, hasShield: true };
const assassin = { name: "Скрипт-Убийца", hp: 80, atk: 40 };

function playerAttack() {
    if (titan.hp <= 0 || assassin.hp <= 0) {
        print("<b>Игра окончена! Перезагрузи страницу для нового боя.</b>");
        return;
    }

    // Убийца атакует Титана
    print(`⚔️ <b>${assassin.name}</b> наносит удар!`);
    let dmg = assassin.atk;
    
    if (titan.hasShield) {
        print("🛡️ Баг-щит поглотил 50% урона!");
        dmg = dmg * 0.5;
        titan.hasShield = false;
    }
    
    titan.hp -= dmg;
    print(`💥 Урон: ${dmg}. У Титана осталось ${titan.hp} HP.`);

    // Ответный удар Титана через полсекунды
    if (titan.hp > 0) {
        setTimeout(() => {
            print(`🤖 <b>${titan.name}</b> бьет в ответ!`);
            assassin.hp -= titan.atk;
            print(`🩸 Урон: ${titan.atk}. У Убийцы осталось ${assassin.hp} HP.`);
            print("----------------------------");
        }, 500);
    } else {
        print("🏆 <b>Скрипт-Убийца победил! Система взломана!</b>");
    }
}
const medic = { name: "Бит-Медик", hp: 120, healPower: 40 };

// Добавь эту проверку внутрь функции playerAttack, после удара Титана:
if (titan.hp > 0 && titan.hp < 100) {
    print(`💉 <b>${medic.name}</b> применяет Рефакторинг!`);
    titan.hp += medic.healPower;
    print(`💚 Титан восстановил HP до ${titan.hp}`);
}