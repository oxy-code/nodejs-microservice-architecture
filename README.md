# Microservice Architecure using Node.js in AWS

This repository is created, for the demonstration purpose of building Microservices in Node.js and deploy into the cloud system.

It uses cloud by leveraging freely available resources of AWS and also using Github Actions for its CI/CD integrations.

## Architecture Plan
[![Architecture](https://raw.githubusercontent.com/oxy-code/nodejs-microservice-architecture/refs/heads/main/architecture.png)]

## CI/CD Pipeline Status

|   Endpoints   |   Status  |
|   -------     |   ------  |
|   `POST /v1/users`   |   [![SignUp API](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/signup.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/signup.yml) |
|   `PUT /v1/users/:id`   |   [![UpdateProfileAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/update-profile.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/update-profile.yml) |
|   `POST /v1/auth/login`   |   [![LoginAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/login.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/login.yml) |
|   `POST /v1/tasks`   |   [![CreateTaskAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/create-task.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/create-task.yml) |
|   `GET /v1/tasks`   |   [![GetTasksAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-tasks.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-tasks.yml) |
|   `PUT /v1/tasks/:id` |   [![UpdateTaskAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/update-task.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/update-task.yml) |
|   `DELETE /v1/tasks/:id` |   [![DeleteTaskAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/delete-task.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/delete-task.yml) |
|   `POST /v1/projects`  |   [![CreateProjectAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/create-project.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/create-project.yml)  |
|   `GET /v1/projects`   |   [![GetProjectsAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-projects.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-projects.yml) |
|   `GET /v1/projects/:id` |   [![GetProjectsByIdAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-project-by-id.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-project-by-id.yml) |
|   `GET /v1/projects/:id/tasks` |   [![GetProjectsByIdAPI](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-project-by-id.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/get-project-by-id.yml) |


|   Application |   Status  |
|   ----------- |   ------  |
|   ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=flat&logo=nginx&logoColor=white)   |   [![Nginx ReverseProxy](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/nginx-proxy.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/nginx-proxy.yml)   |
|   ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white) |   [![AWS-EC2 Instance CD](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/ec2.yml/badge.svg)](https://github.com/oxy-code/nodejs-microservice-architecture/actions/workflows/ec2.yml)    |