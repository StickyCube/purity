module.exports = function (grunt) {
  var production = grunt.option('production');
  var buildDirectory = production ? 'dist' : 'build';

  grunt.initConfig({
    browserify: {
      source: {
        options: {
          browserifyOptions: {
            standalone: 'purity',
            debug: !production
          },
          extensions: ['.js'],
          transform: [
            ['babelify']
          ]
        },
        files: { 'build/purity.js': 'src/purity.js' }
      }
    },

    mocha_istanbul: {
      cover: {
        src: 'spec',
        options: {
          scriptPath: 'node_modules/.bin/isparta',
          root: 'src/',
          mochaOptions: ['--recursive']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('build', [
    'browserify:source'
  ]);

  grunt.registerTask('cover', [
    // 'build',
    'mocha_istanbul:cover'
  ]);
};
