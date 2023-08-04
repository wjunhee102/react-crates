function disableBodyScroll(scrollLock: boolean) {
  if (!document || !document.body) {
    return;
  }

  if (scrollLock) {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
  } else {
    document.body.style.overflow = "";
    document.body.style.height = "";
    document.body.style.width = "";
  }
}

export default disableBodyScroll;
