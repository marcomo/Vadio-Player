window.onload = function() {
  var i = 0;
  var fontsLoading = false;

  function checkFontsLoading() {
    var htmlClasses = document.querySelector('html').classList;
    console.log(htmlClasses);
    fontsLoading = htmlClasses.contains('wf-loading');
  }

  function revealPage() {
    document.querySelector('body').classList.remove('invisible');
  }

  while (fontsLoading === false) {
    i += 1;
    console.log('fonts loading (', i, '): false');
    checkFontsLoading();
  }
  revealPage();
  console.log("Fonts Loaded.");
  console.log("Fully Loaded.");
}