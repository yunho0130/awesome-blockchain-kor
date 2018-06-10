# awesome-blockchain-kor
- 블록체인 학습에 필요한 자료 및 소스코드를 모아봤습니다.(요약 포함) 
- Pull Request 주시면 반영하도록 하겠습니다.
- **Star와 Follow는 개발자를 춤추게 합니다. 더 빠른 업데이트와 양질의 자료를 원하신다면 꼭 눌러주세요.**

[입문: 일반인 개인투자자 & 교양을 위한 블록체인] (#고급)
[중급: 비개발 현업종사자] 마케터 CEO 기획자 디자이너
[고급: 개발 현업종사자] 개발자를 위한 실제 구현 및 이슈 



## [입문: 일반인] 개인투자자 & 교양을 위한 블록체인
- 배경지식  
    - [컬럼] 욕망으로 읽어보는 블록체인: 코인과 화폐에 대한 내용 <http://monthly-jiandson.tistory.com/9>  
    - [컬럼] ICO(Initial Coin Offering)의 이해와 프라이빗 블록체인(Private Blockchain): 퍼블릭과 프라이빗 선택 가이드 라인(요즘에는 Permissionless vs Permissioned 라는 용어를 사용). <http://monthly-jiandson.tistory.com/13>
    - 에어드랍, 하드포크 vs 소프트포크, 하드웨어왈렛 (DeveloperWorks에 추가예정)
- 지갑생성 및 이더리움 전송
    - 메타마스크(Metamask) 사용법 01 <https://steemit.com/kr/@twinbraid/metamask-01>  
    - 메타마스크(Metamask) 사용법 02 <https://steemit.com/kr/@twinbraid/metamask-02>  
    - 메타마스크(Metamask) 사용법 03 <https://steemit.com/kr/@twinbraid/metamask-03>  

## [중급: 비개발 현업종사자] 마케터 CEO 기획자 디자이너



#### 주요 한글 백서 모음 (/Whitepapers 폴더 참고) 
- 이오스 EOS 한글 백서(이태민님 번역) 번역본 출처: <https://github.com/bookchainio/eos-docs/blob/master/ko-KR/TechnicalWhitePaper.md> 
- 이더리움 한글 백서 번역본 출처: 공식 Github위키 <https://github.com/ethereum/wiki/wiki/%5BKorean%5D-White-Paper>
- 비트코인 한글 백서 번역본 출처: 츄이스님 



    
#### 이더리움 프로그래밍 Hello Solidity!
![](media/15282674796425.jpg)

- 공식 홈페이지 제공 Solidity 소스코드  
    - ERC20 기반 토큰 생성 코드: 최소 기능 버전 MVP(Minimum Viable Product) <https://github.com/yunho0130/awesome-blockchain-kor/blob/master/ethereum-token-v0.1/generate-token.sol>
    - ERC20 기반 토큰 생성 코드: 보다 완성된 버전(More Complete) 코드 <https://github.com/yunho0130/awesome-blockchain-kor/blob/master/ethereum-token-v0.1/generate-token-complete.sol>

#### 이더리움 ERC20 취약점(ethereum-ERC20-vulnerability) 요약
- 이더리움 공식 홈페이지에서 제공하는 ERC20 소스코드 중 `transfer` 기능만 사용하는 경우 보안상의 결함이 발견. 
- ERC20 코인들 중, 본 결함으로 인해 손실된 금액은 약 300만 달러(2017년 12월 27일 기준)
- `approve` + `transferFrom` 메카니즘만을 사용하거나 `transfer`의 보안 취약성을 보완한 뒤 사용할 것을 권고

#### 하이퍼레저 프로그래밍 (Hello Hyperledger!)
![](media/15282706026711.png)

## [고급: 개발 현업종사자] 개발자를 위한 실제 구현 및 이슈 <a id="고급"></a>


#### 정리중 
- IBM Cloud를 활용한 하이퍼레저 프로그래밍 시작하기 (작성중)
- Hyperledger Composer 사용하기 (작성중) 
- 트러플, 테스트넷, 솔리티디, 가나슈
- 이더리움 개발 어떤 언어로 할 것인가?, 
- 하이퍼레져 이더리움 연동하기
- 이오스 메인넷 프로그래밍
- 오버플로우, 언더플로우, 대처법 safemath
- PoW
- PoS: 특정 시스템에서 지분을 많이 보유한 사람이 자신의 지분 가치를 하락시키는 일은 하지 않을 것이라는 것(류영훈, 2018).
- Nothing-at-Stake 네트워크상에 두 개 이상의 포크가 있을 경우, 양쪽에 동시에 베팅하는 것. PoS의 경우 자산 증명의 한계 비용이 없기 때문에 가능한 일. 이더리움은 디포짓과 패널티를 통해 해결하려 하고 있음.
- DPoS(Delegated Proof of Stake): 상위 20개의 노드에 권한을 위임하고, 대표자(Delegate)로 임명. 
- PoI
- 51%공격 (합의가로채기) 
- 키재생성공격
- PBTF란? 고속트랜잭션 처리를 위해 설계되어 초당 수천만 건의 트랜잭션을 처리할 수 있다. (it-chain에서 활용) <pmg.csail.mit.edu/papers/osdi99.pdf> (김용재 등, 2018)
- 머클 트리(Merkle Tree) 구조도
- 패스트 비잔틴 합의 (Fast Byzantine Consensus) 
- 폐쇄형 컨소시엄 블록체인 (Consortium Blockchain): 리플, 하이퍼레져
- 비즈니스 네트워크 아카이브 (Business Network Archive, BNA): 하이퍼레저 컴포저라는 개발툴을 통해 생성된 파일로 블록체인 망에 배포할 때 스마트 컨트랙트가 자동으로 생성. (허강욱, 2018) 
- 하이퍼레저 장점: 컴포져라는 접근성 좋은 툴, 기존 시스템과 연동, 다양한 개발 언어 지원(Go, Node.js, Java), 데이터 백업/복구, BaaS
- 면접 질문 리스트 
- 온 체인 트랜잭션, 오프 체인 트랜잭션, 사이드 체인, 차일드 체인, 지불 채널, 인터체인
블록체인 <https://steemit.com/kr-dev/@modolee/onchain-offchain>

#### 한글 백서 모음

#### 참고문헌
- 류영훈(2018), 스팀과 스팀잇의 세계, 마이크로 소프트웨어: 체인빅뱅, 392호
- 김용재, 유동균, 이준범 등(2018), 나만의 프라이빗 블록체인 it-chain, 마이크로 소프트웨어: 체인빅뱅, 392호
- 허강욱(2018), 하이퍼레저 패브릭, 마이크로 소프트웨어: 체인빅뱅, 392호


#### Disclaimer
본 레파지토리는 몇몇의 블록체인 프로젝트들과 학습자료를 모아둔 곳입니다. 개인의 자격으로 운영되며 IBM과 관련이 없습니다. 또한, 본 레파지토리에 있는 코드를 사용할 경우 발생하는 모든 종류의  문제(기술적/보안적/법률적/etc)를 책임지지 않습니다. This repository is consist of several experimental blockchain project and learning materials. Not related to IBM. It's personal repository. So I have no responsibility for using this code about all kind of problems such as technical/security/legal/etc. 

