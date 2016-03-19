#!/bin/env node

'use strict';

const proc = require('child_process');
const fs = require('fs');
const path = require('path');

let projectPath = path.resolve(__dirname, '..');

const stashAndRun = task => {
    console.info('stashing');
    proc.spawnSync('git', ['stash']);
    try {
        task();
    } catch(e) {
        console.error(e);
    } finally {
        console.info('unstashing');
        proc.spawnSync('git', ['stash', 'pop']);
    }
};

const onBranch = (branch, task) => {
    console.info('checking out', branch, 'branch');
    proc.spawnSync('git', ['co', branch]);
    try {
        task();
    } catch(e) {
        console.error(e);
    } finally {
        console.info('checking out master branch');
        proc.spawnSync('git', ['co', 'master']);
    }
};

stashAndRun(() => {
    let code = fs.readFileSync(path.resolve(projectPath, 'dist/minislides.min.js'), 'utf-8');
    onBranch('gh-pages', () => {
        let oldHtml = fs.readFileSync(path.resolve(projectPath, 'index.html'), 'utf-8');
        let html = oldHtml.replace(/.+<\/script>/, `<script>${code}</script>`);
        if (html === oldHtml) {
            console.warn('Nothing to do');
            return;
        }
        console.info('writing file');
        fs.writeFileSync(path.resolve(projectPath, 'index.html'), html, 'utf-8');
        console.info('committing');
        proc.spawnSync('git', ['commit', '-a', '-m', 'Update JS']);
        process.nextTick(() => console.log('\nRemember to run git push --all'));
    });
});
