<template>
	<div id="nav">
		<router-link to="/">Home</router-link> | <router-link to="/articles">Articles</router-link> |
		<router-link to="/projects">Projects</router-link> |
		<router-link to="/people">People</router-link>
	</div>
	<router-view id="view" />
</template>

<style scoped>
#view {
	width: 800px;
	margin: 0 auto;
}
#nav {
	background-color: #eee;
	padding: 10px;
	text-align: center;
	font-size: 2em;
	width: 800px;
	margin: 0 auto;
}

#nav a {
	margin: 0 10px;
	text-decoration: none;
	color: #666;
}
</style>
