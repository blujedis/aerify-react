import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
// import rename from 'rollup-plugin-rename';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const name = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1);

const banner = `/*!
 * ${name} v${pkg.version}
 * (c) ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`;

const modules = {
  input: 'src/index.ts',
  external: [
    'react',
    'react-dom',
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  output: [
    {
      // dir: 'dist/',
      file: pkg.main,
      format: 'cjs',
      banner,
      exports: 'named',
      // preserveModules: true
    },
    {
      // dir: 'dist/',
      file: pkg.module,
      format: 'esm',
      banner,
      exports: 'named',
      // preserveModules: true
    },
    // {
    //   // dir: 'dist/',
    //   file: pkg.module,
    //   format: 'umd',
    //   banner,
    //   exports: 'named',
    //   name,
    //   globals: {
    //     'react': 'React',
    //     'react-dom': 'ReactDOM',
    //     'clsx': 'clsx',
    //     'Color': 'Color'
    //   }
    // },
  ],
  plugins: [
    peerDepsExternal(),
    json(),
    resolve({ extensions }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true, abortOnError: false }),
    // terser(),
    // rename({
    //   map: (name) => name
    //   .replace('src/', '')
    //   .replace('node_modules/', 'external/')
    //   .replace('../../external', '../external'),
    // })
  ],
};

export default [modules];
