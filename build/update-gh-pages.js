#!/bin/env node

'use strict';

const proc = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let projectPath = path.resolve(__dirname, '..');

const run = function () {
    let args = Array.from(arguments);
    let cmd = args.shift();
    let result = proc.spawnSync(cmd, args, {
        encoding: 'utf-8'
    });
    //if (result.stdout) {
    //    console.log(result.stdout);
    //}
    if (result.stderr) {
        console.error(result.stderr);
    }
    return result;
};

const stashAndRun = task => {
    console.info('stashing');
    run('git', 'stash');
    try {
        task();
    } catch(e) {
        console.error(e);
    } finally {
        console.info('unstashing');
        run('git', 'stash', 'pop');
    }
};

const onBranch = (branch, task) => {
    run('git', 'co', branch);
    try {
        task();
    } catch(e) {
        console.error(e);
    } finally {
        run('git', 'co', 'master');
    }
};

stashAndRun(() => {
    let code = fs.readFileSync(path.resolve(projectPath, 'dist/minislides.min.js'), 'utf-8');
    onBranch('gh-pages', () => {
        let oldHtml = fs.readFileSync(path.resolve(projectPath, 'index.html'), 'utf-8');
        let html = oldHtml.replace(/.+<\/script>/, `<script>${code}</script>`);
        if (html === oldHtml) {
            console.warn(chalk.magenta('Nothing to do'));
            return;
        }
        console.info('writing file');
        fs.writeFileSync(path.resolve(projectPath, 'index.html'), html, 'utf-8');
        console.info(chalk.green('committing'));
        run('git', 'commit', '-a', '-m', 'Update JS');
        process.nextTick(() => console.log(chalk.magenta('\nRemember to run git push --all')));
    });
});
