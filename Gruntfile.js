module.exports = function (grunt) {
  var production = grunt.option('production');

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
        files: { 'dist/dev.js': 'src/purity.js' }
      }
    },

    concat: {
      build: {
        src: [
          'src/test-header.js',
          'dist/dev.js'
        ],
        dest: 'dist/purity.js'
      }
    },

    clean: {
      postbuild: {
        src: ['dist/dev.js']
      }
    },

    exorcise: {
      source: {
        options: { strict: true },
        files: { 'dist/purity.js.map': 'dist/purity.js' }
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
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-exorcise');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('build', [
    'browserify:source',
    'concat:build',
    'exorcise:source',
    'clean:postbuild'
  ]);

  grunt.registerTask('cover', [
    'build',
    'mocha_istanbul:cover'
  ]);
};
