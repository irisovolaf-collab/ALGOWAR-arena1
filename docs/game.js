// ASCII-графика врагов
const arts = {
    TITAN: `
      _______
     |  ___  |
     | |   | |
     | |___| |
     |_______|
     /       \\
    / [X] [X] \\
    |    ^    |
    \\_________/`,
    SCOUT: `
       /\\
      /  \\
     | -- |
     | !! |
      \\__/
      /  \\
     /____\\`,
    GUARD: `
     _________
    |  _____  |
    | |  I  | |
    | |_____| |
    |_________|
    [#########]
    [#########]`
};

// Состояние игры
let stage = 1;
let credits = 0;
let energy = 0;
let player = { hp: 100, maxHp: 100, atk: 40 };
let enemy = { name: "CYBER-TITAN", hp: 200, maxHp: 200, atk: 15, type: "TITAN", color: "#e74c3c" };

// Функция обновления экрана
function updateUI() {
    document.getElementById('stage-title').innerText = "SECTOR " + stage;
    document.getElementById('credits-display').innerText = "Credits: " + credits;
    document.getElementById('energy-bar').style.width = energy + "%";
    document.getElementById('ult-button').style.display = (energy >= 100) ? "inline-block" : "none";
    
    document.getElementById('player-hp-bar').style.width = (player.hp / player.maxHp * 100) + "%";
    document.getElementById('enemy-hp-bar').style.width = (enemy.hp / enemy.maxHp * 100) + "%";
    document.getElementById('player-hp-text').innerText = Math.round(player.hp) + "/" + player.maxHp;
    document.getElementById('enemy-hp-text').innerText = Math.round(enemy.hp) + "/" + enemy.maxHp;
    
    const visual = document.getElementById('enemy-visual');
    visual.innerText = arts[enemy.type] || arts.TITAN;
    visual.style.color = enemy.color;
    document.getElementById('enemy-name').innerText = enemy.name;
    document.getElementById('enemy-name').style.color = enemy.color;
}

// Вывод текста в лог
function print(msg, cls = "") {
    const log = document.getElementById('log');
    log.innerHTML += `<p class="${cls}">${msg}</p>`;
    log.scrollTop = log.scrollHeight;
}

// БОЕВАЯ ЛОГИКА
window.attack = function(type) {
    if (player.hp <= 0 || enemy.hp <= 0) return;

    let dmg = 0;
    if (type === 'quick') { 
        dmg = player.atk * 0.8; 
        energy = Math.min(100, energy + 25); 
        print("⚡ Быстрая атака по " + enemy.name); 
    }
    if (type === 'heavy') { 
        dmg = player.atk * 1.5; 
        energy = Math.min(100, energy + 35); 
        print("🔨 Тяжелый удар!"); 
    }
    if (type === 'heal') { 
        player.hp = Math.min(player.maxHp, player.hp + 40); 
        print("🔧 Система восстановлена", "log-heal"); 
    }
    if (type === 'ult') { 
        dmg = player.atk * 4.5; 
        energy = 0; 
        print("🚀 КРИТИЧЕСКАЯ ПЕРЕГРУЗКА!", "log-crit"); 
    }

    if (type !== 'heal') {
        let finalDmg = Math.round(dmg + Math.random() * 10);
        enemy.hp -= finalDmg;
        print("⚔️ Нанесено: " + finalDmg);
    }

    updateUI();

    // Ответ врага
    if (enemy.hp > 0) {
        setTimeout(() => {
            let ed = Math.round(enemy.atk + Math.random() * 5);
            player.hp -= ed;
            print("🤖 " + enemy.name + " атаковал: -" + ed + " HP", "log-crit");
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 200);
            updateUI();
            if (player.hp <= 0) print("💀 СИСТЕМНЫЙ СБОЙ: ВЫ ПОГИБЛИ", "log-crit");
        }, 400);
    } else {
        credits += 125;
        print("🏆 СЕКТОР ЗАЧИЩЕН!", "log-heal");
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('shop-actions').classList.remove('hidden');
    }
};

// МАГАЗИН
window.buy = function(item) {
    if (credits >= 100) {
        credits -= 100;
        if (item === 'atk') player.atk += 15;
        if (item === 'hp') { player.maxHp += 50; player.hp = player.maxHp; }
        print("💰 Улучшение установлено", "log-heal");
        updateUI();
    }
};

// ПЕРЕХОД
window.nextLevel = function() {
    stage++;
    energy = Math.min(energy, 30);
    
    const types = ["TITAN", "SCOUT", "GUARD"];
    const colors = ["#e74c3c", "#f1c40f", "#3498db"];
    const idx = Math.floor(Math.random() * types.length);
    
    enemy.type = types[idx];
    enemy.color = colors[idx];
    enemy.name = "CYBER-" + enemy.type;
    enemy.maxHp = Math.round(200 * Math.pow(1.2, stage - 1));
    enemy.hp = enemy.maxHp;
    enemy.atk = 15 + (stage * 4);

    document.getElementById('battle-actions').classList.remove('hidden');
    document.getElementById('shop-actions').classList.add('hidden');
    print("🚨 ВХОД В СЕКТОР " + stage + "...");
    updateUI();
};

// Инициализация при загрузке
window.onload = updateUI;