# Land Management Plan web front end
This is the web front end for the Land Management Plan portion of the ELM service

# Environment variables

| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| PORT     | Port number      |    no    | 3000    |                             |       |

# Pipeline variables
This project expects to be built using continuous integration in Azure Pipelines. The pipeline should be configured with the following variables:

| name                      | description                         |
|---------------------------|-------------------------------------|
| azureContainerRegistry    | URL of Azure container registry     |
| azureSubscriptionEndpoint | Name of Azure subscription endpoint |

# Prerequisites

## Docker with Kubernetes

This application builds to a Docker image and is intended to run alongside other services in a Kubernetes environment. A configuration is provided in the `kubernetes/` directory to run this application and its dependencies. Use `kubectl` commands to deploy and manage a Kubernetes stack on your local machine. This requires local builds of each application in the stack.

## Ingress controller

This application makes use of [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress) resources in Kubernetes and therefore requires an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) to be running. Ingress controllers are outside the scope of any one application so the setup of an Ingress controller is left as a pre-requisite for running this application in Kubernetes.

For development, it is recommended to use the [NGINX Ingress controller](https://kubernetes.github.io/ingress-nginx) (the Docker for Mac [setup instructions](https://kubernetes.github.io/ingress-nginx/deploy) also work for WSL on Windows 10).

## Skaffold

[Skaffold](https://skaffold.dev) is used to run this application in development with automatic building and reloading of code changes.

## Connected services

Connected services must exist in neighbouring directories for Skaffold to run this application. This is because Skaffold builds and runs the entire Kubernetes stack from local files and does not support running services from remote configurations.

| Service       | URL                                                          | Description |
|---------------|--------------------------------------------------------------|-------------|
| `elm-lmp-api` | https://github.com/Matthew-Collins-Defra/elm-api-boilerplate | API service |

# Running the application

This application builds to a container image which may be run in isolation (for manual testing) or as part of a stack using Kubernetes or Docker Compose.

## Development

Bring up the development stack:

```
bin/dev
```

The above command will attach the command prompt to Skaffold, tailing the container logs for the whole stack.

Press `ctrl + c` to detach and trigger a clean-up of all resources built by Skaffold.

## Ingress controller

For traffic to reach services running in Kubernetes, an ingress controller is required. If you don't have other projects running specific ingress controllers already, you don't need to worry about this. The `bin/start` script will start an [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx) for you.

If you are running other projects in Kubernetes, you should inspect the start script to check for conflicts. This application may work fine with other types of ingress controller, they just haven't been tested.

## Tasks

Build tasks are maintained as shell scripts in the `bin` directory. These mostly execute Node programs in containers via `docker-compose` in order to minimise dependencies on the host system. The Node programs are defined as `npm-scripts` in `package.json`.

| Script        | Description                                                                    |
|---------------|--------------------------------------------------------------------------------|
| `bin/build`   | Build container images                                                         |
| `bin/dev`     | Run a local development stack                                                  |
| `bin/test`    | Run automated tests against built container images                             |
| `bin/watch x` | Run a code watcher (specify `build` or `unit` to build or run tests on change) |

## File watching

In development it is often useful to have file watchers automatically run tasks when code changes. The Docker Compose override configuration includes services for this purpose and the `bin/watch` task may be used to initialise specific watchers:

```
# Run build on source code change
bin/watch build

# Run unit test watcher
bin/watch unit
```

### File watching in Docker

Note that the Jest watcher seems to have issues when running in Docker so you may have to manually trigger test runs via the interactive menu presented by the watcher. Alternatively, you may wish to investigate something like [Docker Windows Notifier](https://github.com/dzek69/docker-windows-notifier) to trigger file change notifications within the development container.

## Config

The configuration file for the server is found at `server/config.js`.
This is where to put any config and all config should be read from the environment.
The final config object should be validated using joi and the application should not start otherwise.

A table of environment variables should be maintained in this README.

## Plugins

hapi has a powerful plugin system and all server code should be loaded in a plugin.

Plugins live in the `server/plugins` directory.

## Logging

The [good](https://github.com/hapijs/good) and [good-console](https://github.com/hapijs/good-console) plugins are included and configured in `server/plugins/logging`

The logging plugin is only registered when running in development.

Error logging for production should use errbit.

## Views

The [vison](https://github.com/hapijs/vision) plugin is used for template rendering support.

The template engine used in nunjucks inline with the GDS Design System with support for view caching, layouts, partials and helpers.

## Static files

The [Inert](https://github.com/hapijs/inert) plugin is used for static file and directory handling in hapi.js.
Put all static assets in `server/public/static`.

Any build output should write to `server/public/build`. This path is in the `.gitignore` and is therefore not checked into source control.

## Routes

Incoming requests are handled by the server via routes.
Each route describes an HTTP endpoint with a path, method, and other properties.

Routes are found in the `server/routes` directory and loaded using the `server/plugins/router.js` plugin.

Hapi supports registering routes individually or in a batch.
Each route file can therefore export a single route object or an array of route objects.

A single route looks like this:

```js
{
  method: 'GET',
  path: '/hello-world',
  options: {
    handler: (request, h) => {
      return 'hello world'
    }
  }
}
```

There are lots of [route options](http://hapijs.com/api#route-options), here's the documentation on [hapi routes](http://hapijs.com/tutorials/routing)
