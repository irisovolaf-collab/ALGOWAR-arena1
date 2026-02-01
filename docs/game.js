const log = document.getElementById('log');

// Состояние игры
let stage = 1;
let credits = 0;
let energy = 0;
let player = { hp: 100, maxHp: 100, atk: 40 };
let enemy = { name: "CODE-TITAN", hp: 200, maxHp: 200, atk: 15, evade: 0.1 };

// Функция вывода текста
function print(text, colorClass = "") {
    if (log) {
        log.innerHTML += `<p class="${colorClass}">${text}</p>`;
        log.scrollTop = log.scrollHeight;
    }
}

// Функция обновления интерфейса
function updateUI() {
    document.getElementById('stage-title').innerText = "SECTOR " + stage;
    document.getElementById('credits-display').innerText = "Credits: " + credits;
    document.getElementById('energy-bar').style.width = energy + "%";
    
    // Кнопка ульты
    document.getElementById('ult-button').style.display = (energy >= 100) ? "inline-block" : "none";

    // Полоски здоровья
    const playerPct = (player.hp / player.maxHp) * 100;
    const enemyPct = (enemy.hp / enemy.maxHp) * 100;
    
    document.getElementById('player-hp-bar').style.width = Math.max(0, playerPct) + "%";
    document.getElementById('enemy-hp-bar').style.width = Math.max(0, enemyPct) + "%";
    
    document.getElementById('player-hp-text').innerText = Math.round(player.hp) + "/" + player.maxHp;
    document.getElementById('enemy-hp-text').innerText = Math.round(enemy.hp) + "/" + enemy.maxHp;
}

// Функция атаки
function attack(type) {
    if (player.hp <= 0 || enemy.hp <= 0) return;

    let dmg = 0;
    let dodgeChance = 0.15;

    if (type === 'quick') {
        dmg = player.atk * 0.8;
        energy = Math.min(100, energy + 20);
        dodgeChance = 0.35; // Выше шанс уклониться от ответки
    } else if (type === 'heavy') {
        dmg = player.atk * 1.6;
        energy = Math.min(100, energy + 30);
        dodgeChance = 0.05; // Почти невозможно уклониться
    } else if (type === 'heal') {
        player.hp = Math.min(player.maxHp, player.hp + 35);
        print("🔧 Ремонт системы: +35 HP", "log-heal");
    } else if (type === 'ult') {
        dmg = player.atk * 4;
        energy = 0;
        print("🚀 ПЕРЕГРУЗКА: Критический урон!", "log-crit");
    }

    // Наносим урон врагу
    if (type !== 'heal') {
        if (Math.random() < enemy.evade && type !== 'ult') {
            print("💨 Враг уклонился!", "log-evade");
        } else {
            let finalDmg = Math.round(dmg + Math.random() * 10);
            enemy.hp -= finalDmg;
            print("⚔️ Вы нанесли " + finalDmg + " урона.");
        }
    }

    updateUI();

    // Ответный ход врага
    if (enemy.hp > 0) {
        setTimeout(() => {
            if (Math.random() < dodgeChance) {
                print("💨 Вы уклонились!", "log-heal");
            } else {
                let enemyDmg = Math.round(enemy.atk + Math.random() * 5);
                player.hp -= enemyDmg;
                print("🤖 " + enemy.name + " ударил на " + enemyDmg, "log-crit");
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), 200);
            }
            updateUI();
            if (player.hp <= 0) print("💀 СИСТЕМНАЯ ОШИБКА: Вы погибли.", "log-crit");
        }, 400);
    } else {
        credits += 125;
        print("🏆 Сектор зачищен! Получено 125 кредитов.", "log-heal");
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('shop-actions').classList.remove('hidden');
    }
}

// Магазин
function buy(item) {
    if (credits >= 100) {
        credits -= 100;
        if (item === 'atk') player.atk += 15;
        if (item === 'hp') { player.maxHp += 50; player.hp = player.maxHp; }
        print("💰 Улучшение установлено.", "log-heal");
        updateUI();
    }
}

// Следующий уровень
function nextLevel() {
    stage++;
    energy = Math.min(energy, 30);
    
    // Усиливаем врага
    enemy.maxHp = Math.round(200 * Math.pow(1.2, stage - 1));
    enemy.hp = enemy.maxHp;
    enemy.atk = 15 + (stage * 3);
    
    document.getElementById('battle-actions').classList.remove('hidden');
    document.getElementById('shop-actions').classList.add('hidden');
    print("🚨 Вход в Сектор " + stage, "log-system");
    updateUI();