<template>
	<div>
		<h1>Projects Page</h1>

		<template v-if="projects">
			<div v-for="project in projects" class="project">
				<h2>
					{{ project.title }}
				</h2>

				<h3 class="description">
					{{ project.description }}
				</h3>

				<carousel :items-to-show="2">
					<slide v-for="file in project.gallery" :key="file">
						<img :src="getAssetUrl(file.directus_files_id)" height="200" />
					</slide>

					<template #addons>
						<navigation />
						<pagination />
					</template>
				</carousel>
			</div>
		</template>
		<template v-else>
			<h1>Loading...</h1>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listItems, getAssetUrl } from '../utils/api';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

const projects = ref();

onMounted(async () => {
	try {
		projects.value = await listItems('projects');
	} catch (err) {
		console.log(err);
	}
});
</script>

<style scoped>
.project {
	background-color: #ddd;
	padding: 20px;
	margin-bottom: 10px;
}
</style>
