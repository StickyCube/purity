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
        files: { 'dist/purity.js': 'src/purity.js' }
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
    },

    uglify: {
      prod: {
        src: 'dist/purity.js',
        dest: 'dist/purity.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  var buildTask = ['browserify:source'];

  if (production) {
    buildTask.push('uglify:prod');
  }

  grunt.registerTask('build', buildTask);

  grunt.registerTask('cover', [
    // 'build',
    'mocha_istanbul:cover'
  ]);
};
