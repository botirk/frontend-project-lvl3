install:
	npm install
	
run:
	bin/index.js -h
	
lint:
	npx eslint .

test:
	npm test

publish:
	npm publish --dry-run

chmod:
	sudo chmod -R 775 .