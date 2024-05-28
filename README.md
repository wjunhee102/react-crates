# @react-crates

이 Repository는 React 애플리케이션의 기능을 향상시키고 확장하는 데 필요한 라이브러리를 포함하고 있습니다.

## Packages

- `modal`: react modal 라이브러리로, 쉽게 모달을 등록하고 사용할 수 있습니다. [이동하기](https://github.com/wjunhee102/react-crates/tree/main/packages/modal)

## 실행 방법

```sh
pnpm install

pnpm build

pnpm watch  // @react-crates를 빌드하고 playground를 실행합니다.
```

## 구성

```
@react-crates
├─ apps
│ └─ ...docsApp
├─ packages
│ └─ ...crates
├─ playgrounds
└─ common
```

### Apps

개발된 라이브러리의 문서화를 담당하는 앱입니다.

### Playgrounds

라이브러리를 실제로 테스트할 수 있는 샘플 애플리케이션입니다.

### Common

- `eslint-config-custom`: 기본 ESLint 설정.
- `tsconfig`: 공통 TypeScript 설정.

## 개발 가이드 라인

### 순서

해당 프로젝트는 개인 계정의로 fork하여 수정 후 pull request를 하는 방식으로 개발합니다.
다음 순서대로 진행해주세요.

1. 해당 repository를 fork 해주세요.
2. fork된 repository를 git clone한 뒤 dev를 기준으로 새로운 branch를 생성하세요. 새로운 branch 이름은 `'이니셜/package-name'`로 지어주세요. 예) `jh/modal`
3. 개발을 시작할 때 dev branch에서 새로운 브랜치를 생성해주세요.
4. 새로 만든 branch에서 개발이 완료되면 push하여 먼저 fork된 자신의 private repositoty dev branch에 pull request 생성 후 'Squash and merge' 방식으로 병합하세요.
5. 병합된 개인 레포지토리에 dev branch를 원본 repository의 dev branch에 병합을 위한 pull request를 생성하고 'Merge' 방식으로 병합해주세요.
6. 병합이 완료되면 개발을 진행했던 branch를 삭제해주세요.

## 커밋 메세지 규칙

### 커밋 메세지 구조

```
[package-name/type] title

body
```

### 커밋 메세지 타입

- feat: 새로운 기능 추가
- remove: 기능 삭제
- change: 기능 수정
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
- refactor: 코드 리팩토링
- test: 테스트 코드
- chore: 빌드 업무 수정, 패키지 매니저 수정
- temp: 임시 저장
