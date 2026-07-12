---
title: "Storage On Kubernetes"
---

# Storage On Kubernetes

쿠버네티스에서 사용하는 Storage 표준과 AWS에서 제공하는 Storage 유형들을 학습합니다.

---

컨테이너는 종료되면 안에있던 파일 스토리지가 증발하는 ephemeral 한 스토리지를 갖고있습니다.

하지만 상태의 저장을 위해 stateful 한 어플리케이션을 보장하기위해 파드의 라이프사이클과 무관하게 지속되는 스토리지가 필요했습니다.

이를위해 컨테이너 표준이 적립되면서 컨테이너에서의 스토리지 표준에 대해 정립이된게 바로 CSI 입니다.



### CSI란


[CSI_SPEC](https://github.com/container-storage-interface/spec)




쿠버네티스에서는 볼륨에 대한 선언인 Persistent Volume Claim 과 실제 볼륨인 Persistent Volume 을 구분해서 사용합니다.

이러한 각 스토리지에서 제공되는 CSI Driver를 이용하여 쿠버네티스 pod에서 디바이스들을 마운트 할 수 있습니다.

![image](https://apimin.montkim.com/cdn/blog/images/AEWS/week3/EKS_Storage/Untitled.png)

노드에 Daemonset에서 



CSI에서 볼륨 생성하는 과정

![image](https://apimin.montkim.com/cdn/blog/images/CSI/Untitled1.png)

볼륨이 필요한 어플리케이션의 스토리지 요청을 할때 다음과 같은 과정이 일어납니다.
1. PVC 생성
2. 볼륨이 존재하지 않을경우 동적 프로비저닝 실행
3. 외부 볼륨 프로바이더에서 볼륨 생성완료후 응답
4. PV 형태로 리소스(세부 볼륨) 정보 생성완료
5. PV를 어플리케이션이 구동될때 마운트

구체적인 연결관계는 차이가 있을 수 있지만, 



#### 동적 프로비저닝
https://kubernetes.io/ko/docs/concepts/storage/dynamic-provisioning/

해당 Volume Controller에서 Storage Provider 측으로 스토리지 볼륨생성요청을 할 권한을 부여하는 정책
볼륨 자체의 요구인 PVC 생성 후, PVC에서 사용할 PV가 없을경우 프로비저닝하는 역할

StorageClass라는 쿠버네티스 객체를 생성하여 해당 파라미터에 맞는 요청이 들어올때, 맞는 PV 생성을 Storage Service에 요청합니다.



### Storage On AWS

AWS의 Storage Service 를 호출해서 EKS에서 사용하는 형태는 다음과 같습니다.

![image](https://apimin.montkim.com/cdn/blog/images/AEWS/week3/EKS_Storage/Untitled1.png)

CSI 규격에 맞는 Controller와 볼륨을 붙이기 위한 Daemonset의 형태로, 이루어져있습니다.




#### EBS

EBS CSI Driver의 형태로 제공되는 EKS Addon의 일부입니다.
해당 애드온을 이용해 AWS의 Block Storage 를 생성, 사용 할 수 있습니다.

![image](https://apimin.montkim.com/cdn/blog/images/AEWS/week3/EKS_Storage/Untitled5.png)
출처 : https://malwareanalysis.tistory.com/598


물론 CSI Controller에서 AWS측에 API 요청을할때, AWS 에서 필요로하는 적절한 권한을 가진 상태에서의 요청을 요구하기때문에 권한 설정이 필요합니다.

- 이 부분의 설명은 별도 인증/인가 섹션에서 다룰 예정입니다.



#### EBS StorageClass 설정

EBS CSI Driver를 설정하면 Default로 GP2 type의 Storageclass가 생성됩니다.

이 Storageclass를 이용해 Block Storage를 생성 할수도 있지만, 조금 더 성능이 좋은 GP3을 이용한 StorageClass 를 만들어보겠습니다.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: gp3
allowVolumeExpansion: true
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
  allowAutoIOPSPerGBIncrease: 'true'
  encrypted: 'true'
  fsType: xfs # 기본값이 ext4
```


기본적인 예시입니다.
이제 해당 StorageClass인 GP3 형태로 생성요청을 하게될경우 PV 가 GP3으로 생성이 됩니다.


```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 4Gi
  storageClassName: gp3
```

`나는 4Gi 의 GP3 볼륨이 필요해` 라는 요청에 대한 스토리지 명세파일입니다.


```
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  terminationGracePeriodSeconds: 3
  containers:
  - name: app
    image: centos
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo \$(date -u) >> /data/out.txt; leep 5; done"]
    volumeMounts:
    - name: persistent-storage
      mountPath: /data
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: ebs-claim
```

해당 Storage를 사용하는 임시 어플리케이션을 띄워보겠습니다.

위에서 생성한 ebs-claim이라는 pvc의 정보에 맞는 볼륨을 마운트하면 된다는 의미인데, 실제로 생성된 pv 정보를 직접 어플리케이션 배포 코드에서 다루지 않고있습니다.

![image](https://i.namu.wiki/i/XDVrtVbJXtd059R9AP5CZlgU20ADGGN5tgzuT30Fj393vb08IGrLDOxTOfIe15ZdU0nAVsvFcBiAPe3PeHi_aQ.webp)


실제로 PV 자체에 대한 정보는 알 필요 없다
처럼 뒤에 쿠버네티스 플랫폼 - Storage 제공자 측에서 관리할 영역이지, 해당 배포파일에서 관리해야할건 또 아니라는 이야기이기도 합니다.

### EFS

efs 시스템은 AZ구분이 없는 스토리지로, 다중마운트를 제공하는 “공용 파일시스템” 에 적합한 종류의 파일시스템입니다.
![image](https://apimin.montkim.com/cdn/blog/images/AEWS/week3/EKS_Storage/Untitled16.png)

Block 자체에 대한것이 아닌, 매니지드  File System에 대한 이야기이니, 동시성이나 확장에 대한 규약은 기본적으로 AWS 에서 제공하는 최대치와 동일합니다.

결국 AWS에서 제공되는 볼륨을 그저 갖다 쓰는것 뿐이니깐요

EFS는 그중에서 NFS 기반으로 이루어진 Multi-AZ를 지원하는 파일시스템입니다.
쿠버네티스 관점에서 위의 EBS와 다른점은, 내부적으로 ReadWriteMany 형태로 선언해서 여러개의 Pod에 마운트 할 수 있다는 이야기기도 합니다.


[multi-pod-sample](https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/examples/kubernetes/multiple_pods)

aws efs csi driver 에서 제공되는 example 코드를 기준으로 살펴보겠습니다.

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: efs-sc
provisioner: efs.csi.aws.com
```


storage class 자체의 구성은 굉장히 단촐합니다.
기존에 생성된 efs 를 그대로 이용하는것뿐 별도의 파라미터들이 필요로하진 않을테니깐요.


```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: efs-claim
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: efs-sc
  resources:
    requests:
      storage: 5Gi
```

efs는 조금 다른형태의 볼륨을 사용하는데, 
block storage provisioning 을 할 필요가 없기때문에, 동적 프로비저닝이 존재하지 않습니다.

다만 일회성으로 쿠버네티스에 PV가 생성된다면, 그 이후에 PV는 모든 노드에서 프로토콜에 맞게 마운트가 가능하겠죠!

기 생성되어 마운트 가능한 EFS 볼륨을 AWS CLI로 조회해봅니다.
```
aws efs describe-file-systems --query "FileSystems[*].FileSystemId" --output text
```

Sample 코드에서 설정되어있는  PV 내용입니다.

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: efs-pv
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: efs-sc
  csi:
    driver: efs.csi.aws.com
    volumeHandle: fs-4af69aab
```


volumeHandle 부분에 위에서 AWS CLI로 획득한 EFS이름을 넣으면 해당 EFS를 마운트 할 수 있게 됩니다.

해당 Git에 있는 pod 두개를 배포해봅니다.
두 pod는 동일한 pvc (pv)를 바라보고있지만, ReadWriteMany가 가능한 pod이기때문에, 생성이 완료됩니다.

![image](https://apimin.montkim.com/cdn/blog/images/AEWS/week3/EKS_Storage/Untitled17.png)

볼륨 사이즈가 8.0E 로 잡히긴하는데, 
스토리지의 크기를 별도로 할당하지 않았기때문에 뜨는 값입니다만, 실제로 저 볼륨을 다 채울수 있을리는 없겠죠...

온프레미스에서 NFS 로 볼륨을 연결하는것또한 동일합니다.
Block Storage아 아닐경우, NFS 자체만으로 공용볼륨을 조금씩 나눠쓰는 형태로 마운트를 한다면, 논리적인 볼륨의 최대치가 잡힙니다.


