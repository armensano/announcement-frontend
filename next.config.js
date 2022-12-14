/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  ignoreBuildErrors: true,
  swcMinify: true,
}

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    SERVER_URL: 'http://greatdomain.click'
  }
}
