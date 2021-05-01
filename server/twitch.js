const tmi = require('tmi.js');
const mws = require('./mywebsocket.js');
const twitchClient = new tmi.Client({
    options: {debug: true},
    connection: {reconnect: true},
    identity: {
        username: 'gentilrexbot',
        password: process.env.TWITCH_API
    },
    channels: ['gentilrex']
});
console.log('--- TWITCH START ---');
twitchClient.connect();

twitchClient.on('message', (channel, tags, message, self) => {
    // Ignore echoed messages and non-command messages.
    if (self || !message.startsWith('!')) {
        return;
    }

    function dices() {

        let m;

        while ((m = regexRoll.exec(message)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regexRoll.lastIndex) {
                regexRoll.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            if (m.length === 4) {
                diceResult = roll(m[1], m[3]);
                diceSum = diceResult.reduce(reducer);
                strOut = `${diceSum}` + (m[1] > 1 ? ` (${diceResult})` : ``);
                twitchClient.say(channel, `@${tags.username}, tu as fait ${strOut}`);
            }

        }
    }

    function hug() {
        twitchClient.say(channel, `@${tags.username}, I'm just a bot but I care for you. Here, let me hug you !`);
    }

    function kickban() {
        client.query('SELECT network, peasants, usernickname FROM kickban ORDER BY network;', [], (err, res) => {
            const arrayOut = [];
            console.log(res.rows.length);
            for (let i = 0; i < res.rows.length; ++i) {
                const { network, peasants, usernickname} = res.rows[i];
                arrayOut.push(`${peasants} ${usernickname} sur ${network}`);
            }
            const strOut = arrayOut.join(' ! ');
            console.log(`${strOut} ${arrayOut}`);
            twitchClient.say(channel, `@${tags.username}, Kickban a : ${strOut}`);
        });
    }

    if (channel.includes('gentilrex') || channel.includes('gomarmonkey')) {
        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();
        if (command === 'roll') {
            dices();
        }
        if (command === 'hug'){
            hug();
        }
        if (command === 'kb') {
            kickban();
        }
        if(command === 'break') {
            try{
                mws.notifyWebsocketClient('gentilrex');
            }
            catch{
                twitchClient.say(channel, `@${tags.username}, erreur lors du cassage de la caméra :(`)
            }
            twitchClient.say(channel, `@${tags.username}, arrête de casser la caméra voyons !`);
        }
    }

    if (channel.includes('kickban42')) {
        const args = message.slice(1).split(' ');
        const command = args.shift().toLowerCase();
        if (command === 'kb') {
            kickban();
        }
    }
});
