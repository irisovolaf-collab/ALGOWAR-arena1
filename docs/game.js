const arts = {
    TITAN: `\n      _______\n     |  ___  |\n     | |   | |\n     | |___| |\n     |_______|\n     /       \\\n    / [X] [X] \\\n    |    ^    |\n    \\_________/`,
    SCOUT: `\n       /\\\n      /  \\\n     | -- |\n     | !! |\n      \\__/\n      /  \\\n     /____\\`,
    GUARD: `\n     _________\n    |  _____  |\n    | |  I  | |\n    | |_____| |\n    |_________|\n    [#########]\n    [#########]`,
    BOSS: `\n      /XXXXXXXXX\\\n     |  _     _  |\n     | [O]   [O] |\n     |     V     |\n     |  _______  |\n     |  \\_____/  |\n      \\_________/\n      /|       |\\\n     / |       | \\`
};

let player = { hp: 100, maxHp: 100, atk: 40, lvl: 1, xp: 0, nextXp: 100 };
let stage = 1, credits = 0, energy = 0;
let enemy = { name: "CYBER-TITAN", hp: 200, maxHp: 200, atk: 15, type: "TITAN", color: "#e74c3c" };

function updateUI() {
    document.getElementById('stage-title').innerText = (stage % 5 === 0) ? "!!! BOSS SECTOR !!!" : "SECTOR " + stage;
    document.getElementById('credits-display').innerText = "Credits: " + credits;
    document.getElementById('player-lvl').innerText = "LVL: " + player.lvl;
    document.getElementById('energy-bar').style.width = energy + "%";
    document.getElementById('xp-bar').style.width = (player.xp / player.nextXp * 100) + "%";
    document.getElementById('ult-button').style.display = (energy >= 100) ? "inline-block" : "none";
    document.getElementById('player-hp-bar').style.width = (player.hp / player.maxHp * 100) + "%";
    document.getElementById('enemy-hp-bar').style.width = (enemy.hp / enemy.maxHp * 100) + "%";
    document.getElementById('player-hp-text').innerText = Math.round(player.hp) + "/" + player.maxHp;
    document.getElementById('enemy-hp-text').innerText = Math.round(enemy.hp) + "/" + enemy.maxHp;
    
    const visual = document.getElementById('enemy-visual');
    visual.innerText = arts[enemy.type];
    visual.style.color = enemy.color;
    visual.style.transform = (enemy.type === 'BOSS') ? "scale(1.3)" : "scale(1)";
    document.getElementById('enemy-name').innerText = enemy.name;
    document.getElementById('enemy-name').style.color = enemy.color;
}

function print(msg, cls = "") {
    const log = document.getElementById('log');
    log.innerHTML += `<p class="${cls}">${msg}</p>`;
    log.scrollTop = log.scrollHeight;
}

window.attack = function(type) {
    if (player.hp <= 0 || enemy.hp <= 0) return;
    let dmg = 0;
    if (type === 'quick') { dmg = player.atk * 0.8; energy = Math.min(100, energy + 25); }
    if (type === 'heavy') { dmg = player.atk * 1.5; energy = Math.min(100, energy + 35); }
    if (type === 'heal') { player.hp = Math.min(player.maxHp, player.hp + 45); print("🔧 Repairing...", "log-heal"); }
    if (type === 'ult') { dmg = player.atk * 5; energy = 0; print("🚀 OVERLOAD!", "log-crit"); }

    if (type !== 'heal') {
        let fDmg = Math.round(dmg + Math.random() * 10);
        enemy.hp -= fDmg;
        print(`⚔️ Dealt ${fDmg} dmg to ${enemy.name}`);
    }
    updateUI();

    if (enemy.hp > 0) {
        setTimeout(() => {
            let ed = Math.round(enemy.atk + (Math.random() * 5));
            player.hp -= ed;
            print(`🤖 ${enemy.name} attacks: -${ed} HP`, "log-crit");
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 200);
            updateUI();
        }, 400);
    } else {
        let bonus = (enemy.type === 'BOSS') ? 500 : 150;
        credits += bonus;
        player.xp += (enemy.type === 'BOSS') ? 200 : 50;
        print(`🏆 Victory! +${bonus} credits!`, "log-xp");
        checkLvlUp();
        document.getElementById('battle-actions').classList.add('hidden');
        document.getElementById('shop-actions').classList.remove('hidden');
        updateUI();
    }
};

function checkLvlUp() {
    if (player.xp >= player.nextXp) {
        player.lvl++; player.xp -= player.nextXp; player.nextXp = Math.round(player.nextXp * 1.6);
        player.maxHp += 30; player.hp = player.maxHp; player.atk += 12;
        print(`🌟 LEVEL UP! You are now LVL ${player.lvl}`, "log-xp");
    }
}

window.buy = function(item) {
    if (credits >= 100) {
        credits -= 100;
        if (item === 'atk') player.atk += 15;
        if (item === 'hp') { player.maxHp += 50; player.hp = player.maxHp; }
        updateUI();
    }
};

// --- EVENTS SYSTEM ---
window.triggerEvent = function() {
    document.getElementById('shop-actions').classList.add('hidden');
    if (Math.random() < 0.4) { // 40% chance for event
        document.getElementById('event-screen').classList.remove('hidden');
        print("🚨 SIGNAL DETECTED: Abandoned data terminal found. Access it?", "log-event");
    } else {
        window.nextLevel();
    }
};

window.resolveEvent = function(choice) {
    document.getElementById('event-screen').classList.add('hidden');
    if (choice === 'risk') {
        if (Math.random() > 0.5) {
            credits += 200; print("💰 Hack successful! +200 credits.", "log-heal");
        } else {
            player.hp -= 30; print("⚠️ Security trap! -30 HP.", "log-crit");
        }
    } else {
        print("Safely bypassed the signal.");
    }
    updateUI();
    setTimeout(window.nextLevel, 1000);
};

window.nextLevel = function() {
    stage++;
    if (stage % 5 === 0) {
        enemy = { name: "OMEGA-SENTINEL", hp: 600 + (stage * 20), maxHp: 600 + (stage * 20), atk: 30 + stage, type: "BOSS", color: "#8e44ad" };
        print("⚠️ WARNING: BOSS SIGNATURE DETECTED!", "log-crit");
    } else {
        const types = ["TITAN", "SCOUT", "GUARD"];
        const colors = ["#e74c3c", "#f1c40f", "#3498db"];
        const idx = Math.floor(Math.random() * types.length);
        enemy = { type: types[idx], color: colors[idx], name: "CYBER-" + types[idx], maxHp: Math.round(200 * Math.pow(1.2, stage-1)), hp: Math.round(200 * Math.pow(1.2, stage-1)), atk: 15 + (stage * 3) };
    }
    document.getElementById('battle-actions').classList.remove('hidden');
    updateUI();
};

window.onload = updateUI;