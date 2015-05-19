###
# busybusy-web-app ember-cli update script
#
###

##
# Operating System Type
##
UNAME_S := $(shell uname -s)

##
# version info
##
BREW_VERSION := $(shell brew --version 2>/dev/null)
NODE_VERSION := $(shell node -v 2>/dev/null)
EMBER_VERSION := $(shell ember -v 2>/dev/null)
NODE_UPDATER_VERSION := $(shell n --version 2>/dev/null)

##
# folder info
##
NODE_FILES := $(shell stat -f %N ./node_modules 2>/dev/null)
BOWER_FILES := $(shell stat -f %N ./bower_components 2>/dev/null)
DIST_FILES := $(shell stat -f %N ./dist 2>/dev/null)
TMP_FILES := $(shell stat -f %N ./tmp 2>/dev/null)

##
# user permission
##
PERMISSION := $(shell stat -f %Su:%Sg ~/.ssh 2>/dev/null)

##
# standard commands
##
all: clean install
install: _npm-install _bower-install
update: clean _npm-update install
ember-update: _ember-update
dev-install: _core-setup
clean: _remove-files _clear-npm-cache _clear-bower-cache
permission-change: _set-permission _npm-update

##
# removes node bower and ember files
##
_remove-files: 
ifdef NODE_FILES
	rm -r ./node_modules
endif
ifdef BOWER_FILES
	rm -r ./bower_components
endif
ifdef DIST_FILES
	rm -r ./dist
endif
ifdef TMP_FILES
	rm -r ./tmp
endif

##
# clear npm cache
##
_clear-npm-cache: 
	npm cache clean

##
# clear npm cache
##
_clear-bower-cache: 
	bower cache clean

##
# install npm packages local to current directory
##
_npm-install:
	npm install

##
# updates global npm packages
##
_npm-update:
	npm cache clean -g
	npm update -g

##
# install bower packages local to current directory
##
_bower-install:
	bower install

_ember-update:
	npm update -g ember-cli
	npm update ember-cli
	ember init

##
# update nodejs using n
##
_update-node: _install-node-updater
	sudo n stable
	npm update -g npm

##
# Adds release remote for server updates
#
# NOTE: only works with beta.busybusy.com ssh access
##
_add-beta-remote:
	git remote add release ssh://ubuntu@beta.busybusy.com/home/ubuntu/git-repos/busybusy-web-app.git

##
# node updater install
##
_install-node-updater: _npm-update
ifndef NODE_UPDATER_VERSION
	@echo "Installing node updater..."
	npm install -g n
else
	@echo "node updater is installed @$(NODE_UPDATER_VERSION)"
endif

_set-permission: 
ifdef PERMISSION
	sudo chown $(PERMISSION) /usr/local/bin/npm
	sudo chown -R $(PERMISSION) /usr/local/lib/node_modules
	sudo chown -R $(PERMISSION) ~/.npm
endif

##
# install all the required tools for ember-cli
##
_core-setup:
ifeq ($(UNAME_S),Darwin)
ifndef BREW_VERSION
	@echo "Installing homebrew..."
	ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	brew update
else
	@echo "brew is installed @$(BREW_VERSION)"
endif
ifndef NODE_VERSION
	@echo "Installing nodejs and npm..."
	brew install node
ifdef PERMISSION
	sudo chown $(PERMISSION) /usr/local/bin/npm
	sudo chown -R $(PERMISSION) /usr/local/lib/node_modules
	sudo chown -R $(PERMISSION) ~/.npm
endif
else
	@echo "nodejs is installed @$(NODE_VERSION)"
endif
ifndef EMBER_VERSION
	@echo "Install ember-cli..."
	npm install -g ember-cli
else
	@echo "ember-cli is installed @$(EMBER_VERSION)"
endif
else
ifndef NODE_VERSION
	@echo "Installing nodejs and npm..."
	sudo apt-get install nodejs
	sudo apt-get install npm
	sudo ln -s /usr/bin/nodejs /usr/bin/node
ifdef PERMISSION
	sudo chown $(PERMISSION) /usr/bin/npm
	sudo chown -R $(PERMISSION) /usr/local/lib/node_modules
	sudo chown -R $(PERMISSION) ~/.npm
endif
else
	@echo "nodejs is installed @$(NODE_VERSION)"
endif
ifndef EMBER_VERSION
	@echo "Install ember-cli..."
	npm install -g ember-cli
else
	@echo "ember-cli is installed @$(EMBER_VERSION)"
endif
endif
