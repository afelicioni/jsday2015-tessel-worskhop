var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['A']);
console.log(ambient);

var mqtt = require('mqtt').connect('mqtt://test.mosca.io?clientId=unicorno');

ambient.on('ready', function () {
  setInterval( function () {
    ambient.getLightLevel( function(err, ldata) {
      ambient.getSoundLevel( function(err, sdata) {
        console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
    });
  })}, 500); // The readings will happen every .5 seconds unless the trigger is hit

  ambient.setLightTrigger(0.5);
  ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);
    mqtt.publish('tessel/light', 'trigger ' + time)
    ambient.clearLightTrigger();
    setTimeout(function () { 
        ambient.setLightTrigger(0.5);
    },1500);
  });

  ambient.setSoundTrigger(0.1);
  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);
    ambient.clearSoundTrigger();
    setTimeout(function () { 
        ambient.setSoundTrigger(0.1);
    },1500);
  });
});

ambient.on('error', function (err) {
  console.log(err)
});

mqtt.on('connect', function () {
  console.log('connesso')
  mqtt.publish('tessel/status', 'online')
})

mqtt.on('message', function (topic, payload) {
  payload = payload.toString()

  tessel.button.on('press', function (time) {
    mqtt.publish('tessel/button', 'pressed ' + time)
    console.log('the button was pressed!', time)
  })
})

console.log('tento connessione')

