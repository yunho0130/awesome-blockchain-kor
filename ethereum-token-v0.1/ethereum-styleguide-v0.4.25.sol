// 들여쓰기에 4 스페이스 
// 소스 파일 인코딩 UTF-8 혹은 ASCII

// 함수의 순서
// constructor => (구현하였다면)fallback function => external => public => internal => private
// 각 함수 그룹 안에서 View와 Pure함수는 마지막에 위치시킨다. 

contract A {
    function A() public {
        ...
    }

    function() public {
        ...
    }

    // External functions
    // ...

    // External functions that are view
    // ...

    // External functions that are pure
    // ...

    // Public functions
    // ...

    // Internal functions
    // ...

    // Private functions
    // ...
}

// 함수선언
// 접근 제어자(Public, Private 등)는 명시적으로 적어야 합니다. 
// 특히 프로그래머가 별도로 작성한 키워드Custom Keyword보다 앞에 와야 합니다. 
function increment(uint x) public pure returns (uint) {
    return x + 1;
}

function kill() public onlyowner { //여기에서 onlyowner가 public 보다 앞에 오지 않게 합니다. 
    selfdestruct(owner);
}


// Import 문은 파일 최상단에 명시할 것 
import "owned";


contract A {
    ...
}


contract B is owned {
    ...
}



// 컨트랙트간 빈줄 1개 삽입 권장
contract A {
    ...
}


contract B {
    ...
}

// 다음의 경우는 코드 한 줄이 너무 길어질 경우, 파라미터 등을 어떻게 처리해야 하는지에 대한 대표적인 예시들입니다. 
// 긴 함수의 호출 
thisFunctionCallIsReallyLong(
    longArgument1,
    longArgument2,
    longArgument3
);

// 값 할당시 코드가 길어질 경우 
thisIsALongNestedMapping[being][set][to_some_value] = someFunction(
    argument1,
    argument2,
    argument3,
    argument4
);

// 이벤트의 호출과 구현 
event LongAndLotsOfArgs(
    adress sender,
    adress recipient,
    uint256 publicKey,
    uint256 amount,
    bytes32[] options
);

LongAndLotsOfArgs(
    sender,
    recipient,
    publicKey,
    amount,
    options
);


// 한 줄 안에서의 공백 처리 예시 1
spam(ham[1], Coin({name: "ham"}));
// 한 줄 안에서의 공백 처리 예시 2
function singleLine() public { spam(); }

// fallback 함수 안에서 공백은 넣지 말 것. 아래와 같이 작성
function() public {
    ...
}

// 중괄호 사용 
contract Coin {
    struct Bank {
        address owner;
        uint balance;
    }
}

// 중괄호 사용2: if, else, while, for 
if (...) {
    ...
}

for (...) {
    ...
}

// 변수 선언시 타입과 괄호 사이에 공백을 두지 않음
uint[] x; // Yes
uint [] x; // No

// 문자열은 작은 따옴표보단 큰 따옴표 사용
str = "Hamlet says, 'To be or not to be...'";

// 네이밍 규칙
// 한 글자 변수는 사용하지 말 것

//  CapWords(파스칼) 스타일

// 컨트랙트Contracts와 라이브러리libraries
Examples: SimpleToken, SmartBank, CertificateHashRepository, Player
// 구조체Struct 이름
Examples: MyCoin, Position, PositionXY
// 이벤트Event 이름
Examples: Deposit, Transfer, Approval, BeforeTransfer, AfterTransfer.

// mixedCase(카멜) 스타일

// 함수 이름(생성자 제외)
Examples: getBalance, transfer, verifyOwner, addMember, changeOwner. 
// 함수 인자 이름. 단 커스텀 구조체의 첫번째 인자는 self
Examples: initialSupply, account, recipientAddress, senderAddress, newOwner.
// 지역변수와 상태변수 이름 Local and State Variable Names
Examples: totalSupply, remainingSupply, balancesOf, creatorAddress, isPreSale, tokenExchangeRate.
// 상수 Constants
Examples: MAX_BLOCKS, TOKEN_NAME, TOKEN_TICKER, CONTRACT_VERSION.
// 제어자 Modifier 
Examples: onlyBy, onlyAfter, onlyDuringThePreSale.
// 열거 타입 Enums
Examples: TokenGroup, Frame, HashStyle, CharacterLocation.

// 충돌 방지 Avoiding Naming Collisions
// 시스템 예약어와 충돌을 방지하기 위해 변수 이름뒤에 Underscore(_)를 사용할 수 있습니다. 
single_trailing_underscore_