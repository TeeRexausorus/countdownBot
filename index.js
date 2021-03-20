//init pour Discord
require('dotenv').config();
const Discord = require('discord.js');
const {Client} = require('pg');

const bot = new Discord.Client();
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false},
});
const TOKEN = process.env.TOKEN;
const countDownDate = new Date("Mar 20, 2021 21:07:00").getTime();
const regexRoll = /!roll ([1-9][0-9]*)(d|D)([1-9][0-9]*)/gm;
const regexFakeRoll = /!r•ll ([1-9][0-9]*)(d|D)([1-9][0-9]*)/gm;
const regexCountupAdd = /!countup add (.*)/gm;

bot.login(TOKEN).then(() => console.log('bot created'))
    .catch(err => console.error('bot creation error', err.stack));

client
    .connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack));

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function roll(nbDice, dice) {
    let arrayDices = [];
    for (let i = 0; i < nbDice; ++i) {
        arrayDices.push(getRandomInt(dice) + 1);
    }
    return arrayDices;
}

function fakeroll(nbDice, dice) {
    let arrayDices = [];
    for (let i = 0; i < nbDice; ++i) {
        arrayDices.push(parseInt(dice));
    }
    return arrayDices;
}


function countdown(message) {
    if (message.author.username === 'Blue') {
        message.channel.send(getCountdownAsString(0));
    } else {
        message.channel.send(getCountdownAsString());
    }
}

function slap(message) {
    message.channel.send(getSlapCountdownAsString());
}

function love(message) {
    message.channel.send(`/❤️/♪·* ~🧡~ '♪ /💛/ ♪·* ~💚 ~ '♪ /💙/ ♪·* ~💜~`);
}

function hate(message) {
    message.channel.send('There is no hate here. Take some love instead:');
    message.channel.send(`/❤️/♪·* ~🧡~ '♪ /💛/ ♪·* ~💚 ~ '♪ /💙/ ♪·* ~💜~`);
}

function countup(message) {
    const username = message.author.username;
    client.query('SELECT username, emoji FROM userEmoji WHERE username LIKE $1;', [username], (err, res) => {
        message.channel.send(res.rows.length > 0 ? res.rows[0].emoji : '🌻');
    });
    client.query('UPDATE userEmoji SET nbUse = nbUse + 1 WHERE username=$1;', [username]);
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

function countupCount(message) {
    const username = message.author.username;
    client.query('SELECT nbUse FROM userEmoji WHERE username LIKE $1;', [username], (err, res) => {
        let strBin = dec2bin(res.rows[0].nbuse);
        let strOut = '';
        for (let i = 0; i < strBin.length; ++i) {
            strOut += strBin[i] === '0' ? '👌' : '🖕';
        }
        message.channel.send(strOut);
    });
    client.query('UPDATE userEmoji SET nbUse = nbUse + 1 WHERE username=$1;', [username]);
}

function getCountdownAsString(blockedVal) {
    // Get today's date and time
    let now = new Date().getTime() + (1000 * 60 * 60);

    // Find the distance between now and the countdown date
    let distance = countDownDate - now;
    let distanceCalc = distance > 0 ? distance : -distance;
    let days = Math.floor(distanceCalc / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distanceCalc % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distanceCalc % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distanceCalc % (1000 * 60)) / 1000);
    let outputBrute = distance > 0 ? `Les mariages auront lieu dans ${days} jours, ${hours} heures, ${minutes} minutes, et ${seconds} secondes.` :
        `Les mariages ont eu lieu il y a ${days} jours, ${hours} heures, ${minutes} minutes, et ${seconds} secondes.`;

    let randomVal = blockedVal >= 0 ? blockedVal : getRandomInt(6);
    switch (randomVal) {
        case 0:
            return ('```ini' + '\n[' + outputBrute + ']\n```');
        case 1:
            return ('```diff' + '\n- ' + outputBrute + '\n```');
        case 2:
            return ('```css' + '\n[' + outputBrute + ']\n```');
        case 3:
            return ('```fix' + '\n' + outputBrute + '\n```');
        case 4:
            return ('```css' + '\n"' + outputBrute + '"\n```');
        case 5:
            return ('```bash' + '\n"' + outputBrute + '"\n```');
        default:
            return ('```diff' + '\n- ' + outputBrute + '\n```');
    }
}

