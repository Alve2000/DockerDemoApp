# DockerDemoApp

This is a basic nodejs express application to test the workflow of docker.

We have 4 containers node-app, mongodb, redis, and nginx talking to each other.

The main program runs in the node-app that can be scaled to multiple containers.

To connect to a database, we have a mongodb container.

For caching data and storing sessions, we have a redis container.

And to proxy all the requests from the host system to these containers, we have nginx container that acts as a load balancer.