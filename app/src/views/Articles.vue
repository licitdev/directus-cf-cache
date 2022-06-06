<template>
	<div>
		<h1>Articles Page</h1>

		<template v-if="articles">
			<div v-for="article in articles" class="article">
				<h2>
					<a :href="'/article/' + article.id">{{ article.title }}</a>
				</h2>
				<p>Updated on {{ new Date(article.date_updated).toLocaleString() }}</p>
			</div>
		</template>
		<template v-else>
			<h1>Loading...</h1>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listItems } from '../utils/api';

const articles = ref();

onMounted(async () => {
	try {
		articles.value = await listItems('articles');
	} catch (err) {
		console.log(err);
	}
});
</script>

<style scoped>
.article {
	background-color: #ddd;
	padding: 20px;
	margin-bottom: 10px;
}
</style>
