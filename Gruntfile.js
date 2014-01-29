module.exports = function (grunt) {
 
    var banner = grunt.file.readJSON('package.json').banner;
 
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-este-watch');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: {
            js: ['src/**/*.js'],
            libs: ['libs/*.js'],
            html: ['src/index.html'],
        },
        copy: {
            assets: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/assets/',
                        src: '**',
                        dest: 'dist/assets/',
                    },
                ],
            },
        },
        recess: {
            less: {
                options: {
                    compile: true,
                    compress: true,
                },
                files: {
                    'dist/main.css': ['src/less/main.less'],
                }
            }
        },
        esteWatch: {
            options: {
                dirs: [
                    'src/**/',
                    'libs/**',
                ],
                livereload: {
                    enabled: false,
                },
            },
            js: function (filepath) {
                if (filepath.substr(0, 4) === 'libs') {
                    return ['libs'];
                }
                return ['js'];
            },
            less: function (filepath) {
                return ['css'];
            },
            html: function (filepath) {
                return ['index'];
            },
            '*': function (filepath) {
                return ['default'];
            },
        },
        uglify: {
            libs: {
                files: {
                    'dist/libs.js': ['<%= src.libs %>'],
                },
            },
            app: {
                options: {
                    banner: '/*!\n * ' + banner.join('\n * ') + '\n */\n',
                    preserveComments: false,
                    mangle: true,
                },
                files: {
                    'dist/app.js': ['<%= src.js %>'],
                },
            },
        },
        htmlmin: {
            index: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                },
                files: {
                    'dist/index.html': 'src/index.html',
                },
            },
        },
    });
 
 
    grunt.registerTask('indexBanner', function () {
        var contents = grunt.template.process(grunt.file.read('dist/index.html').replace('<head>', '<head>\n<!--\n ' + banner.join('\n ') + '\n-->\n'));
        grunt.file.write('dist/index.html', contents);
    });
 
    grunt.registerTask('cssBanner', function () {
        grunt.file.write('dist/style.css', '/*!\n * ' + grunt.template.process(banner.join('\n * ')) + '\n */\n' + grunt.file.read('dist/style.css'));
    });
 
    grunt.registerTask('default', ['copy:assets', 'index', 'css', 'js']);
 
    grunt.registerTask('index', ['htmlmin:index', 'indexBanner']);
    grunt.registerTask('libs', ['uglify:libs']);
    grunt.registerTask('js', ['uglify:app']);
    grunt.registerTask('css', ['recess:less']);
 
    grunt.registerTask('watch', ['esteWatch']);
};