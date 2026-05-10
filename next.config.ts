import type { NextConfig } from 'next'
import path from 'path'
import './lib/env'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
