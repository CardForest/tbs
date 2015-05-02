'use strict';
module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jsdoc : {
      dist : {
        src: ['lib/*.js', 'lib/service/**/*.js', 'lib/client/**/*.js', 'lib/transport/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      js: {
        src: ['*.js', 'lib/**/*.js', '!lib/transport/primus/generatedPrimusClient.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    mochacli: {
      options: {
        reporter: 'spec',
        bail: true
      },
      all: ['test/*.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js', 'mochacli']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochacli']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'mochacli']);
};
