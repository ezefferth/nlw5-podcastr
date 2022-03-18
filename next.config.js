/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {/* neste caso foi utilizado images domains para que o Image importado
    consiga fazer a busca pela imagem no servidor */
    domains: ['storage.googleapis.com']
  }
}

module.exports = nextConfig
