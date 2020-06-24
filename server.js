const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  response.send("OK");
});
app.listen(process.env.PORT);

const Discord = require("discord.js");
const fs = require("fs");
const { get } = require("node-superfetch");
const moment = require("moment");

const client = new Discord.Client();
client.login(process.env.SECRET)


client.on("ready", () => {
  console.log("Online!")
let i = 0
  async function baro() {
    
  let body = await get(`https://api.warframestat.us/pc/voidTrader`).then(i => i.body)
  let fechaOn = body.activation
  let fechaOff = body.expiry
  let start = body.startString
  let end = body.endString
  fechaOn = moment(fechaOn);
  fechaOff = moment(fechaOff);
  let D = fechaOn.format("DD")
  let Y = fechaOn.format("YYYY")
  let M = fechaOn.format("MM")
  let DD = fechaOff.format("DD")
  let YY = fechaOff.format("YYYY")
  let MM = fechaOff.format("MM")

    let estados =[body.active === false ? "Baro viene en: "+start : "Baro se va en: "+end, "Espiar a Natzka", body.active === false ? D+"/"+M+"/"+Y+" 11:00:00" : DD+"/"+MM+"/"+YY+" 11:00:00"]
    
     client.user.setPresence({
       game: { 
         name: i > parseInt(estados.length)-1 ? estados[0] : estados[i]
       }, 
         status: 'online' 
     })
    i > parseInt(estados.length)-1 ? i =1 : i++
}
  setInterval(baro, 5000)
  
  /*async function descr() {
    let body = await get(`https://api.warframestat.us/pc/cetusCycle`).then(i => i.body)
    let desc
    if(body.isDay === true) {
      var end = new Date(body.expiry);
      var _second = 1000;
      var _minute = _second * 60;
      var _hour = _minute * 60;
      var _day = _hour * 24;
      
      var now = new Date();
      var distance = end - now;
      
      var days = Math.floor(distance / _day);
      var hours = Math.floor((distance % _day) / _hour);
      var minutes = Math.floor((distance % _hour) / _minute);
      var seconds = Math.floor((distance % _minute) / _second);
      desc = "Noche en: "+hours+"h "+minutes+"m "+seconds+"s";
    } else if(body.isDay === false) {
      var end = new Date(body.expiry);
      var _second = 1000;
      var _minute = _second * 60;
      var _hour = _minute * 60;
      var _day = _hour * 24;
      
      var now = new Date();
      var distance = end - now;
      
      var days = Math.floor(distance / _day);
      var hours = Math.floor((distance % _day) / _hour);
      var minutes = Math.floor((distance % _hour) / _minute);
      var seconds = Math.floor((distance % _minute) / _second);
      desc = "Dia en: "+hours+"h "+minutes+"m "+seconds+"s";
    }
    let canal = client.channels.get("684202731916754973")
    // console.log(desc)
    canal.edit({topic: desc})
  }
  setInterval(descr, 15000)
  */
})

client.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
  if (err) console.error(err);
  let jsFiles = files.filter(f => f.split(".").pop() === "js");
  if (jsFiles.length <= 0) {
    console.log("No hay comandos para cargar");
    return;
  }
  console.log(`Cargando ${jsFiles.length} comandos`);

  jsFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    client.commands.set(props.help.name, props);
    client.commands.set(props.help.aliase, props);
  });
});

let prefix = "$";
client.on("message", async message => {
  let guild = message.guild;
  let args = message.content.split(" ").slice(1).join(" ");
  let command = message.content.toLowerCase().split(" ")[0];
  if (!command.startsWith(prefix)) return;

  let cmd = client.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(client, message, args);
});

client.on("guildMemberAdd", member =>  {
  let rol = client.guilds.get("460864333799227402").roles.get("460877669693784064");
  member.addRole(rol);
})