all: install run
install:
	npm install
run:
	heroku local web
clean:
	rm public/*.js public/*.js.map
