# awesome-blockchain-kor
- 블록체인 학습에 필요한 자료 및 소스코드를 모아봤습니다.(요약 포함) 
- Pull Request 주시면 반영하도록 하겠습니다.
- **Star와 Follow는 개발자를 춤추게 합니다. 더 빠른 업데이트와 양질의 자료를 원하신다면 꼭 눌러주세요.**

#### ICO 기초 
- 배경지식  
    - [컬럼] 욕망으로 읽어보는 블록체인: 코인과 화폐에 대한 내용 <http://monthly-jiandson.tistory.com/9>  
    - [컬럼] ICO(Initial Coin Offering)의 이해와 프라이빗 블록체인(Private Blockchain): 퍼블릭과 프라이빗 선택 가이드 라인(요즘에는 Permissionless vs Permissioned 라는 용어를 사용). <http://monthly-jiandson.tistory.com/13>
    - 에어드랍, 하드포크 vs 소프트포크, 하드웨어왈렛 (DeveloperWorks에 추가예정)
- 지갑생성 및 이더리움 전송
    - 메타마스크(Metamask) 사용법 01 <https://steemit.com/kr/@twinbraid/metamask-01>  
    - 메타마스크(Metamask) 사용법 02 <https://steemit.com/kr/@twinbraid/metamask-02>  
    - 메타마스크(Metamask) 사용법 03 <https://steemit.com/kr/@twinbraid/metamask-03>  

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
- `approve` + `transferFrom` 메카니즘을 사용하거나 ERC20을 사용하지 않는 것을 권고. 

#### 하이퍼레저 프로그래밍 (Hello Hyperledger!)
![](media/15282706026711.png)

- IBM Cloud를 활용한 하이퍼레저 프로그래밍 시작하기 (작성중)
- Hyperledger Composer 사용하기 (작성중) 

#### Disclaimer
본 레파지토리는 개인의 자격으로 운영되며 IBM과 관련이 없습니다. 몇몇의 블록체인 프로젝트들과 학습자료를 모아두었습니다. This repository is consist of several experimental blockchain project and learning materials. (Not related to IBM. It's personal repository)  


