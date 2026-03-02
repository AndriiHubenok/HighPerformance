# diarchitect-iar-environment

This project contains the definition of a composed docker environment for integration architectures. It contains the following applications:
- [MariaDB](https://mariadb.org/)
- [OrangeHRM](https://www.orangehrm.com/)
- [openCRX](https://www.opencrx.org/)

## Prerequisites
You need:
- a [docker-environment](https://docs.docker.com/get-docker/)
- the [docker-compose](https://docs.docker.com/compose/install/) plugin
- you need to clone *this* repository

## Setup

To setup the environment, you need to run `firstStart.[sh/bat]` and just wait a bit. This will install the docker containers and
start them. (so `start.[sh/bat]` will only be needed at the second time you want to use the environment)

## Usage

After the initial setup you can use...
- `stop.[sh/bat]` to stop the environment
- `start.[sh/bat]` to start the environment


You will find the UI of OrangeHRM here: [http://localhost:8888](http://localhost:8888)

The credentials of the admin user are:

    username: demouser
    password: *Safb02da42Demo$

You will find the UI of openCRX here: [http://localhost:8887/opencrx-core-CRX/](http://localhost:8887/opencrx-core-CRX/)

The credentials of a "normal" user are:

    username: guest
    password: guest

Please don't wonder about the weird `.[sh/bat]` it just means, that you should
use the filetype, which matches your system. So please use the files with the `.sh` suffix on Unix systems (e.g. Linux / Mac OS)
and the files with the `.bat` suffix on Windows systems.