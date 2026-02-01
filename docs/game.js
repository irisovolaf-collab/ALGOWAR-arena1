console.log("GAME ENGINE LOADING...");

// 1. ПЕРЕМЕННЫЕ
let stage = 1;
let credits = 0;
let energy = 0;
let player = { hp: 100, maxHp: 100, atk: 40 };
let enemy = { name: "CODE-TITAN", hp: 200, maxHp: 200, atk: 15, evade: 0.1 };

// 2. ФУНКЦИИ ИНТЕРФЕЙСА
function updateUI() {
    console.log("Updating UI...");
    document.getElementById('stage-title').innerText = "SECTOR " + stage;
    document.getElementById('credits-display').innerText = "Credits: " + credits;
    document.getElementById('energy-bar').style.width = energy + "%";
    
    // Показываем кнопку ульты только при 100%
    const ultBtn = document.getElementById('ult-button');
    if(ultBtn) ultBtn.style.display = (energy >= 100) ? "inline-block" : "none";

    // Обновление полосок HP
    document.getElementById('player-hp-bar').style.width = Math.max(0, (player.hp / player.maxHp) * 100) + "%";
    document.getElementById('enemy-hp-bar').style.width = Math.max(0, (enemy.hp / enemy.maxHp) * 100) + "%";
    
    document.getElementById('player-hp-text').innerText = Math.round(player.hp) + "/" + player.maxHp;
    document.getElementById('enemy-hp-text').innerText = Math.round(enemy.hp) + "/" + enemy.maxHp;
}

function print(msg, cls = "") {
    const log = document.getElementById('log');
    if(log) {
        log.innerHTML += `<p class="${cls}">${msg}</p>`;
        log.scrollTop = log.scrollHeight;
    }
}

// 3. ЛОГИКА БОЯ (Главная функция)
window.attack = function(type) {
    console.log("Attack clicked: " + type);
    if (player.hp <= 0 || enemy.hp <= 0) return;

    let dmg = 0;
    let dodgeChance = 0.2;

    if (type === 'quick') {
        dmg = player.atk * 0.8;
        energy = Math.min(100, energy + 20);
        dodgeChance = 0.4; 
        print("⚡ Быстрый удар!");
    } else if (type === 'heavy') {
        dmg = player.atk * 1.6;
        energy = Math.min(100, energy + 30);
        dodgeChance = 0.05;
        print("🔨 Тяжелый удар!");
    } else if (type === 'heal') {
        player.hp = Math.min(player.maxHp, player.hp + 35);
        print("🔧 Ремонт: +35 HP", "log-heal");
    } else if (type === 'ult') {
        dmg = player.atk * 4;
        energy = 0;
        print("🚀 ПЕРЕГРУЗКА!", "log-crit");
    }

    if (type !== 'heal') {
        if (Math.random() < enemy.evade && type !== 'ult') {
            print("💨 Враг уклонился!", "log-evade");
        } else {
            let finalDmg = Math.round(dmg + Math.random() * 10);
            enemy.hp -= finalDmg;
            print("⚔️ Нанесено " + finalDmg + " урона.");
        }
    }

    updateUI();

    if (enemy.hp > 0) {
        // Ответ врага
        setTimeout(() => {
            if (Math.random() < dodgeChance) {
                print("💨 Вы уклонились!", "log-heal");
            } else {
                let eDmg = Math.round(enemy.atk + Math.random() * 5);
                player.hp -= eDmg;
                print("🤖 Враг ударил на " + eDmg, "log-crit");
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), 200);
            }
            updateUI();
            if (player.hp <= 0) print("💀 СИСТЕМА УНИЧТОЖЕНА", "log-crit");
        }, 500);
    } else {
        credits += 125;
        print("🏆 Сектор зачищен!", "log-heal");
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('shop-actions').classList.remove('hidden');
    }
};

// 4. МАГАЗИН И ПЕРЕХОДЫ
window.buy = function(item) {
    if (credits >= 100) {
        credits -= 100;
        if (item === 'atk') player.atk += 15;
        if (item === 'hp') { player.maxHp += 50; player.hp = player.maxHp; }
        print("💰 Улучшение куплено.");
        updateUI();
    }
};

window.nextLevel = function() {
    stage++;
    energy = Math.min(energy, 30);
    enemy.maxHp = Math.round(200 * Math.pow(1.2, stage - 1));
    enemy.hp = enemy.maxHp;
    enemy.atk = 15 + (stage * 3);
    document.getElementById('battle-actions').classList.remove('hidden');
    document.getElementById('shop-actions').classList.add('hidden');
    updateUI();
};

// 5. СТАРТ
window.onload = function() {
    console.log("Game fully loaded.");
    updateUI();
};