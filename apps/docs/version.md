# 2024-05-20

- build 에러가 존재했음.
- build 에러는 [ERROR] Error: Unable to build website for locale kr.
- 이 문제는 사실 kr의 문제가 아니라 modal package가 없는데 import해서 발생한 문제였고 이것을 수정하니까 broken error 문제가 발생했음.
- It looks like some of the broken links we found appear in many pages of your site.
- 이 문제를 해결하니 빌드 성공.
- 그런데 github-page 에러가 발생함.

# 2024-05-27

- github-actions으로 github-pages를 배포하는데 자꾸 실패한 이유는 "'Branch "dev" is not allowed to deploy to github-pages due to environment protection rules"로 dev 브랜치로 배포할 수 없기 때문이다.
- main 브랜치로 변경하니 해결되었다.
- [!] RollupError: Could not resolve "./commonTypes" from "dist/esm/types/types/index.d.ts" 이 문제는 tsconfig에 lib로 es2017을 추가하지 않아서 제대로 빌드되지 않아서 생긴 문제였음.
