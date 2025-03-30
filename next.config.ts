

module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com', // because using Image, next needs to know the images come from a given domain
                port: '',
                pathname: '/**',
                search: '',
            },
        ],
    },
}
