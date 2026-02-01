const logElement = document.getElementById('log');

function print(text) {
    logElement.innerHTML += `<p>${text}</p>`;
    logElement.scrollTop = logElement.scrollHeight; 
}

// Наши персонажи
const titan = { name: "Код-Титан", hp: 200, atk: 15, hasShield: true };
const assassin = { name: "Скрипт-Убийца", hp: 80, atk: 40 };
const medic = { name: "Бит-Медик", healPower: 25 }; // Тот самый Медик

function playerAttack() {
    if (titan.hp <= 0 || assassin.hp <= 0) {
        print("<b>Игра окончена! Перезагрузи страницу для нового боя.</b>");
        return;
    }

    // 1. Твой удар (Убийца атакует)
    print(`⚔️ <b>${assassin.name}</b> наносит удар!`);
    let dmg = assassin.atk;
    
    if (titan.hasShield) {
        print("🛡️ Баг-щит Титана поглотил 50% урона!");
        dmg = dmg * 0.5;
        titan.hasShield = false;
    }
    
    titan.hp -= dmg;
    print(`💥 Урон: ${dmg}. У Титана осталось ${titan.hp} HP.`);

    // 2. Ответ противников
    if (titan.hp > 0) {
        setTimeout(() => {
            // Титан бьет в ответ
            print(`🤖 <b>${titan.name}</b> бьет в ответ!`);
            assassin.hp -= titan.atk;
            print(`🩸 Урон: ${titan.atk}. У Убийцы осталось ${assassin.hp} HP.`);
            
            // МЕДИК ВСТУПАЕТ В БОЙ: лечит, если у Титана меньше 100 HP
            if (titan.hp < 100) {
                print(`💉 <b>${medic.name}</b> применяет Рефакторинг!`);
                titan.hp += medic.healPower;
                print(`💚 Титан подлечился! Теперь у него ${titan.hp} HP.`);
            }

            print("----------------------------");
        }, 500);
    } else {
        print("🏆 <b>Скрипт-Убийца победил! Система взломана!</b>");
    }
}