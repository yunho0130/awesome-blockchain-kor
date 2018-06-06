# awesome-blockchain-kor
- 블록체인 학습에 필요한 자료 및 소스코드를 모아봤습니다.(요약 포함) 
- Pull Request 주시면 반영하도록 하겠습니다.
- **Star와 Follow는 개발자를 춤추게 합니다. 더 빠른 업데이트와 양질의 자료를 원하신다면 꼭 눌러주세요.**
<iframe src="https://ghbtns.com/github-btn.html?user=yunho0130&repo=awesome-blockchain-kor&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>

#### ICO 기초 
- 배경지식  
    - [컬럼] 욕망으로 읽어보는 블록체인: 코인과 화폐에 대한 내용 <http://monthly-jiandson.tistory.com/9>  
    - [컬럼] ICO(Initial Coin Offering)의 이해와 프라이빗 블록체인(Private Blockchain): 퍼블릭과 프라이빗 선택 가이드 라인(요즘에는 Permissionless vs Permissioned 라는 용어를 사용). <http://monthly-jiandson.tistory.com/13>
    - 에어드랍, 하드포크 vs 소프트포크, 하드웨어왈렛 (추가예정)
- 지갑생성 및 이더리움 전송
    - 메타마스크(Metamask) 사용법 01 <https://steemit.com/kr/@twinbraid/metamask-01>  
    - 메타마스크(Metamask) 사용법 02 <https://steemit.com/kr/@twinbraid/metamask-02>  
    - 메타마스크(Metamask) 사용법 03 <https://steemit.com/kr/@twinbraid/metamask-03>  
    
#### 이더리움 프로그래밍 Hello Solidity!
![](media/15282674796425.jpg)

- 공식 홈페이지 제공 Solidity 소스코드  
    - ERC20 기반 토큰 생성 코드: 최소 기능 버전 MVP(Minimum Viable Product) <https://github.com/yunho0130/awesome-blockchain-kor/blob/master/ethereum-token-v0.1/generate-token.sol>
    - ERC20 기반 토큰 생성 코드: 보다 완성된 버전(More Complete) 코드 <https://github.com/yunho0130/awesome-blockchain-kor/blob/master/ethereum-token-v0.1/generate-token-complete.sol>

#### 이더리움 ERC20 취약점(ethereum-ERC20-vulnerability) 요약
- 이더리움 공식 홈페이지에서 제공하는 ERC20 소스코드 중 `transfer` 기능만 사용하는 경우 보안상의 결함이 발견. 
- ERC20 코인들 중, 본 결함으로 인해 손실된 금액은 아래와 같음(2017년 12월 27일 기준)
    1. 퀀텀 QTUM, **$1,204,273** lost. [watch on Etherscan](https://etherscan.io/address/0x9a642d6b3368ddc662CA244bAdf32cDA716005BC)

    2. 이오스 EOS, **$1,015,131** lost. [watch on Etherscan](https://etherscan.io/address/0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0)

    3. 골렘 GNT, **$249,627** lost. [watch on Etherscan](https://etherscan.io/address/0xa74476443119A942dE498590Fe1f2454d7D4aC0d)

    4. 스토리지 STORJ, **$217,477** lost. [watch on Etherscan](https://etherscan.io/address/0xe41d2489571d322189246dafa5ebde1f4699f498)
    
    5. 트론 Tronix , **$201,232** lost. [watch on Etherscan](https://etherscan.io/address/0xf230b790e05390fc8295f4d3f60332c93bed42e2)
    
    6. 디직스다오 DGD, **$151,826** lost. [watch on Etherscan](https://etherscan.io/address/0xe0b7927c4af23765cb51314a0e0521a9645f0e2a)
    
    7. 오미세고 OMG, **$149,941** lost. [watch on Etherscan](https://etherscan.io/address/0xd26114cd6ee289accf82350c8d8487fedb8a0c07)
    
    8. 스토리지 STORJ, **$102,560** lost. [watch on Etherscan](https://etherscan.io/address/0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac) 
- `approve` + `transferFrom` 메카니즘을 사용하거나 ERC20을 사용하지 않는 것을 권고. 



##### Disclaimer
본 레파지토리는 개인의 자격으로 운영되며 IBM과 관련이 없습니다. 몇몇의 블록체인 프로젝트들과 학습자료를 모아두었습니다. This repository is consist of several experimental blockchain project and learning materials. (Not related to IBM. It's personal repository)  


