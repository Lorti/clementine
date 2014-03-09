'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		autoprefixer: {
	    options: {
	    	browsers: ['last 3 versions'],
	      map: true
	    },
	    target: {
	      src: 'css/main.css',
      	dest: 'css/main.css'
	    },
	  },
	  clean: {
      target: ['build']
    },
		imagemin: {
	    target: {
	    	options: {
	    		pngquant: true
	    	},
	      files: [{
	        expand: true,
	        cwd: 'build/',
	        src: ['**/*.{png,jpg,gif}'],
	        dest: 'build/'
	      }]
	    }
	  },
	  jekyll: {
	    options: {
	        bundleExec: true
	    },
	    build: {
	      options: {
	        dest: '_site/',
	        config: '_config.yml'
	      }
	    }
	  },
		sass: {
	    target: {
	      options: {
	        sourcemap: 'true',
	        style: 'compressed'
	      },
	      files: {
	        'css/main.css': 'scss/main.scss'
	      }
	    }
	  },
	  svg2png: {
      target: {
        files: [{
        	src: ['images/*.svg'],
        	dest: 'images/'
        }]
      }
    },
    uglify: {
    	target: {
    		options: {
		      mangle: false
		    },
    		files: {
          'js/main.min.js': 'js/main.js'
      	}
    	}
    },
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: ['scss/**'],
				tasks: ['sass', 'autoprefixer']
			},
			html: {
				files: ['_layouts/*', '_posts/*', 'index.html'],
				tasks: [/*'jekyll'*/]
			},
			js: {
				files: ['js/main.js'],
				tasks: ['uglify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-svg2png');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', [
		'clean',
		'sass',
		'autoprefixer',
		'uglify',
		'svg2png',
		'jekyll',
		'imagemin'
	]);
};
