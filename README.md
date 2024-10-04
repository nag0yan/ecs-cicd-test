# ECS CICD
Github Actions実践入門12章

## ECS Serviceのデプロイ
CloudShellで実行
```shell
export APP_NAME=demo
export SVC_NAME=example
export ENV_NAME=test

copilot app init $APP_NAME
copilot svc init --name $SVC_NAME --app $APP_NAME --image nginx --port 80 --svc-type "Load Balanced Web Service"
copilot env init --name $ENV_NAME --app $APP_NAME --profile default --default-config
copilot env deploy --name $ENV_NAME
copilot svc deploy --name $SVC_NAME --env $ENV_NAME
```
