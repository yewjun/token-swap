import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig(({ env, command }) => {
  // Load environment variables from multiple sources
  const envVars = loadEnv({ 
    prefixes: ['VITE_'],
    mode: env
  });
  
  return {
    plugins: [
      pluginReact(),
      pluginTypeCheck()
    ],
  html: {
    template: './index.html'
  },
  source: {
    entry: {
      index: './src/main.tsx'
    }
  },
  output: {
    distPath: {
      root: 'dist'
    }
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience'
    }
  },
      tools: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer')
          ]
        }
      },
      rspack: {
        plugins: [
          // Define environment variables for the client
          new (require('@rspack/core').DefinePlugin)({
            'import.meta.env.VITE_FUNKIT_API_KEY': JSON.stringify(
              process.env.VITE_FUNKIT_API_KEY || envVars.publicVars.VITE_FUNKIT_API_KEY || ''
            ),
            'import.meta.env.MODE': JSON.stringify(env),
            'import.meta.env.DEV': JSON.stringify(command === 'dev'),
            'import.meta.env.PROD': JSON.stringify(command === 'build')
          })
        ],
        optimization: {
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                priority: 10
              },
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react',
                chunks: 'all',
                priority: 20
              },
              ethers: {
                test: /[\\/]node_modules[\\/]ethers[\\/]/,
                name: 'ethers',
                chunks: 'all',
                priority: 15
              }
            }
          }
        }
      }
    }
  };
});