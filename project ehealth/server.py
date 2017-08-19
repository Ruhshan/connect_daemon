from bottle import route, run, template,response,static_file,request
import string, random


@route('/<filename>')
def main_app(filename):
	sf=static_file(filename, root="./")
	sf.set_cookie("UniqID", '1')
	return sf

run(host='0.0.0.0', port=6678)





