/**
 * Configuration
 */

module.exports = {
  development: {
    db: {
      url: 'mongodb://localhost:27017/shorty',
      prefix: 'https://exm.pl',
      bind: '127.0.0.1:8081'
    }
  },
  test: {
    db: {
      url: 'mongodb://localhost:27017/shorty',
      prefix: 'https://exm.pl',
      bind: '0.0.0.0:8081'
    }
  },
  production: {
    db: {
      url: 'mongodb://localhost:27017/shorty',
      prefix: 'https://exm.pl',
      bind: '0.0.0.0:8081'
    }
  }
};
