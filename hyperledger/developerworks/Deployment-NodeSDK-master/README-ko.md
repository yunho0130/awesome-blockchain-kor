# Hyperledger Fabric Node SDK를 사용하여 블록체인 네트워크 생성하고 배포하기

*다른 언어로 보기: [English](README.md)*

## 블록체인 네트워크 설정하기



블록체인 애플리케이션 빌드하기 파트1에 오신 것을 환영합니다. 첫번째 코드 패턴은 블록체인을 백엔드로 사용하여 피트니스 활동을 기록하고 fitcoin을 통한 상품의 주문과 같은 트랜잭션을 관리하는 비교적 더 큰 규모의 애플리케이션입니다. 이 시리즈의 첫 단계에서는 Hyperledger Fabric Node SDK를 사용하여 Hyperledger 블록체인 네트워크를 만들고 배포하는데 중점을 둡니다. 이 코드 패턴에는 두 명의 참가자, 즉 구매자 그리고 판매자/상점 피어가 있습니다. 구매자는 애플리케이션을 다운로드한 후 자신의 단계를 블록체인에 등록하고, 판매자는 구매자가 구매를 하기에 충분한 fitcoin을 가지고 있는지 확인합니다.



IBM Cloud의 평생 무료인 lite 계정이 있다면 이 애플리케이션을 로컬에서 실행하시거나 [IBM Blockchain Starter Plan](https://www.ibm.com/blogs/blockchain/2018/03/getting-started-on-the-ibm-blockchain-platform-starter-plan/)을 사용하실 수 있습니다.



## 구성 요소

* Hyperledger Fabric

* Docker

* Node.js용 Hyperledger Fabric SDK





## 애플리케이션 흐름도

![Application Workflow](images/Pattern1-Build-a-network.png)



## 사전에 필요한 지식

* [Docker](https://www.docker.com/products/overview) - v1.13 or higher

* [Docker Compose](https://docs.docker.com/compose/overview/) - v1.8 or higher



## 순서

1. [Build.sh를 실행하여 네트워크 빌드](#1-buildsh-스크립트-실행)

2. [네트워크 시작](#2-네트워크-시작)

3. [로그에서 결과 확인](#3-로그-확인)

4. [블록체인 네트워크 확인](#4-블록체인-네트워크-확인)



## 1. Build.sh 스크립트 실행

다음 순서를 수행합니다:



a. 기존에 존재하는 블록체인 도커 이미지를 삭제하여 시스템을 초기화한다.



b. 인증서를 발급한다.



  * `crypto-config.yaml`(암호 설정파일)은 소속 기관이나 부서 등 Peers와 Orderers간 서로의 신분의 내용을 정의합니다.



c. Peers, Orderers 그리고 Channel을 생성한다.



  * `configtx.yaml` 파일은 블록체인 네트워크 또는 채널을 초기화하고, Orderer에게 체인의 가장 첫번째인 제네시스 블럭을 제공합니다. (Shop 또는 Fincoin 피어일 경우 멤버십 서비스는 각 채널 피어에 설치됨.)



d. Orderer, Peer, Channel, Network 도커 이미지를 생성한다.



### 새로운 터미널을 열어 다음 명령어 실행:

```bash

export FABRIC_CFG_PATH=$(pwd)

chmod +x cryptogen

chmod +x configtxgen

chmod +x generate-certs.sh

chmod +x generate-cfgtx.sh

chmod +x docker-images.sh

chmod +x build.sh

chmod +x clean.sh

./build.sh

```



## 2. 네트워크 시작



다음 테스트 실행 후 이 순서를 재진행하는 경우 'LOCALCONFIG' 환경변수가 정의되지 않도록 합니다.

```bash

unset LOCALCONFIG  

```



피어노드에 체인코드를 설치하고 블록체인 네트워크를 시작하기 위한 두 가지 옵션이 있습니다. 다음 중 하나를 선택하세요.

* LevelDB 사용하여 블록체인 상태를 저장하는 경우, 다음 명령어를 실행하여 네트워크를 시작합니다:

```bash

docker-compose -p "fitcoin" -f "docker-compose.yaml" up -d    

```

* CouchDB 사용하여 블록체인 상태를 저장하는 경우, 다음 명령어를 실행하여 네트워크를 시작합니다:

```bash

docker-compose -p "fitcoin" -f "docker-compose-couchdb.yaml" up -d    

```



## 3. 로그 확인



다음 스크립트를 실행하여 로그 결과를 확인합니다.



**Command**

```bash

docker logs blockchain-setup

```

**Output:**

```bash

Register CA fitcoin-org

CA registration complete  FabricCAServices : {hostname: fitcoin-ca, port: 7054}

Register CA shop-org

CA registration complete  FabricCAServices : {hostname: shop-ca, port: 7054}

info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"shop-peer","grpc.default_authority":"shop-peer"}

info: [EventHub.js]: _connect - options {"grpc.ssl_target_name_override":"fitcoin-peer","grpc.default_authority":"fitcoin-peer"}

Default channel not found, attempting creation...

Successfully created a new default channel.

Joining peers to the default channel.

Chaincode is not installed, attempting installation...

Base container image present.

info: [packager/Golang.js]: packaging GOLANG from bcfit

info: [packager/Golang.js]: packaging GOLANG from bcfit

Successfully installed chaincode on the default channel.

Successfully instantiated chaincode on all peers.

```





## 4. 블록체인 네트워크 확인



다음 명령을 실행하여 네트워크에서 `invoke`와 `query` 기능을 테스트하세요:

```bash

cd configuration

export LOCALCONFIG=true

node config.js

cd ..

cd test/

npm install

```



LevelDB 사용 시, 다음 명령어를 실행합니다:

```bash

node index.js

```



CouchDB 사용 시, 다음 명령어를 실행합니다:

```bash

node indexCouchDB.js

```





## 추가 자료

* [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/en/release-1.1/)

* [Hyperledger Fabric code on GitHub](https://github.com/hyperledger/fabric)



## 라이센스

[Apache 2.0](LICENSE)



