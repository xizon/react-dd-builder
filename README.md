# React DD Builder


[![Travis CI](https://api.travis-ci.org/xizon/react-dd-builder.svg?branch=master)](https://travis-ci.org/xizon/react-dd-builder/)
[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=0.0.1&x2=0)](https://www.npmjs.com/package/react-dd-builder)
[![license](https://img.shields.io/badge/license-gpl3-brightgreen.svg)](LICENSE)



## Table of Contents


* [Getting Started](#getting-started)
* [Description](#description)
* [Installation And Test](#installation-and-test)
* [How To Use？](#how-to-use)
* [Contributing](#contributing)
* [Changelog](#changelog)
* [Licensing](#licensing)
* [Buy Me a Coffee](#buy-me-a-coffee)



## Description

React DD Builder is a set of React drag and drop tool to help you build beautiful website interfaces while keeping responsive and third-party framework compatible.


* * *


## Installation And Test

**Step 1.** Use NPM (Locate your current directory of project, and enter the following command.) or download the latest version from [Github](https://github.com/xizon/react-dd-builder). For nodejs you have to install some dependencies.

```sh
$ sudo npm install react-dd-builder
```

Or clone the repo to get all source files including build scripts: 

```sh
$ git clone git://github.com/xizon/react-dd-builder.git
```


**Step 2.** First, using an absolute path into your `"react-dd-builder/"` folder directory.

```sh
$ cd /{your_directory}/react-dd-builder
```


**Step 3.** Before doing all dev stuff make sure you have `Node 10+` installed. After that, run the following code in the main directory to install the node module dependencies.

```sh
$ sudo npm install --save-dev  --unsafe-perm node-sass
```


**Step 4.** Run the following code to enter development mode. The converted ES5 files will be created.

```sh
$ npm run build
```

**Step 5.** When you done, this will spin up a server that can be accessed at

```sh
http://localhost:8080/examples/
```


### Note:
 
**ERROR: npm update check failed.**

```sh
$ sudo chown -R $USER:$(id -gn $USER) /Users/{username}/.config
```



* * *


## File Structures



```sh

react-dd-builder/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── webpack.config.js
├── package-lock.json
├── package.json
├── dist/
│   ├── css/
│   │   ├── app.css
│   │   ├── app.css.map
│   │   ├── app.min.css
│   │   └── app.min.css.map
│   └── js/
│   │   ├── app.js
│   │   ├── app.js.map
│   │   ├── app.min.js
│   │   └── app.min.js.map
├── src/
│   ├── index.js
│   ├── components/
├── examples/
└──
```



## Contributing

Finding bugs, sending pull requests or improving our docs - any contribution is welcome and highly appreciated. To get started, head over to our [contribution guidelines](CONTRIBUTING.md). Thanks!


## Changelog

[releases](CHANGELOG.md)



## Licensing

Licensed under the [MIT](https://opensource.org/licenses/MIT).



## Buy Me a Coffee
Donations would be more than welcome :)

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PYZLU7UZNQ6CE)

