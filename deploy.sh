#!/bin/bash

git checkout dev
rm -rf docs
cp -rf output docs
git add --all .
git commit -am "new github pages content"
git checkout githubpages
git merge dev
git push --all
git checkout dev