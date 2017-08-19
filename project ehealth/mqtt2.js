$(document).ready(function(){
    var value = new TimeSeries();
    var chart = new SmoothieChart({timestampFormatter:SmoothieChart.timeFormatter});
      /*setInterval(function() {
        random.append(new Date().getTime(), Math.random() * 10000);
      }, 500);
*/      
      function createTimelineEMG() {
        seriesdata=1;
        /*chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });*/
        chart.addTimeSeries(value, {lineWidth:2,strokeStyle:'#00ff00'})
        chart.streamTo(document.getElementById("graph"), 10);
      }

      function createTimelineECG() {
        seriesdata=1;
        /*chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });*/
        chart.addTimeSeries(value, {lineWidth:2,strokeStyle:'#00ff00'})
        chart.streamTo(document.getElementById("graph"), 10);
      }

      function createTimelineAIR() {
        seriesdata=1;
        /*chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });*/
        chart.addTimeSeries(value, {lineWidth:2,strokeStyle:'#00ff00'})
        chart.streamTo(document.getElementById("graph"), 10);
      }


  var client = new Paho.MQTT.Client("broker.hivemq.com", 8000, "ehlex");

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({onSuccess:onConnect});

  var topicb="ehealth1browser";
  var topicp="ehealth1python";

  var seriesdata=0;



  var $btnTEMP = $('#btnTEMP');
  var $btnBP = $('#btnBP');
  var $btnPULSE = $('#btnPULSE');
  var $btnGSR = $('#btnGSR');
  var $btnEMG = $('#btnEMG');
  var $btnECG = $('#btnECG');
  var $btnAIR = $('#btnAIR');
  var $btnSTOP = $('#btnSTOP');
  var $result=$('#res');


  // called when the client connects
  function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      client.subscribe(topicb);
      //var message = new Paho.MQTT.Message("Hello");
      //message.destinationName = topic;
      //client.send(message);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
      
      }
  }

  // called when a message arrives
  function onMessageArrived(message) {
      res=message.payloadString;
      console.log("Recieved:"+res);
      $result.text(res);
      if(seriesdata==1){
        if(res.length>=2){
          value.append(new Date().getTime(), res);
        }
      }
      
  }

  function sendMessage(command){
    console.log("Seding:"+command);
    command=command;
    var msg=new Paho.MQTT.Message(command);
    msg.destinationName=topicp;
    client.send(msg);

  }
  
  
  $btnTEMP.click(function(){
    sendMessage("TAKETEMP");
  });
  $btnBP.click(function(){
    sendMessage("TAKEBP");
  }); 
  $btnPULSE.click(function(){
    sendMessage("TAKEPLXY");
  });

  $btnGSR.click(function(){
    sendMessage("TAKEGSR");
  });
  $btnEMG.click(function(){
    sendMessage("TAKEEMG");
    createTimelineEMG();

  });
  $btnECG.click(function(){
    sendMessage("TAKEECG");
    createTimelineECG();
  });

  $btnAIR.click(function(){
    sendMessage("TAKEAIR");
    createTimelineAIR();
  });
  
  $btnSTOP.click(function(){
    sendMessage("S");
    seriesdata=1;
    chart.stop();
    client.disconnect();
    client.connect({onSuccess:onConnect});
  });

});