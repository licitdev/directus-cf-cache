<template>
	<div>
		<h1>People Page</h1>

		<template v-if="people">
			<div v-for="person in people" class="person">
				<h2>
					{{ person.name }}
				</h2>

				<img :src="getAssetUrl(person.photo)" width="200" />

				<h3>
					<span class="role" v-for="role in person.roles">{{ role }}</span>
				</h3>
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

const people = ref();

onMounted(async () => {
	try {
		people.value = await listItems('people');
	} catch (err) {
		console.log(err);
	}
});
</script>

<style scoped>
.person {
	width: 300px;
	background-color: #ddd;
	padding: 20px;
	margin-bottom: 10px;
	margin: 30px;
	float: left;
}

.role {
	margin-right: 10px;
	background-color: white;
	padding: 10px;
}
</style>
