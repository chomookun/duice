#!/bin/bash

# git update source
function update() {
	git stash
	git pull
	git stash pop
}

# compile
function compile() {
	node node_modules/typescript/bin/tsc ${@:1}
}

# generates document
function doc() {
	rm -rf ./doc/*
	node node_modules/typedoc/bin/typedoc
}

# gulp dist 
function dist() {
	rm -rf ./dist/*
	node node_modules/gulp/bin/gulp zip
}

# main
case ${1} in
	update)
		update
		;;
	compile)
		compile ${@:2}
		;;
	doc)
		doc
		;;
	dist)
	 	dist	
		;;
	*)
		update
		compile
		doc
		dist
		;;
esac

exit 0

