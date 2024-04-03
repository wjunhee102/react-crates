export function setDisableBodyScroll() {
  let overflow = "";
  let height = "";
  let width = "";

  if (document && document.body) {
    overflow = document.body.style.overflow;
    height = document.body.style.height;
    width = document.body.style.width;
  }

  return (scrollLock: boolean) => {
    if (!document || !document.body) {
      return;
    }

    if (scrollLock) {
      overflow = document.body.style.overflow;
      height = document.body.style.height;
      width = document.body.style.width;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.width = "100vw";
    } else {
      document.body.style.overflow = overflow;
      document.body.style.height = height;
      document.body.style.width = width;
    }
  }
}
