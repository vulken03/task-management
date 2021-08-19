module.exports = {
    source: {
      includePattern: '.+\\.js(doc|x)?$', // Only process file ending in .js, .jsdoc or .jsx
      include: ['.'], // Check all folders.
      exclude: ['node_modules']
    },
    opts: {
      destination: './docs/generated',
      recurse: true
    }
  }