document.addEventListener('DOMContentLoaded', function () {
  var $ = document.querySelector.bind(document);
  var tocbtn = $('.tocbtn');
  var toc = $('.toc');

  // tocbtn.addEventListener('click', function (ev) {
  //   ev.preventDefault();
  //   console.log('tocbtn clicked');
  //   toc.classList.toggle('show');
  // });

  document.body.addEventListener('mouseup', function (ev) {
    console.log('body clicked');
    console.log('real tag:' + ev.target.tagName + ' clicked!');
    if (ev.target === tocbtn) {
      console.log('TOC toggle');
      toc.classList.toggle('show')
    } else if (toc.classList.contains('show')) {
      console.log('TOC close')
      toc.classList.remove('show');
    }
  });
});