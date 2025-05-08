import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  srcDir: 'src',
  scanDirs: ['src/routes'],
  routeRules: {
    '/api/**': { cors: true },
  },
  plugins: ['./src/plugins/db.ts'],
  runtimeConfig: {
    // Keys within public are also exposed to the client
    public: {
      apiBase: '/api',
    },
    // Private keys are only available on the server
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
  },
  devServer: {
    port: 3000,
  },
  imports: {
    dirs: ['src/utils', 'src/models'],
  },
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        paths: {
          '~/*': ['./src/*'],
        },
      },
    },
  },
})

