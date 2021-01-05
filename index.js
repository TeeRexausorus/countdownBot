require('dotenv').config();
const Discord = require('discord.js');

const bot = new Discord.Client();

const TOKEN = process.env.TOKEN;

const countDownDate = new Date("Mar 20, 2021 12:00:00").getTime();

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getCountdownAsString(blockedVal) {
    // Get today's date and time
    let now = new Date().getTime() + (1000 * 60 * 60);

    // Find the distance between now and the countdown date
    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    let outputBrute = `Les mariages auront lieu dans ${days} jours, ${hours} heures, ${minutes} minutes, et ${seconds} secondes.`;

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

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
    if (message.content === '!countdown') {
        if (message.author.username === 'Blue') {
            message.channel.send(getCountdownAsString(0));
        } else {
            message.channel.send(getCountdownAsString());
        }
    }
});