const Discord = require('discord.js');
const moment = require('moment')
moment.locale('fr');

const client = new Discord.Client();
const settings = require('./embeds-config/settings.json')
const embed = require('./embeds-config/embedaide.json')
const noperm = require('./embeds-config/noperm.json')
const wheremention = require('./embeds-config/wheremention.json')
const wherereason = require('./embeds-config/wherereason.json')

let prefix = settings.prefix
let token = settings.token

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}!`)
  console.log(`Connecté le ${moment().format('LL')} à ${moment().format('LT')}`)
  client.user.setActivity('DisbotRE | ds.help', {
    type: 'WATCHING'
  })
});

client.on('message', message => {
  if (message.author.bot) return;
  let args = message.content.split(' ').slice(1);
  var argresult = args.join(' ');

  if (message.content.startsWith(prefix + 'ping')) {
    message.react('🏓')
    message.channel.send("```" + `${new Date().getTime() - message.createdTimestamp}` + " ms```");
  }
  if (message.content === prefix + 'help') {
    message.author.send({
      embed
    }).catch();
    message.delete()
  }
});

client.on('message', message => {
  if (message.content.startsWith(prefix + 'ban')) {
    if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS")) return message.channel.send({
      embed: noperm
    });
    if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.channel.send({
      embed: noperm
    });
    let user = message.mentions.users.first();
    let reason = message.content.split(' ').slice(2).join(" ");
    let modlog = client.channels.find("name", "modlog")

    if (message.mentions.users.size < 1) return message.channel.send({
      embed: wheremention
    });
    if (!reason) return message.channel.send({
      embed: wherereason
    });
    if (!message.guild.member(user).bannable) return message.channel.send({
      embed: noperm
    });

    message.guild.member(user).ban();

    const modlogembed = new Discord.RichEmbed()
      .setAuthor(`${user.username} a été banni `, user.displayAvatarURL)
      .addField("Informations... ", `**Utilisateur banni :** ${user.tag}\n**Banni par :** ${message.author.tag}\n**Raison :** ${reason}`);
    modlog.send({
      embed: modlogembed
    })
  }
});
client.on('message', message => {
  if (message.content.startsWith(prefix + 'kick')) {
    if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS")) return message.channel.send({
      embed: noperm
    });
    if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) return message.channel.send({
      embed: noperm
    });
    let user = message.mentions.users.first();
    let reason = message.content.split(' ').slice(2).join(" ");
    let modlog = client.channels.find("name", "modlog")

    if (message.mentions.users.size < 1) return message.channel.send({
      embed: wheremention
    });
    if (!reason) return message.channel.send({
      embed: wherereason
    });
    if (!message.guild.member(user).kickable) return message.channel.send({
      embed: noperm
    });

    message.guild.member(user).kick();

    const modlogembed2 = new Discord.RichEmbed()
      .setAuthor(`${user.username} a été expulsé `, user.displayAvatarURL)
      .addField("Informations... ", `**Utilisateur expulsé :** ${user.tag}\n**Expulsé par :** ${message.author.tag}\n**Raison :** ${reason}`);
    modlog.send({
      embed: modlogembed2
    })
  }
})

client.login(token);
