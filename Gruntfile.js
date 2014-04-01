/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: [
      '/*!',
      ' * <%= pkg.title || pkg.name %> v<%= pkg.version %>',
      ' * <%= pkg.homepage ? pkg.homepage : "" %>',
      ' *',
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>',
      ' * Released under the <%= pkg.license %> license',
      ' *',
      ' * Date: <%= grunt.template.today("yyyy-mm-dd") %>',
      ' */',
      ''
    ].join('\n'),
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.main %>.js'],
        dest: 'dist/<%= pkg.main %>-<%= pkg.version %>.js'
      }
    },
    clean: [
      'dist/*'
    ],
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.main %>-<%= pkg.version %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify']);

};
