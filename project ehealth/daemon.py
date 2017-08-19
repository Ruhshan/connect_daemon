import paho.mqtt.client as mqtt
import serial
import time

topic="ehealth1"

ser=serial.Serial('/dev/ttyACM0',9600)
transmitting=0

def on_connect(client, userdata, rc):
	print "Connected wth result code:",str(rc)
	# Subscribing in on_connect() means that if we lose the connection and
	# reconnect then subscriptions will be renewed.
	client.subscribe(topic)

def on_message(client, userdata, msg):
	incoming=str(msg.payload)
	global transmitting
	
	if ser.isOpen()==False:
	 	ser.open()

	#dealing with message transmitted only from webapp client, this is indicated by starting with '>'	
	if incoming[0]=='>':
		print "Topic:", msg.topic+'\nMessage: '+incoming
		#stopper of live transmission
		if(incoming[1:]=="S"):
			ser.write("S")
			client.disconnect
			client.connect("broker.hivemq.com", 1883, 60)
			transmitting=0
			ser.close()
			#ser=serial.Serial('/dev/ttyACM0',9600)
			#ser.open()
			

		#when transmitting is 1, daemon won't write the recieved data to serial port
		if transmitting==0:
			print "writing:",incoming[1:]+'#'
			try:
				ser.write(incoming[1:]+'#')
			except:
				print "not open"
				ser.open()
		
		if(incoming[1:]=="TAKEEMG"):
			#starting with 'e' will help web client to identify emg signal
			reply='e'+ser.readline().rstrip()
			print 'reply:',reply
			send_message(topic, reply)
			transmitting=1
			send_message(topic,'>'+'TAKEEMG')
				
		elif(incoming[1:]=="TAKEECG"):
				#starting with 'c' will help web client to identify ecg signal
				reply='c'+ser.readline().rstrip()
				print 'reply:',reply
				send_message(topic, reply)
				transmitting=1
				send_message(topic,'>'+'TAKEECG')
				
		elif(incoming[1:]=="TAKEAIR"):
				#starting with 'a' will help web client to identify airflow signal
				reply='a'+ser.readline().rstrip()
				print 'reply:',reply
				send_message(topic, reply)
				emgon=1
				send_message(topic,'>'+'TAKEAIR')
				
		elif(incoming[1]!='S'):
			reply='<'+ser.readline().rstrip()
			print 'reply:',reply
			send_message(topic, reply)
	# if ser.isOpen()==True:
	# 	ser.close()	


def send_message(topic, message):
	client.publish(topic, message)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message


client.connect("broker.hivemq.com", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()

