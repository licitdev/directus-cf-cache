# directus-cf-cache

[![GitHub license](https://img.shields.io/github/license/licitdev/directus-cf-cache.svg)](https://github.com/licitdev/directus-cf-cache/blob/master/LICENSE)
![Deploy to Cloudflare Pages](https://github.com/licitdev/directus-cf-cache/workflows/Deploy%20to%20Cloudflare%20Pages/badge.svg)
![Deploy to Cloudflare Workers](https://github.com/licitdev/directus-cf-cache/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg)

## About

Cache and limit direct access to the data managed on your [Directus](https://directus.io) instance, powered by [Cloudflare Workers](https://workers.cloudflare.com), [Workers KV](https://developers.cloudflare.com/workers/runtime-apis/kv) and [Cloudflare Pages](https://pages.cloudflare.com).

## Features

- Always available API with live updates[^1].
  - Origin Priority mode to serve content from your Directus instance, with fallback to the KV cache when unavailable.
  - Cache Priority mode to serve content from the KV cache, with fallback to your Directus instance when unavailable.
  - Origin Only mode to only serve content from your Directus instance.
  - Cache Only mode to only serve content from the KV cache.
- Caching of image assets.
- Automatic updating of cache upon webhook trigger.
- Preset requests to prevent user from the tampering of query parameters.
- Full support of Directus [Global Query Parameters](https://docs.directus.io/reference/query/).
- Demo [Vue](https://vuejs.org/) web application to showcase functionality.

## Demo

1. Head over to the Directus instance at [https://cztkclnq.directus.app](https://cztkclnq.directus.app/).
2. Login with the following credentials.

   - Email: `visitor@example.com`
   - Password: `abcd1234`

3. Create > update > delete your content.

   > Permissions have been set to prevent changes to certain items.

4. Check out your updates at [https://directus-cf-cache.pages.dev](https://directus-cf-cache.pages.dev/).

## Cloudflare Features Used

### Cloudflare Workers

Fetching and storing content into Workers KV.

Serve requests either from the origin or the KV cache.

### Workers KV

Store cached content retrieved from Directus.

### Cloudflare Pages

Host the demo [Vue 3](https://v3.vuejs.org) web application.

## Installation Guide

### Fork directus-cf-cache

Create a [Fork](https://github.com/licitdev/directus-cf-cache/fork) of this GitHub repository as the deployments are pushed via GitHub Actions.

### Set up Cloudflare Workers

1. [Sign up](https://dash.cloudflare.com/sign-up/workers) for a Cloudflare Workers account.
2. Copy the **Account ID** shown in the Workers page somewhere.
3. Copy the **Subdomain** shown in the Workers page somewhere.
4. Head over to KV tab, add a new namespace and copy the **Namespace ID** somewhere.
5. Head over to [API Tokens](https://dash.cloudflare.com/profile/api-tokens) and create a new Custom API Token with Permission of "Account/Worker Scripts/Edit".
6. Copy the **API Key** somewhere, you will require it later.

### Set up Directus

1. If you already have a Directus instance, self-hosted or cloud, skip to point 5.
2. [Sign up](https://directus.cloud) for a Directus Cloud account.
3. Create a new Project.
4. Check your email for the login credentials.
5. Login to your Directus instance.
6. Head over to Settings > Data Model.
7. Set up all your required collections, in the demo there are `articles`, `projects` and `people`.
8. Create a new collection with the following settings:
   1. Set name as `cf_cache_options`
   2. Check the singleton checkbox
   3. Skip the configuration of other parameters and save.
9. Click on Data Model.
10. Create a new collection with the following settings
    1. Set name as `global_query_params`
    2. Skip the configuration of other parameters and save.
11. Create the following fields in `global_query_params`:
    1. `description` with `string` type
    2. `operation` with `string` type (either `list` or `get`)
    3. `collection` with `string` type (collection names that you want to cache)
    4. `key` with `string` type (cache key to differentiate between presets)
    5. `enabled` with `boolean`
    6. `query_params` with `json` (the query that will be sent with the request)
    7. `file_paths` with `csv` (the paths containing files from the result)
    8. `sort` with `integer` to be used for sorting
12. Create the following fields in `cf_cache_options`:
    1. `cache_mode` with `string` (`origin_priority`,`cache_priority`,`origin_only`,`cache_only`)
    2. `preset_requests` with `One to Many Relationship` on `global_query_params` with a foreign key of `cf_cache_option`.
    3. Continue in advanced field creation mode.
    4. Click on `Relationship` and set the sort field as `sort` to enable sorting.
    5. Skip the configuration of other parameters and save.
13. Head over to Settings > Data Model
    1. Click on the kebab menu of `global_query_params`.
    2. Select Make Collection Hidden.
14. Head over to Settings > Webhooks
    1. Create a new webhook and give it a name.
    2. Set the URL as your Cloudflare Worker webhook endpoint.
    3. Add a new request header `Secret` with your **secret** and copy this value somewhere.
    4. Toggle all actions to be turned on (create, update, delete).
    5. Select the collections that you wish to cache including `Cf Cache Options`
15. Head over to Settings > Roles & Permissions
    1. Create a new role and uncheck `App Access`.
    2. Allow `All Access` for `Read` column of the tables you wish to cache including `cf_cache_options`
    3. Create a new user, enter a secure **token** and copy this value somewhere.
    4. Save all changes.
16. Head over to Content > Cf Cache Options and configure your required caching settings.
    > **Demo `cf_cache_options` configuration**
    >
    > ![image](https://user-images.githubusercontent.com/26413686/172445743-18156d31-54c7-4b79-8d71-9cf91c8253e0.png)
    >
    > **Demo `preset_requests` configuration**
    >
    > ![image](https://user-images.githubusercontent.com/26413686/172446025-98593f2c-367a-4229-babb-c2ea0a25475e.png)

### Set up Cloudflare Pages

1. [Sign up](https://dash.cloudflare.com/sign-up/pages) for a Cloudflare Pages account.
2. Create a new project, selecting the fork of `directus-cf-cache` in your GitHub account.
3. Set the build output directory as `dist`.
4. Set the root directory path as `app`.
5. Create the following environment variables:
6. `VITE_DIRECTUS_CF_CACHE_URL` with your Cloudflare Worker URL such as `https://directus-cf-cache.<your workers subdomain>.workers.dev`.
7. After the first build is completed, pause the Automatic git deployments.
8. Add a new deploy hook, copy the **Deploy hook URL** somewhere.

### Configure GitHub Actions

1. Open the forked GitHub project > Settings > Secrets.
2. Create the following repository secrets:

   > You may refer to [.env.sample](https://github.com/licitdev/directus-cf-cache/blob/master/.env.sample) for sample values.

   1. `CLOUDFLARE_ACCOUNTID` with the **Account ID**.
   2. `CLOUDFLARE_PAGES_WEBHOOK_URL` with the **Deploy hook URL**.
   3. `CLOUDFLARE_TOKEN` with the **API Key**.
   4. `CLOUDFLARE_ZONEID` with the **Zone ID**, empty string unless you are using a custom domain.
   5. `DIRECTUS_ACCESS_TOKEN` with the **token**.
   6. `DIRECTUS_CF_CACHE_KV` with the **Namespace ID**.
   7. `DIRECTUS_SERVER_URL` with the root URL of your Directus instance.
   8. `DIRECTUS_WEBHOOK_SECRET` with the **secret**.
   9. `WORKER_ROUTES` with your custom domain or the workers.dev route.

3. Click on the Actions tab, manually run the workflows.

## Upcoming Features

- Paging of `list` results to handle bigger datasets
- Integration with Cloudflare R2 for assets storage
- Utilize Directus Flows instead of Webhooks for a "push" approach
- Cache management API to manage content stored in the KV cache
- Have an idea? [Open a discussion](https://github.com/licitdev/directus-cf-cache/discussions/new?category=ideas)!

##

Developed by [licitdev](https://github.com/licitdev)

[^1]: Changes may take up to 60 seconds to propagate globally when the request is served from the KV cache instead of the origin [https://developers.cloudflare.com/workers/learning/how-kv-works](https://developers.cloudflare.com/workers/learning/how-kv-works)
