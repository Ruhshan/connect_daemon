import paho.mqtt.client as mqtt
import serial
import time

topicb="ehealth1browser"
topicp="ehealth1python"

ser=serial.Serial('/dev/ttyACM0',9600)
transmitting=0

def on_connect(self,client, userdata, rc):
	print "Connected wth result code:",str(rc)
	# Subscribing in on_connect() means that if we lose the connection and
	# reconnect then subscriptions will be renewed.
	self.subscribe(topicp)

def on_message(client, userdata, msg):
	global transmitting

	incoming=str(msg.payload)

	#dealing with single transmission
	if incoming=='S':
		print "**********"
		ser.write(incoming)
		client.disconnect
		client.connect("iot.eclipse.org", 1883)
		ser.close()
		ser.open()
		transmitting=0

	if incoming in ["TAKETEMP", "TAKEBP", "TAKEGSR","TAKEPLXY"]:
		print 'Recieved: '+incoming

		try:
			ser.write(incoming+'#')
			print "Writing:",incoming+'#'
		except:
			print "Serial not open"

		reply=ser.readline().rstrip()
		print "Sending:",reply
		send_message(topicb,reply)

	elif incoming in ["TAKEEMG","TAKEECG","TAKEAIR"]:

		print 'Recieved: '+incoming

		if transmitting==0:
			print "Writing:",incoming+'#'
			ser.write(incoming+'#')
			transmitting=1

		reply=ser.readline().rstrip()

		print "Sending:",reply
		send_message(topicb,reply)
		send_message(topicp,incoming)

	#Stopper
	else:
		print 'Recieved: '+incoming
		print "Writing:",incoming









def send_message(topic, message):
	client.publish(topic, message)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message



client.connect("broker.hivemq.com", 1883)
#client.connect("iot.eclipse.org", 1883)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
