
module.exports = function (grunt) {

	var serveStatic = require('serve-static');
	var appConfig = {
		timestamp: new Date().toLocaleString(),
		gitMessage: ''
	};

	grunt.initConfig({
		config: appConfig,
		app: require( './bower.json' ).appPath || 'src',
		dist: 'dist',
		example: 'examples',
		pkg: grunt.file.readJSON('package.json'),
		appName: '<%= pkg.name %>',
		jsFileName: '<%= pkg.name %>',
		cssFileName: '<%= pkg.name %>',

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function ( connect ) {
						return [
							connect().use(function (req, res, next) {
								res.setHeader('Access-Control-Allow-Origin', '*');
								res.setHeader('Access-Control-Allow-Methods', '*');
								next();
							}),
							connect().use(
								'/dist',
								serveStatic( './dist' )),
							connect().use(
								'/bower_components',
								serveStatic( './bower_components' )
							),
							serveStatic( 'examples' )
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= dist %>'
				}
			}
		},
		banner: '/*!\n' +
			'* <%= pkg.name %> - v<%= pkg.version %>\n' +
			'* Homepage: <%= pkg.homepage %>\n' +
			'* Author: <%= pkg.author.name %>\n' +
			'* Author URL: <%= pkg.author.url %>\n*/\n',
		clean: {
			dist: {
				files: [ {
					dot: true,
					src: [
						'.tmp',
						'<%= dist %>/{,*/}*',
						'!<%= dist %>/.git*'
					]
				} ]
			}
		},
		concat: {
			options: {
				separator: '\n\n',
				banner: '<%= banner %>'
			},
			js: {
				src: [
					'<%= app %>/js/service.js',
					'<%= app %>/js/directive.js'
		],
				dest: '<%= dist %>/js/<%= jsFileName %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'<%= dist %>/js/<%= jsFileName %>.min.js': '<%= concat.js.dest %>'
				}
			}
		},
		sass: {
			options: {
				sourceMap: true,
				sourceMapContents: true,
				sourceMapEmbed: true
			},
			dist: {
				files: {
					'.tmp/styles/main.css': '<%= app %>/scss/main.scss',
					'.tmp/styles/bootstrap-theme.css': '<%= app %>/scss/bootstrap-theme.scss'
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= dist %>/css/<%= cssFileName %>.min.css': '.tmp/styles/main.css',
					'<%= dist %>/css/bootstrap-theme.min.css': '.tmp/styles/bootstrap-theme.css'
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', '<%= app %>/**/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		copy: {
			'sass': {
				expand: true,
				cwd: '<%= app %>/scss',
				src: '**/*.*',
				dest: '<%= dist %>/scss/'
			},
			'images': {
				expand: true,
				cwd: '<%= app %>/images',
				src: '**/*.*',
				dest: '<%= dist %>/images/'
			},
			'fonts': {
				expand: true,
				cwd: '<%= app %>/fonts',
				src: '**/*.*',
				dest: '<%= dist %>/fonts/'
			},
			'html': {
				expand: true,
				cwd: '<%= app %>/views',
				src: '**/*.*',
				dest: '<%= dist %>/views/'
			}
		},
		preprocess: {
			options: {
				inline: true
			},
			'prod': {
				options: {
					inline: true,
					context: {
						PROD: true
					}
				},
				src: [
					'<%= dist %>/**/*.html',
					'<%= dist %>/**/*.js'
				]
			},
			'dev': {
				options: {
					inline: true,
					context: {
						DEBUG: true
					}
				},
				src: [
					'<%= dist %>/**/*.html',
					'<%= dist %>/**/*.js'
				]
			}
		},
		gitadd: {
			task: {
				options: {
					all: true
				}
			}
		},

		gitcommit: {
			local: {
				options: {
					message: '<%= config.gitMessage %>'
				}
			}
		},
		gittag: {
			prod: {
				options: {
					tag: '<%= pkg.version %>',
					message: '<%= config.gitMessage %>'
				}
			}
		},
		gitpush: {
			origin: {
				options: {
					remote: 'origin',
					branch: 'master',
					tags: true
					/*
					replace --tags with --follow-tags when it is supported, may be the best option
					*/
				}
			}
		},
		wiredep: {
			app: {
				src: [ '<%= example %>/*.html' ],
				ignorePath: /\.\.\//
			}
		},
		htmlbuild: {
			dist: {
				src: '<%= example %>/templates/example-template.html',
				dest: '<%= example %>/index.html',
				options: {
					beautify: true,
					prefix: '//some-cdn',
					relative: true,
					basePath: false,
					scripts: {
						bundle: [
							'../<%= dist %>/js/*.js'
						]
					},
					styles: {
						bundle: [
							'../<%= dist %>/css/bootstrap-theme.min.css',
							'../<%= dist %>/css/<%= cssFileName %>.min.css'
						]
					}
				}
			}
		},
		removelogging: {
			dist: {
				src: [ '<%= app %>/js/**/*.js', '!<%= app %>/js/**/console-log.js' ]
			}
		},
		watch: {
			files: ['<%= concat.js.src %>', '<%= app %>/**/*.scss', '<%= app %>/**/*.html'],
			tasks: ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts', 'copy:html'],
			options: {
				livereload: '<%= connect.options.livereload %>',
				event: ['all']
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-remove-logging' );
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-html-build');
	grunt.loadNpmTasks('grunt-wiredep');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-git');


	grunt.registerTask( 'build', 'Build', function ( target ) {
		appConfig.gitMessage = 'Local Dev ' + appConfig.timestamp;

		grunt.task.run( [
			'clean:dist',
			'jshint',
			'concat',
			'uglify',
			'sass',
			'cssmin',
			'copy:sass',
			'copy:images',
			'copy:fonts',
			'copy:html',
			'preprocess:prod',
			'htmlbuild:dist',
			'wiredep:app',
			'gitadd:task',
			'gitcommit:local'
		]);
	});

	// Push to the remote Git Server
	grunt.registerTask( 'push', 'Git Push', function ( target ) {
		appConfig.gitMessage = 'Dev ' + appConfig.timestamp;
		grunt.task.run(['build', 'gitpush:origin']);
	});

	// When a release is ready publish it on Github
	grunt.registerTask( 'publish', 'Github Release', function ( target ) {
		appConfig.gitMessage = 'Release ' + appConfig.timestamp;
		grunt.task.run(['removelogging', 'build', 'gittag:prod', 'gitpush:origin']);
	});

	grunt.registerTask('serve', ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts', 'copy:fonts', 'preprocess:dev', 'connect:livereload', 'watch']);

};
