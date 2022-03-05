import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const config = (src, dist, format = 'cjs') => ({
  input: src,
  output: {
    file: dist,
    format,
  },
  plugins: [
    resolve(),
    typescript(),
    (process.env.NODE_ENV === 'production' && terser()),
  ],
});

export default [
  config('src/popup.ts', 'lib/popup.js'),
  config('src/background.ts', 'lib/background.js'),

  // vendor
  config('src/moveable.ts', 'lib/moveable.js', 'iife'),
];
