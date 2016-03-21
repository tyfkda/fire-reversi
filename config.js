System.config({
  baseURL: '.',
  transpiler: false,
  paths: {
    'node:*': './node_modules/*',
  },
  map: {
    'lodash': 'node:lodash/lodash.js',
  },
  packages: {
    app: {
      format: 'register',
      defaultExtension: 'js'
    }
  }
})
