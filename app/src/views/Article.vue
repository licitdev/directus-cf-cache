<template>
	<div>
		<template v-if="article">
			<h1 id="title">{{ article.title }}</h1>
			<div v-safe-html="article.content"></div>
			<br />
			<p class="updated">Updated on {{ new Date(article.date_updated).toLocaleString() }}</p>

			<h3><a href="/articles">Back to Articles</a></h3>
		</template>
		<template v-else> <h1>Loading...</h1> </template>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getItem } from '../utils/api';
import { useRoute } from 'vue-router';

const article = ref();
const route = useRoute();

onMounted(async () => {
	try {
		article.value = await getItem('articles', String(route.params.pk));
	} catch (err) {
		console.log(err);
	}
});
</script>

<style scoped>
#title {
	background-color: #ddd;
	padding: 20px;
}

.updated {
	color: #999;
}
</style>
