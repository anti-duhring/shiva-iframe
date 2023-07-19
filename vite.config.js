import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		port: 4004,
	},
	build: {		
		assetsDir: 'public',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				layout: resolve(__dirname, 'pages/layout/layout.html'),
				documentos: resolve(__dirname, 'pages/frames/1-documentos/documentos.html'),
				dadosGerais: resolve(__dirname, 'pages/frames/2-dados-gerais/dados-gerais.html'),
				transportes: resolve(__dirname, 'pages/frames/3-transportes/transportes.html'),
				conteineres: resolve(__dirname, 'pages/frames/4-conteineres/conteineres.html'),
				solicitacoes: resolve(__dirname, 'pages/frames/5-solicitacoes/solicitacoes.html'),
				requisistos: resolve(__dirname, 'pages/frames/6-requisitos/requisitos.html'),
			},
			output: {
				entryFileNames: `assets/[name].js`,
				chunkFileNames: `assets/[name].js`,
				assetFileNames: `assets/[name].[ext]`
			  }
		}
	}
})