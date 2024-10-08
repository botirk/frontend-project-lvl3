install:
	npm install

build:
	npm run build

serve:
	npx webpack serve
	
lint:
	npx eslint .

test:
	npm test

publish:
	npm publish --dry-run

chmod:
	sudo chmod -R 775 .