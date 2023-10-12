/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    ...nextConfig,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.html$/,
            include: /node_modules/,
            use: 'ignore-loader',
        });
        return config;
    },
};
