// ASCII-арт база
const arts = {
    TITAN: `\n      _______\n     |  ___  |\n     | |   | |\n     | |___| |\n     |_______|\n     /       \\\n    / [X] [X] \\\n    |    ^    |\n    \\_________/`,
    SCOUT: `\n       /\\\n      /  \\\n     | -- |\n     | !! |\n      \\__/\n      /  \\\n     /____\\`,
    GUARD: `\n     _________\n    |  _____  |\n    | |  I  | |\n    | |_____| |\n    |_________|\n    [#########]\n    [#########]`
};

// Параметры игрока
let player = {
    hp: 100,
    maxHp: 100,
    atk: 40,
    lvl: 1,
    xp: 0,
    nextXp: 100
};

// Параметры мира
let stage = 1;
let credits = 0;
let energy = 0;
let enemy = { name: "CYBER-TITAN", hp: 200, maxHp: 200, atk: 15, type: "TITAN", color: "#e74c3c" };

// Обновление всего интерфейса
function updateUI() {
    document.getElementById('stage-title').innerText = "SECTOR " + stage;
    document.getElementById('credits-display').innerText = "Credits: " + credits;
    document.getElementById('player-lvl').innerText = "LVL: " + player.lvl;
    
    // Полоски
    document.getElementById('energy-bar').style.width = energy + "%";
    document.getElementById('xp-bar').style.width = (player.xp / player.nextXp * 100) + "%";
    document.getElementById('ult-button').style.display = (energy >= 100) ? "inline-block" : "none";
    
    document.getElementById('player-hp-bar').style.width = (player.hp / player.maxHp * 100) + "%";
    document.getElementById('enemy-hp-bar').style.width = (enemy.hp / enemy.maxHp * 100) + "%";
    
    document.getElementById('player-hp-text').innerText = Math.round(player.hp) + "/" + player.maxHp;
    document.getElementById('enemy-hp-text').innerText = Math.round(enemy.hp) + "/" + enemy.maxHp;
    
    // Визуал врага
    const visual = document.getElementById('enemy-visual');
    visual.innerText = arts[enemy.type] || arts.TITAN;
    visual.style.color = enemy.color;
    document.getElementById('enemy-name').innerText = enemy.name;
    document.getElementById('enemy-name').style.color = enemy.color;
}

// Логирование событий
function print(msg, cls = "") {
    const log = document.getElementById('log');
    log.innerHTML += `<p class="${cls}">${msg}</p>`;
    log.scrollTop = log.scrollHeight;
}

// Система уровней
function checkLvlUp() {
    if (player.xp >= player.nextXp) {
        player.lvl++;
        player.xp -= player.nextXp;
        player.nextXp = Math.round(player.nextXp * 1.6);
        
        // Бонусы за уровень
        player.maxHp += 30;
        player.hp = player.maxHp;
        player.atk += 12;
        
        print(`🌟 LEVEL UP! Достигнут уровень ${player.lvl}!`, "log-xp");
        print(`📈 Параметры улучшены: +12 ATK, +30 HP`, "log-heal");
        checkLvlUp(); // Рекурсия на случай получения кучи опыта сразу
    }
}

// ОСНОВНАЯ ЛОГИКА АТАКИ
window.attack = function(type) {
    if (player.hp <= 0 || enemy.hp <= 0) return;

    let dmg = 0;
    if (type === 'quick') { 
        dmg = player.atk * 0.8; 
        energy = Math.min(100, energy + 25); 
        print("⚡ Быстрая серия ударов!"); 
    }
    if (type === 'heavy') { 
        dmg = player.atk * 1.5; 
        energy = Math.min(100, energy + 35); 
        print("🔨 Тяжелое сокрушение!"); 
    }
    if (type === 'heal') { 
        player.hp = Math.min(player.maxHp, player.hp + 45); 
        print("🔧 Восстановление систем...", "log-heal"); 
    }
    if (type === 'ult') { 
        dmg = player.atk * 5; 
        energy = 0; 
        print("🚀 СИСТЕМНАЯ ПЕРЕГРУЗКА: КРИТ!", "log-crit"); 
    }

    if (type !== 'heal') {
        let finalDmg = Math.round(dmg + Math.random() * 10);
        enemy.hp -= finalDmg;
        print(`⚔️ Нанесено ${finalDmg} урона по ${enemy.name}`);
    }

    updateUI();

    // Ответный ход
    if (enemy.hp > 0) {
        setTimeout(() => {
            let ed = Math.round(enemy.atk + Math.random() * 5);
            player.hp -= ed;
            print(`🤖 ${enemy.name} атакует: -${ed} HP`, "log-crit");
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 200);
            updateUI();
            if (player.hp <= 0) print("💀 ВНИМАНИЕ: КРИТИЧЕСКИЙ СБОЙ. ГЕЙМ ОВЕР.", "log-crit");
        }, 400);
    } else {
        // Победа
        const gainXP = 40 + (stage * 15);
        player.xp += gainXP;
        credits += 150;
        print(`🏆 Сектор очищен! +150c, +${gainXP} XP`, "log-xp");
        checkLvlUp();
        
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('shop-actions').classList.remove('hidden');
        updateUI();
    }
};

// ПОКУПКИ
window.buy = function(item) {
    if (credits >= 100) {
        credits -= 100;
        if (item === 'atk') player.atk += 15;
        if (item === 'hp') { player.maxHp += 50; player.hp = player.maxHp; }
        print("💰 Модификация установлена.", "log-heal");
        updateUI();
    }
};

// НОВЫЙ УРОВЕНЬ
window.nextLevel = function() {
    stage++;
    const types = ["TITAN", "SCOUT", "GUARD"];
    const colors = ["#e74c3c", "#f1c40f", "#3498db"];
    const idx = Math.floor(Math.random() * types.length);
    
    enemy = {
        type: types[idx],
        color: colors[idx],
        name: "CYBER-" + types[idx],
        maxHp: Math.round(200 * Math.pow(1.25, stage - 1)),
        hp: Math.round(200 * Math.pow(1.25, stage - 1)),
        atk: 15 + (stage * 5)
    };
    
    document.getElementById('battle-actions').classList.remove('hidden');
    document.getElementById('shop-actions').classList.add('hidden');
    print(`🚨 Входим в Сектор ${stage}... Обнаружен ${enemy.name}`);
    updateUI();
};

// Старт
window.onload = updateUI;