function getSlapCountdownAsString(blockedVal) {
    let outputBrute = `on aura attendu Slap et Blue pendant 0 heure(s), 40 minute(s), et 42 seconde(s).`;

    let randomVal = blockedVal >= 0 ? blockedVal : getRandomInt(6);
    switch (randomVal) {
        case 0:
            return ('```ini' + '\n[' + outputBrute + ']\n```');
        case 1:
            return ('```diff' + '\n- ' + outputBrute + '\n```');
        case 2:
            return ('```css' + '\n[' + outputBrute + ']\n```');
        case 3:
            return ('```fix' + '\n' + outputBrute + '\n```');
        case 4:
            return ('```css' + '\n"' + outputBrute + '"\n```');
        case 5:
            return ('```bash' + '\n"' + outputBrute + '"\n```');
        default:
            return ('```diff' + '\n- ' + outputBrute + '\n```');
    }
}


bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

function insertCountup(username, emoji, message) {
    const insert = 'INSERT INTO userEmoji(username, emoji) VALUES($1, $2) ' +
        'ON CONFLICT (username) ' +
        'DO UPDATE SET emoji=EXCLUDED.emoji RETURNING *';
    client.query(insert, [username, emoji])
        .then(res => {
            message.channel.send(`'${emoji}' défini pour ${username} 😀`)
        });
}

bot.on('message', message => {

    if (message.content.includes('!countdown')) {
        countdown(message);
    }
    if (message.content.includes('!love')) {
        love(message);
    }
    if (message.content.includes('!hate')) {
        hate(message);
    }
    if (message.content.includes('!slap')) {
        slap(message);
    }
    if (message.content.includes('!countup')) {
        let m;
        if (message.content.includes('add')) {
            // This is necessary to avoid infinite loops with zero-width matches
            while ((m = regexCountupAdd.exec(message.content)) !== null) {
                if (m.index === regexCountupAdd.lastIndex) {
                    regexCountupAdd.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                if (m.length === 2) {
                    insertCountup(message.author.username, m[1], message);
                }
            }
        } else if (message.content === '!countup help') {
            message.channel.send('Use `!countup` to receive a beautiful Emoji.\n' +
                'Use `!countup add *emoji*` (for instance `!countup add 🥰` ) to register your favorite emoji 😀. You can change it by reusing this command.');
        } else {
            if (message.author.username === 'Remouk') {
                countupCount(message);
            } else {
                countup(message);
            }
        }
    }

    if (message.content.includes('!roll')) {
        let m;

        while ((m = regexRoll.exec(message.content)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regexRoll.lastIndex) {
                regexRoll.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            if (m.length === 4) {
                diceResult = roll(m[1], m[3]);
                diceSum = diceResult.reduce(reducer);
                strOut = `${diceSum}` + (m[1] > 1 ? ` (${diceResult})` : ``);
                message.channel.send(strOut);
            }
        }
    }
    if (message.content.includes('!r•ll')) {
        let m;

        while ((m = regexFakeRoll.exec(message.content)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regexFakeRoll.lastIndex) {
                regexFakeRoll.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            if (m.length === 4) {
                diceResult = fakeroll(m[1], m[3]);
                diceSum = diceResult.reduce(reducer);
                strOut = `${diceSum}` + (m[1] > 1 ? ` (${diceResult})` : ``);
                message.channel.send(strOut);
            }
        }
    }

    if (message.content.includes('!hug')) {
        message.channel.send('', {files: ['https://i.imgur.com/sCshJhG.gif']})
    }
});
