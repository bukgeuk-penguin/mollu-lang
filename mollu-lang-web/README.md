## 몰?랭 웹 구현체
### 설치
```
$ npm i mollu-lang-web
```

### 예제
코드를 실행시킨 후 콘솔에 띄우기
```ts
import * as mollu from 'mollu-lang-web'

mollu.setEventListener((text: string) => console.log(text))
mollu.execute('몰!루 모올루??모올루')
```