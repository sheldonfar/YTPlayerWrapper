module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: ["build"]
        },
        uglify: {
            my_target: {
                files: {
                    'build/player.min.js': ['player/player.js'],
                    'build/producer.min.js': ['player/producer.js']
                }
            }
        },
        'ftp-deploy': {
            build: {
                auth: {
                    host: 'h53.hvosting.ua',
                    authKey: 'deploy-key'
                },
                src: 'build',
                dest: ''
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.registerTask('default', ['clean', 'uglify', 'ftp-deploy']);
};