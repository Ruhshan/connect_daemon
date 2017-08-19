$(document).ready(function(){
    var value = new TimeSeries();
    var chart = new SmoothieChart({timestampFormatter:SmoothieChart.timeFormatter});
      /*setInterval(function() {
        random.append(new Date().getTime(), Math.random() * 10000);
      }, 500);
*/      
      function createTimelineEMG() {

        /*chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });*/
        chart.addTimeSeries(value, {lineWidth:2,strokeStyle:'#00ff00'})
        chart.streamTo(document.getElementById("graph"), 10);
      }

      function createTimelineECG() {

        /*chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });*/
        chart.addTimeSeries(value, {lineWidth:2,strokeStyle:'#00ff00'})
        chart.streamTo(document.getElementById("graph"), 10);
      }

      function createTimelineAIR() {

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

  var topic="ehealth1";
  var topic="ehealth1";



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
      client.subscribe(topic);
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
      
      if(message.payloadString[0]=='<'){
        res=res.replace('<','')
        console.log("onMessageArrived:"+res);
        $result.text(res);
      }
      //dealing with EMG results
      if(message.payloadString[0]=='e'){
        res=res.replace('e','')
        $result.text(res);
        console.log("MessageArrived:"+res);

        if(res.length>=2){
          value.append(new Date().getTime(), res);
        }        
        
      }
      //dealing with ECG results
      if(message.payloadString[0]=='c'){
        res=res.replace('c','')
        $result.text(res);
        console.log("MessageArrived:"+res);

        if(res.length>=2){
          value.append(new Date().getTime(), res);
        }

      } 
      //dealing with AIRflow results       
      if(message.payloadString[0]=='a'){
        res=res.replace('a','')
        $result.text(res);
        console.log("MessageArrived:"+res);

        if(res.length>=2){
          value.append(new Date().getTime(), res);
        }  
      }
      
  }

  function sendMessage(command){
    console.log(command);
    command='>'+command;
    var msg=new Paho.MQTT.Message(command);
    msg.destinationName=topic;
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
    chart.stop();
    client.disconnect();
    client.connect({onSuccess:onConnect});
  });

});