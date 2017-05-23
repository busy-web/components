###
# busybusy ember-cli update script
#
###

# Operating System Type
UNAME_S := $(shell uname -s)

# version info
YARN_VERSION := $(shell yarn --version 2>/dev/null)

# folder info
NODE_FILES := $(shell stat -f %N ./node_modules 2>/dev/null)
BOWER_FILES := $(shell stat -f %N ./bower_components 2>/dev/null)
DIST_FILES := $(shell stat -f %N ./dist 2>/dev/null)
TMP_FILES := $(shell stat -f %N ./tmp 2>/dev/null)

# user permission
PERMISSION := $(shell stat -f %Su:%Sg ~/.ssh 2>/dev/null)

# standard commands
all: clean install

# Install project packages
install:
ifdef YARN_VERSION
	yarn install
else
	npm install
endif
	bower install

build:
	npm install
	bower install

rebuild:
	npm prune
	bower prune
	npm install
	bower install

# regenerate the lockfile
lockfile:
	yarn install

# cleanup files and clear caches
clean:
ifdef NODE_FILES # remove node files
	rm -r ./node_modules
endif
ifdef BOWER_FILES # remove bower files
	rm -r ./bower_components
endif
ifdef DIST_FILES # remove dist files
	rm -r ./dist
endif
ifdef TMP_FILES # remove tmp files
	rm -r ./tmp
endif
ifndef YARN_VERSION # clear cache for npm and bower if not using yarn
	npm cache clean
endif
	bower cache clean

# Change node file permission so sudo is not required for
# global installs.
permission:
ifdef PERMISSION
ifeq ($(UNAME_S),Darwin)
	sudo chown $(PERMISSION) /usr/local/bin/npm
else
	sudo chown $(PERMISSION) /usr/bin/npm
endif
	sudo chown -R $(PERMISSION) /usr/local/lib/node_modules
	sudo chown -R $(PERMISSION) ~/.npm
endif

help:
	@echo ""
	@echo "busybusy web tools: make"
	@echo "version: 2.0"
	@echo ""
	@echo "commands: "
	@echo "  default: (all)"
	@echo "    * Fresh install of dev environment"
	@echo "    * Run just 'make' to execute the default command"
	@echo ""
	@echo "  clean: "
	@echo "    * Removes all packages and build files"
	@echo ""
	@echo "  install: "
	@echo "    * Set up dev environment dependency packes"
	@echo ""
	@echo "  build: "
	@echo "    * Update packes to current available packages according to package.json"
	@echo "     * Use this to update packages when ember-cli reports out of date packes"
	@echo ""
	@echo "  rebuild: "
	@echo "    * Removes unused packages and install required packages"
	@echo "    * Use this when switching between branches with different dependencies"
	@echo "    * Note this may not work in all cases and an fresh install will be requied by running just 'make'"
	@echo ""
	@echo "  lockfile: "
	@echo "    * Updates the lock file for yarn"
	@echo ""
