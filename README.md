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

1. Create a github repo called my-module under the mediasuitenz organisation, on the travis ci site, add the repo
2. Run the following:
```bash
yo ms-npm my-module
```
3. Answer the questions (mostly accept the defaults where applicable)
4. Run the following:
```bash
cd my-module
git add .
git commit -m "Initial commit"
git push origin master #the git remote has already been added by yeoman
```
5. fire up testem 
```bash
npm run test:dev 
```
6. Add your module code to index.js and your tests to the /test folder (as .spec.js files)
7. Commit your changes
8. Version your code (starts at 0.0.0)
```bash
npm version patch -m "added some code"
```
9. push your code
```bash
git push origin master
git push origin --tags
```
10. Publish your module
```bash
npm publish
```

## License

MIT
