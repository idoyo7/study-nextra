---
title: "Introduction"
---

# Introduction

기본적인 쿠버네티스 구성부터, 쿠버네티스 위에 올려서 구성 가능한 인프라, 플랫폼 및 쿠버네티스 위에서 구현하는 서비스들(오픈소스)과 그를 이용한 파이프라인(GitOps 등) 구성 등을 해볼 예정입니다.

## 쿠버네티스 강의안 (EKS 중심)

| **단원**        | **주제**                       |
|----------------|-------------------------------|
| **Chapter 1**  | 왜 컨테이너와 쿠버네티스인가?        |
| **Chapter 2**  | 쿠버네티스 아키텍처 이해            |
| **Chapter 3**  | EKS 클러스터 구성 (Terraform)  |
| **Chapter 4**  | 쿠버네티스 기본 리소스             |
| **Chapter 5**  | 네트워킹과 Ingress 관리         |
| **Chapter 6**  | 스토리지와 데이터 관리            |
| **Chapter 7**  | 애플리케이션 스케일링과 자원 관리     |
| **Chapter 8**  | Helm을 활용한 애플리케이션 배포     |
| **Chapter 9**  | 오픈소스를 활용한 시너지          |
| **Chapter 10** | Kubernetes 기반 CI/CD        |
| **Chapter 11** | 종합 실습과 프로젝트            |

---

### **Chapter 1: 왜 컨테이너와 쿠버네티스인가?**

- 기존 배포 시스템의 한계:
  - 환경 불일치 문제, 리소스 낭비, 느린 배포 속도.
- 컨테이너의 혁신:
  - 경량화된 배포, 일관된 환경 제공, 빠른 시작 시간.
- 쿠버네티스가 해결하는 문제:
  - 스케일링, 복구 자동화, 네트워킹.

---

### **Chapter 2: 쿠버네티스 아키텍처 이해**

- 쿠버네티스 클러스터 구성 요소:
  - Control Plane (API Server, Scheduler 등).
  - Node Components (kubelet, kube-proxy 등).
- 클러스터 내부 흐름 (Pod Scheduling 과정).

---

### **Chapter 3: EKS 클러스터 구성 (Terraform)**

- EKS와 Terraform 개요.
- 주요 리소스: VPC, Subnet, Node Group.
- 클러스터 구성 시 고려 사항:
  - IAM Roles, 보안 그룹 설정.
- **실습**: 제공된 Terraform 코드로 EKS 클러스터 생성.

---

### **Chapter 4: 쿠버네티스 기본 리소스**

- 주요 리소스 소개:
  - Pod, Deployment, Service, ConfigMap, Secret.
- YAML 문법 및 kubectl 명령어.
- **실습**: 간단한 애플리케이션 배포 및 서비스 노출.

---

### **Chapter 5: 네트워킹과 Ingress 관리**

- Pod-to-Pod, Service-to-Service 통신.
- VPC CNI Plugin과 네트워크 정책.
- Ingress Controller 설정.
- **실습**: Ingress를 통한 외부 트래픽 관리.

---

### **Chapter 6: 스토리지와 데이터 관리**

- PV와 PVC 개념 이해.
- EBS, EFS, S3와의 통합.
- **실습**: PVC 요청 및 데이터 유지.

---

### **Chapter 7: 애플리케이션 스케일링과 자원 관리**

- HPA를 통한 수평 스케일링.
- 리소스 제한 설정 및 QoS Class.
- **실습**: 리소스 제한 설정 및 HPA 적용.

---

### **Chapter 8: Helm을 활용한 애플리케이션 배포**

- Helm 기본 개념:
  - Chart 구조와 Release 관리.
- Helm 활용한 애플리케이션 배포 및 업그레이드.
- **실습**: 간단한 Helm Chart 작성 및 배포, Rollback 실습.

---

### **Chapter 9: 오픈소스를 활용한 시너지**

- ArgoCD를 활용한 GitOps.
- Prometheus와 Grafana로 모니터링 구성.
- **실습**: ArgoCD를 통한 자동화 배포, 모니터링 대시보드 구성.

---

### **Chapter 10: Kubernetes 기반 CI/CD**

- CI/CD 개념과 도구 비교:
  - GitHub Actions, Jenkins, Tekton.
- CI/CD 설계와 Helm 통합.
- **실습**: GitHub Actions로 애플리케이션 빌드 및 배포.

---

### **Chapter 11: 종합 실습과 프로젝트**

- Terraform을 활용한 클러스터 구성부터 배포까지.
- ArgoCD, Prometheus 등을 통합한 운영 환경 구성.
- **실습**: 종합 프로젝트 - 서비스 모델링, 운영 환경 구축, 문제 해결.

---

