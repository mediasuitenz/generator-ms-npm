# generator-ms-npm

> [Yeoman](http://yeoman.io) generator

## Getting Started

### What is Yeoman?

Basically, he lives in your computer, and waits for you to tell him what kind of application you wish to create.

Install yeoman:
```bash
npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't doesn't come with any generators. A generator is like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-ms-npm from npm, run:

```bash
npm install -g generator-ms-npm
```

Finally, initiate the generator:

```bash
yo ms-npm <appname>
```

## Full NPM workflow

Assuming we wish to create a module called my-module

- Create a github repo called my-module under the mediasuitenz organisation, on the travis ci site, add the repo
- Run the following:
```bash
yo ms-npm my-module
```
- Answer the questions (mostly accept the defaults where applicable)
- Run the following:
```bash
cd my-module
git add .
git commit -m "Initial commit"
git push origin master #the git remote has already been added by yeoman
```
- fire up testem 
```bash
npm run test:dev 
```
- Add your module code to index.js and your tests to the /test folder (as .spec.js files)
- Commit your changes
- Version your code (starts at 0.0.0)
```bash
npm version patch -m "added some code"
```
- push your code
```bash
git push origin master
git push origin --tags
```
- Publish your module
```bash
npm publish
```

## License

MIT
