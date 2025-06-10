/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{ hostname: 'images.pexels.com' }, { hostname: 'res.cloudinary.com' }],
        domains: ['images.pexels.com', 'res.cloudinary.com'],
    },
}

export default nextConfig
