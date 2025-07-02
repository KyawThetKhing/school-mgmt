/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'images.pexels.com' },
            { hostname: 'res.cloudinary.com' },
        ],
        domains: ['images.pexels.com', 'res.cloudinary.com'],
    },
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src')
        config.resolve.alias['~'] = path.resolve(__dirname, 'src')
        return config
    },
}

export default nextConfig
