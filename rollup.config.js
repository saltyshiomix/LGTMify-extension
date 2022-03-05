import { terser } from 'rollup-plugin-terser';

const config = (src, dist) => ({
  input: src,
  output: {
    file: dist,
    format: 'cjs',
  },
  plugins: [
    (process.env.NODE_ENV === 'production' && terser()),
  ],
});

export default [
  config('index.ts', 'lib/index.js'),
];
