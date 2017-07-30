import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const config = {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'react-scroll-trigger',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    json(),
  ],
  external: [
    'react',
  ],
  globals: {
    'react': 'React',
  },
  dest: './index.js',
  banner: `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} Ryan Hefner | ${pkg.license} License | https://github.com/${pkg.repository} !*/`,
  footer: '/* follow me on Twitter! @ryanhefner */',
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify());
}

export default config;
