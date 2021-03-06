# 몰?랭 v1.2

이 프로젝트는 [rycont/umjunsik-lang](https://github.com/rycont/umjunsik-lang)에 영감을 받아 제작되었습니다.  

![IMG_1831](https://user-images.githubusercontent.com/41170492/153138216-0a212ade-dcbc-4cb0-81f7-76870fe3b5f4.gif)

* [웹으로 몰?랭을 사용해보세요!](https://mollu.gangjun.dev/playground)
* [vscode에서 몰?랭을 사용해보세요!](https://marketplace.visualstudio.com/items?itemName=bukgeuk-penguin.mollu-lang-vsc-extension)

-------------------------

# 구현체
|구현체|언어 버전|구현체 버전|
|:---:|:---:|:---:|
|[C++](https://github.com/bukgeuk-penguin/mollu-lang/tree/master/mollu-lang-cpp)|v1.2|v1.2.0|
|[WEB](https://github.com/bukgeuk-penguin/mollu-lang/tree/master/mollu-lang-web)([npm](https://www.npmjs.com/package/mollu-lang-web))|v1.2|v1.2.3|
<detail>
<details markdown="1">
<summary>구현체 버전 규칙</summary>

1. major와 minor 버전은 언어 버전을 따라야 합니다
2. patch 버전은 자유롭게 작성 가능합니다.

</details>
</detail>

-----------------------------

# 문법
## 자료형
몰?랭에는 4가지 상수값이 있습니다
* 몰루 : **`1`**
* 아루 : **`-1`**
* 모올루 : **`10`**
* 아아루 : **`-10`**

## 연산자
사칙연산의 우선순위가 적용되지 않고 왼쪽부터 차례대로 계산됩니다
* 덧셈 : **`?`**
* 곱셈 : **`??`**
* 뺄셈 : **`!`**
* 나눗셈 **`!!`**
```
모올루??아아루 => -100  
몰루?몰루!아루 => 3  
```
## 변수
변수는 인덱싱을 통해 접근할 수 있으며, 변수의 기본값은 0입니다.
### 대입(아!루)
`우`의 개수번째 변수에 키워드 뒤에 오는 값을 대입합니다.
```
아!루 몰루 => 0번째 변수에 1 대입
아!루우 모올루 => 1번째 변수에 10 대입
아!루우우 모올루??아루 => 2번째 변수에 -10 대입
```
### 사용(루)
`우`의 개수번째 변수의 값을 불러옵니다.
```
루 => 0번째 변수
루우 => 1번째 변수
루우우 => 2번째 변수
```
## 라벨
### 정의(왜몰?루)
현재 위치를 `우`의 개수번째 라벨로 정의합니다.
```
왜몰?루 => 0번째 라벨 정의
왜몰?루우 => 1번째 라벨 정의
```
### 사용(왜아!루)
`우`의 개수번째 라벨을 불러옵니다.
라벨이 정의되어 있지 않으면 오류가 발생합니다.
```
왜아!루 => 0번째 라벨
왜아!루우 => 1번째 라벨
```
## 점프
### 값 == 0
**`몰?루 (값) (라벨)`**  
값이 0일때 라벨로 이동합니다.
### 값 < 0
**`모올?루 (값) (라벨)`**  
값이 0보다 작을 때 라벨로 이동합니다.
### 값 > 0
**`모오올?루 (값) (라벨)`**  
값이 0보다 클 때 라벨로 이동합니다.
```
왜몰?루 => 0번째 라벨 정의
몰?루 몰루?아루 왜아!루 => 1+(-1)이 0이면 0번째 라벨로 이동
아!루 모올루 => 0번째 변수에 10 대입
모오올?루 루 왜아!루 => 0번째 변수의 값이 0보다 크면 0번째 라벨로 이동
```
## 출력
### 정수로 출력(몰!루)
키워드 뒤에 있는 값을 정수로 출력합니다.
### 문자로 출력(모올!루)
키워드 뒤에 있는 값을 문자로 출력합니다.
```
몰!루 모올루 => 10 출력
모올!루 모올루??모올루 => d 출력
```
## 입력
키워드 자체가 값으로 취급됩니다.
### 정수 입력받기(아?루)
정수를 입력받습니다.
### 문자 입력받기(아아?루)
문자를 입력받습니다.  
여러글자가 입력 됐을 경우,  
맨앞 문자를 불러오며 다음에 문자 입력을 받을 때 그 다음 문자가 불러와집니다.
```
몰!루 아?루 => 입력받은 정수를 출력
모올!루 아아?루 => 입력받은 문자를 출력

모올!루 아아?루 모올!루 아아?루 모올!루 아아?루 => 만약 한번에 abc를 입력받았다면, abc를 출력함
```
## 주석
### 라인 주석(//, =>)
주석의 시작부터 줄바꿈이 될때까지 무시합니다.
### 블록 주석(/* */, <-- -->)
주석의 시작부터 끝까지 무시합니다.
```
// 라인 주석 #1
=> 라인 주석 #2
/* 블록 주석 #1*/
<--블록 주석 #2-->
```
## 기타
* 확장자는 **`.mol`** 입니다. (6.02\*10^23 아님 ㅡㅡ)
* 공백, 줄바꿈이 없어도 작동합니다.
-------------------------------
# Release Notes
### v1.2
REPL 추가
### v1.1
주석 문법 추가
### v1.0
첫번째 버전