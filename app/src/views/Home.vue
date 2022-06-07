<template>
	<div>
		<h1>Home Page</h1>
		<h3>Content is managed using <a href="https://directus.io/" target="_blank">Directus</a>.</h3>
		<h3>
			Content is fetched through <a href="https://workers.cloudflare.com/" target="_blank">Cloudflare Workers</a>.
		</h3>
		<h3>
			Content is cached using
			<a href="https://www.cloudflare.com/products/workers-kv/" target="_blank">Cloudflare Workers KV</a>.
		</h3>
		<h3>This website is hosted on <a href="https://pages.cloudflare.com/" target="_blank">Cloudflare Pages</a>.</h3>
		<h3>
			This website is created using <a href="https://vuejs.org/" target="_blank">Vue.js</a> and
			<a href="https://vitejs.dev/" target="_blank">Vite</a>.
		</h3>
		<h3>
			View requests to the Cloudflare Worker running <span>directus-cf-cache</span> by opening the network tab in your
			browser's developer console.
		</h3>

		<br />
		<h3>
			Source code and more information can be found in
			<a href="https://github.com/licitdev/directus-cf-cache">GitHub</a>.
		</h3>
	</div>
</template>

<style scoped>
span {
	color: purple;
}
</style>
