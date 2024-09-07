module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
      require('karma-sonarqube-unit-reporter')
    ],
    client: {
      clearContext: false 
    },  
    coverageReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reporters: [
        { type: 'html' },
        { type: 'lcovonly' }
      ],
      fixWebpackSourcePaths: true,
      exclude: [
        'src/app/model/**',
        'src/app/page-not-found/**',
        'src/app/services/auth-callback.component.ts',
        'src/app/modules/shared/**',
        'src/assets/**'
      ]
    },
    sonarQubeUnitReporter: {
      outputDir: 'test-results',
      outputFile: 'TESTS-results.xml',
      suite: '',
      useBrowserName: false,
    },
    reporters: ['progress', 'kjhtml', 'sonarqubeUnit', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    restartOnFileChange: true
  });
};
