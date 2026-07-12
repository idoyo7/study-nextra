---
title: "Helm 깎기"
---

# Helm 깎아보기


## Memo장 배포하기

```bash
helm 설치~
```

```bash
helm upgrade --install memos -n app . \
  -f cvalues.yaml \
  --set ingress.annotations."alb\.ingress\.kubernetes\.io/certificate-arn"="$MY_CERT_ARN" \
  --set ingress.hosts[0].host="$MY_DOMAIN"
```

## WordPress 배포하기

이제 클러스터에 Wordpress 를 배포하여 정상적으로 동작하는것을 확인한다.

배포는 HELM을 이용해 진행되는데,  HELM에 대해서는 따로 정리해서 올려두겠습니다.

간단하게 요약하면 하나의 템플릿을 이용해 소스를 설치하기 쉽게 만들어져있는 도구입니다.

이번 helm 배포에서는 별도로 repo를 pull하고, values.yaml파일에 필요한 변수들을 명세하여 실행하지않지만 모듈에 필요한 변수들만 정의하여 배포하는 방법도 가능합니다.

### 일반 wordpress 배포하기

PVC를 활용한 Kubernetes 공식 홈페이지 도큐먼트 기준

- 공식 DOC 기준
    
[mysql-tutorial]https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/
    
MySQL와 연동한 워드프레스를 배포해보겠습니다.

```
wget https://raw.githubusercontent.com/kubernetes/website/main/content/ko/examples/application/wordpress/wordpress-deployment.yaml
```
    
명령어로 배포에 필요한 코드들을 받아줍니다
    
```jsx
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: gp3
    
```
    
    
wordpress 와 mysql에 필요한 pvc들에  storageclass로 아까 생성한 GP3을 맵핑해 볼륨을 생성해줍니다

    
![image](https://apimin.montkim.com/cdn/blog/images/helm/Untitled.png)

정상적으로 gp3 볼륨의 pv가 생성된것을 확인할수있습니다.
    
![image](https://apimin.montkim.com/cdn/blog/images/helm/Untitled1.png)
    
사이트 생성에 완료했습니다.
    

일반 PVC를 이용한 배포 예제입니다.

이번에는 helm 을 이용해 배포해보는 과정을 가져보도록 하겠습니다.

### helm prerequsite

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo list
```

사용하고자 하는 helm repo를 로컬에 등록하고 확인하는 과정입니다.

```
kubectl create ns wordpress
```

HELM으로 배포할 wordpress는 별도의 namespace : wordpress에서 시작한다.

### helm 배포하기

1안. 그냥 설치하기

```
helm install myblog bitnami/wordpress -n wordpress
```

그냥 기본값으로만 설치된다.

```
helm install myblog \
  --set wordpressUsername=admin \
  --set wordpressPassword=password \
  --set wordpressBlogName="DKS BLOG" \
  --set service.type=NodePort \
  --namespace wordpress bitnami/wordpress
```

추가 옵션

```
--set replicaCount=2 --set service.type=NodePort
```

→ values.yaml로 변환하기

```
global:
  storageclass: "gp2"
persistence:
  storageclass: "gp2"
wordpressUsername : "admin"
wordpressPassword : "password"
wordpressBlogName : "PKOS BLOG"
replicaCount : 2
mariadb:
  enabled: true
  auth:
    rootPassword: rootpassword
    database: wordpress_db
    username: wp_user
    password: wp_password
  persistence:
    enabled: true
    storageClass: "gp2"
    accessModes:
      - ReadWriteOnce
      size: 10Gi
service : 
  type : NodePort
  
```

```
helm install myblog bitnami/wordpress -n wordpress --version 22.4.18

helm upgrade --install myblog bitnami/wordpress -n wordpress --version 22.4.18 -f cvalues.yaml
```

[value_on_chart](https://artifacthub.io/packages/helm/bitnami/wordpress?modal=values)

[values.yaml](https://github.com/bitnami/charts/blob/main/bitnami/wordpress/values.yaml)

소소한 팁:

helm install 로 진행할경우, 업그레이드 진행 등이 조금 불편하다.

```
helm upgrade --install ~
```

형태로 진행할경우, 초기설치부터 버전변경(업그레이드) 혹은 같은 버전에서의 value 값 변경을 이용한 patch가 가능하다.

삭제

```
helm uninstall myblog -n wordpress
```

이런 설정을 갖고있는 file configuration을 이용하여 배포가 가능합니다.

이제는 aws 환경에 걸맞는 custom value 파일을 작성합니다.

ingress class에 alb 를 입력하고 annotation에 로드밸런서에 필요한 설정들을 넣기도하며

service의 옵션으로 내부동작에 최적화되게끔 수정하는 코드를 반영하였습니다.

별도로 마스킹해야할 정보가 있지 않다면, 

```
helm install ~ -f cvalues.yaml
```

같은 형태로 설치가 가능하지만, 별도로 set value 를 이용해 설정이 가능합니다.

```
helm upgrade --install memos -n app . \
  -f cvalues.yaml \
  --set ingress.annotations."alb\.ingress\.kubernetes\.io/certificate-arn"="$MY_CERT_ARN" \
  --set ingress.hosts[0].host="$MY_DOMAIN"
```