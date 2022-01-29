import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const config = {
  input: 'src/index.js',
  output: {
    name: 'react-scroll-trigger',
    file: './index.js',
    format: 'umd',
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },
    banner: `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} Ryan Hefner | ${pkg.license} License | https://github.com/${pkg.repository} !*/`,
    footer: '/* follow me on Twitter! @ryanhefner */',
  },
  external: [
    'react',
    'react-dom',
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      externalHelpers: process.env.BABEL_ENV === 'umd',
    }),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    json(),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(terser());
}

export default config;
