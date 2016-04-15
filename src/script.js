(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-76464910-2', 'auto');
ga('send', 'pageview');

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