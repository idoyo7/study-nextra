---
title: "환경 구성을 위한 초석"
---

# 환경 구축하기

해당 스터디의 Prerequsite로 다음과 같은 환경설정들이 선수되어있어야 합니다.

해당 글에서는, 자격증명 자체에 대한 설정을 제외한 간단한 환경설정 자체에 대한것을 다룹니다.

실습을 진행하는 현재 환경은 vs code 를 컨테이너로 호스팅중입니다.

해당 컨테이너는 데비안 12버전을 사용중이기에 

익숙한 OS 인 ubuntu 기준으로는 약 22.04 와 비슷한 버전이라고 생각하시면 될것같습니다.

## 카테고리

### 인프라 프로비저닝

- AWS CLI
- Terraform

### 쿠버네티스 관리도구

- EKSCTL
- Kubectl
- Helm
- K9S

크게는 두가지 카테고리로 분류했습니다.

첫번째는 AWS 상 쿠버네티스인 EKS 를 구성하기에 필요로하는 인프라 기반의 IaC 구성을 위한 `인프라 프로비저닝` 카테고리와, 그렇게 구성된 쿠버네티스 위에서 구성하는 어플리케이션, 아키텍처 구성을 위한 `Kubernetes 관리도구` 항목으로 분류하였습니다.

물론 서로 상호의존적으로 양쪽의 자격증명들을 거쳐 구성해야하는 것들이 있기때문에 각각을 아주 분리하여 사용할순 없을것이라 생각이 됩니다.

큰 틀에서의 기능적 분류라고만 생각하시면 될것같습니다.

## 각 구성요소 설명 및 설치 진행

### Package prerequisite
Unzip, gpg 
해당 게시글 실습에 앞서 필요한 Package 설치를 진행합니다.
```
sudo apt update && sudo apt install -y unzip gpg
```

    
### AWS CLI

EKS 기반의 시스템을 구성하기위해 AWS 계정에 접근가능하게 설정이 되어있어야합니다.

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

```

이후  해당 명령어로 정상적으로 설치되어 사용이 가능한지 확인합니다.

```bash
aws --version
```

aws cli의 경우 

`CLI 자격 증명 파일` :  

```bash
~/.aws/credentials
```

`CLI 설정 파일` : 

```bash
~/.aws/config
```

해당 위치에 설정을 진행하여 자격증명을 진행합니다.

해당 과정에서 필요로하는 엑세스 키에 대한 내용은 해당과정에서 다루기에는 범위를 크게 벗어나 생략합니다.

### Terraform

Terraform 을 이용하여 사전에 정의해둔 인프라를 배포하기위해 필요한 도구입니다.

[https://developer.hashicorp.com/terraform/install](https://developer.hashicorp.com/terraform/install)

해당 링크에있는 installation guide를 그대로 따라하여 설치를 진행합니다.
    

```bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

gpg key 를 추가해 package를 설치하는 간단한과정입니다

```bash
terraform -install-autocomplete
```

명령어를 통해 패키지들이 정상적으로 설치되어 있는지 확인합니다.

### EKSCTL

AWS에 배포된 정보들과 EKS 정보들을 짬뽕하여 사용가능한 cli입니다.

해당 cli 로만 EKS 클러스터 생성도 가능하지만, IaC 기반의 인프라 구성과 아키텍처(어플리케이션) 구성하려는 방향과 맞지않아 해당 과정을 다루진 않습니다.

그렇지만 여전히 해당 cli 를 이용하여 부분적으로 도움을 받을 수 있는 경우가 있으니 설치를 진행합니다.

 

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C 
sudo cp ~/eksctl /usr/local/bin

```

아주 TMI 이기도하지만, eksctl를 최초에 만들었던 Weavenet은 현재 폐업했고…

(Weave CNI 또한 RIP…)

Amazon에서 일부 유지보수를 하고있는것으로 알지만, 이러한 애드온들이 aws 구성의 파편화를 의미하기도하여, 깊게 다루다보면 일부 “정상적으로 프로비저닝이 불가능한” 구성들이 가능한 경우도 존재한다고 합니다.

### Kubectl

kubectl 은 쿠버네티스에 쿠버네티스 api 요청을 위한 cli 입니다.

온프레미스 구성을 하면서 간혹 헷갈리는경우가 많은데, 실제로는 api 요청을 처리 가능한 서버에 kube-api 포트인 6443으로 요청을 보내 응답만 받을수있다면, 

어떤 원격 서버에서 kubernetes api 요청을 해도 무방합니다.

kubectl 또한 마찬가지입니다.

```bash
# curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.31.2/2024-11-15/bin/linux/amd64/kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

```

EKS에서의 kubectl 명령어는 조금 추가된 형태의 인증/인가를 거칩니다.

kubectl 요청을 날릴때 aws cli와 비슷한 형태로, `.kube/config`에 정의된 인증서를 기반으로 api 요청을 날리는데요,  EKS 의 kubectl 명령어는 awscli 에서 된 자격증명이 병행되어야 
kubernetes config + aws config 를 조합하여 api 요청을 정상적으로 응답받을 수 있습니다.

```bash
kubectl version
```

해당 명령어로 cli 가 정상적으로 설정된것을 확인합니다.

https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/create-kubeconfig.html

해당 문서를 참조하여 aws cli 를 이용한 kubeconfig 를 신규로 갱신합니다.

두가지 인증/인가를 모두 마쳤다면, kubectl get nodes 같은 명령어에 정상적으로 요청에 대한 응답을 수신 할 수 있을겁니다.

### Helm

helm 이야말로 kubernetes를 이용한 어플리케이션 구성의 정점이 아닐까 싶습니다.

사전에 구성된 어플리케이션에 필요한 “한방 패키지” 를 설치 할 수 있게 해주는 도구라고 얘기할수있겠네요.

단순히 배포하는 파일 이상으로 필요한 configuration 등에 대한 것들을 전부 다루기도 합니다.

자세한 내용은 Helm 자체의 별도 단원을 다루기도 하기때문에 설치로 넘어가봅니다.

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh

```

꽤 간단한 구성입니다.

### K9S

간단한 CLI 기반 Dashboard 어플리케이션입니다.

GUI 기반의 대시보드 보다 권한도 많고, 직관적이라 익숙해지면 Kuberentes 기반의 플랫폼을 관리하는데 최적화 되어있는 도구라고 생각이 드네요.

[K9S_설치](https://zetawiki.com/wiki/%EB%A6%AC%EB%88%85%EC%8A%A4_k9s_%EC%84%A4%EC%B9%98)

해당 링크에 매번 들어가서 설치를 진행하기도 하는데

```bash
K9S_VERSION=$(curl -s https://api.github.com/repos/derailed/k9s/releases/latest | jq -r '.tag_name')
curl -sL https://github.com/derailed/k9s/releases/download/${K9S_VERSION}/k9s_Linux_amd64.tar.gz | sudo tar xfz - -C /usr/local/bin k9s

```

k9s command를 쳐서 cli dashboard 에 접속이 가능하며

 `:`  를 입력해서 조회하고자 하는 유형의 리소스 (Deployment, Pod 등)

`/`  :  를 입력해서 조회된 리소스들에 대한 검색결과

`e`  :  를 입력해서 리소스 수정 (edit)

`d` :  를 입력해서 조회된 리소스들에 대한 상세정보 (describe)

`Ctrl + d` : 리소스 삭제

혹은 기타 커맨드들을 이용해 쿠버네티스 관리가 가능합니다.