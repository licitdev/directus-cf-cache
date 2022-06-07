<template>
	<div>
		<h1>{{ isArchivedKey ? 'Archived ' : '' }} Articles Page</h1>

		<template v-if="articles">
			<div v-for="article in articles" class="article">
				<h2>
					<a :href="'/article/' + article.id">{{ article.title }}</a>
				</h2>
				<p>Updated on {{ new Date(article.date_updated).toLocaleString() }}</p>
			</div>

			<h3 v-if="isArchivedKey"><a href="/articles">Back to Articles</a></h3>
			<h3 v-else><a href="/articles/archived">View Archived Articles</a></h3>
		</template>
		<template v-else>
			<h1>Loading...</h1>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listItems } from '../utils/api';
import { useRoute } from 'vue-router';

const articles = ref();
const route = useRoute();
const isArchivedKey = ref(false);

if (route.params.key) {
	isArchivedKey.value = route.params.key === 'archived';
}

onMounted(async () => {
	try {
		articles.value = await listItems('articles', isArchivedKey.value ? 'archived' : '');
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
