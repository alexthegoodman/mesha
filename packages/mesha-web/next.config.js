/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(wgsl|vs|fs|vert|frag)$/,
      use: ["shader-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
