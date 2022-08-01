const path = require('path');
const glob = require('glob');
const {exec} = require('child_process');


const basePath = path.resolve('src', 'apps');

class autoUploadPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tapPromise(
        'autoUploadPlugin',
        (compilation) => {
        if (!compiler.options.watch) return Promise.resolve();
        const emittedFiles = Object.keys(compilation.assets)
            .map((file) => file.replace('.js', ''));
        console.log(emittedFiles)
        const processes = glob
            .sync(`@(${emittedFiles.join('|')})/customize-manifest.json`, {
            cwd: basePath,
            })
            .map((file) => {
            console.log('\nuploading... ', file);
            return exec(
                `npm run upload ${path.resolve(basePath, file)}`,
                (err, stdout, stderr) => {
                if (stdout) process.stdout.write(stdout);
                if (stderr) process.stderr.write(stderr);
                }
            );
              });
            return Promise.all(processes);
          }
        );
    }
}

module.exports = autoUploadPlugin
