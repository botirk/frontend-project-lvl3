install:
	npm install

run:
	npm install && npx webpack
	
lint:
	npx eslint .

test:
	npm test

publish:
	npm publish --dry-run

chmod:
	sudo chmod -R 775 .