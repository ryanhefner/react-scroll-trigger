const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV != undefined && BABEL_ENV !== 'cjs';

const plugins = [];

if (BABEL_ENV === 'umd') {
  plugins.push('external-helpers');
}

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    'dev-expression',
    'transform-react-remove-prop-types'
  );
}

module.exports = {
  presets: [
    ['latest', {
      'es2015': {
        'loose': true,
        'modules': building ? false : 'commonjs'
      }
    }],
    'react'
  ],
  plugins: plugins
};
