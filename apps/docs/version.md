# 2024-05-20

- build 에러가 존재했음.
- build 에러는 [ERROR] Error: Unable to build website for locale kr.
- 이 문제는 사실 kr의 문제가 아니라 modal package가 없는데 import해서 발생한 문제였고 이것을 수정하니까 broken error 문제가 발생했음.
- It looks like some of the broken links we found appear in many pages of your site.
- 이 문제를 해결하니 빌드 성공.
- 그런데 github-page 에러가 발생함.
