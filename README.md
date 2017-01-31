# Busy Components
[![npm version](https://badge.fury.io/js/busy-components.svg)](https://badge.fury.io/js/busy-components)
[![Build Status](https://travis-ci.org/busybusy/webapp-busy-components.svg?branch=master)](https://travis-ci.org/busybusy/webapp-busy-components)
[![Ember Observer Score](https://emberobserver.com/badges/busy-components.svg)](https://emberobserver.com/addons/busy-components)
[![Ember badge][ember-badge]][embadge]
[![Code Climate](https://codeclimate.com/github/busybusy/webapp-busy-components/badges/gpa.svg)](https://codeclimate.com/github/busybusy/webapp-busy-components)
[![Test Coverage](https://codeclimate.com/github/busybusy/webapp-busy-components/badges/coverage.svg)](https://codeclimate.com/github/busybusy/webapp-busy-components/coverage)
[![Issue Count](https://codeclimate.com/github/busybusy/webapp-busy-components/badges/issue_count.svg)](https://codeclimate.com/github/busybusy/webapp-busy-components)


This README outlines the details of collaborating on this Ember addon.

## Installation

This is an ember addon and requires ember-cli.

Note: This component does not support Ember 1.13

```
ember install busy-components
```

## Setup

#### CSS Colors with SASS
Setting up the override css can be done by setting the color variables in sass.
```
$bc-color-1: #30aeef; // bright blue
$bc-color-2: #2d3e50; // dark blue
$bc-color-3: #8E8E8E; // grey
$bc-color-4: #F0F4F7; // glacier blue
$bc-color-5: #CCCCCC; // grey lighter than bc-color-3
$bc-color-6: #CFCFCF; // off white
$bc-color-7: #FFFFFF; // white
$bc-color-8: #68A3B5; // teal
$bc-color-9: #D65151; // red
$bc-color-10: #384D60; // dark blue lighter than bc-color-2
$bc-color-11: #A9B5BF; // blue grey
$bc-color-12: #C9CFD3; // grey lighter than bc-color-5
$bc-color-13: #243442; // black
$bc-color-14: #0277BD; // bright blue darker than bc-color-1
$bc-color-15: #D32F2F; // dark red
$bc-color-16: #F3F3F3; // grey white
$bc-color-17: #5E5E5E; // dark grey
$bc-color-18: #AAAAAA; // grey lighter than bc-color-3 darker than bc-color-5 / neutral gray
$bc-color-19: #58BD7F; // green
$bc-color-20: #EEEEEE; // another grey
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).

## Installing Addon

* `ember install busy-components`

## Usage

* Validation input
```
{{bc-validate placeholder="Name"}}
```

* Checkbox input
```
{{bc-checkbox placeholder="Name"}}
```

* Radio input
```
{{bc-radio-button placeholder="Name"}}
```

* Select input
```
{{bc-select placeholder="Name"}}
```

## Contribute

* `git clone` this repository
* `npm install`
* `bower install`

[embadge]: http://embadge.io/
[ember-badge]: http://embadge.io/v1/badge.svg?start=2.11.0
