'use strict';

const ejs = require('ejs');
const fs = require('fs');
const markdown = require('marked');
const hljs = require('highlight.js');


const templateFile = 'src/template.html';
const template = fs.readFileSync(templateFile, 'utf-8');
const OPEN = /\/\*!/g;
const CLOSE = /!\*\//g;
const descPat = /\/\*!\s*\n([\s\S]*?)!\*\//;

var renderer = new markdown.Renderer();

renderer.heading = (text, level) => {
  let escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return '<h' + level + '><a name="' +
          escapedText +
          '" class="anchor" href="#' +
          escapedText +
          '">#</a>' +
          text + '</h' + level + '>';
};

markdown.setOptions({
  renderer,
  highlight: (code) => hljs.highlightAuto(code).value
});

function parsePoints(data, opt, start) {

  let open = opt.open;
  let close = opt.close;
  let openPoint = null, closePoint = null;

  let cap = null;

  cap = open.exec(data.substring(start));
  if (cap) {
    openPoint = cap.index;

    cap = close.exec(data.substring(cap.index + cap[0].length));
    if (cap) {
      closePoint = cap.index + cap[0].length;
      console.log(cap);
      return [openPoint, closePoint];
    }
  }
  return null;
}

function parse2(data, pat) {
  let cap;
  let ret = [];
  while (cap = pat.exec(data)) {
    ret.push(cap.index);
  }

  return ret;
}

function parseFile(file) {
  let cont = fs.readFileSync(file, 'utf-8');
  //console.log(cont);

  let tagLen = 3; // hardcode
  let openPoints = parse2(cont, OPEN);
  let closePoints = parse2(cont, CLOSE);


  if (openPoints.length != closePoints.length) {
    console.log('Open and Close tag number not matching');
    process.exit(1);
  }

  let descArr = [], codeArr = [];
  for (let i = 0; i < openPoints.length; i++) {
    let start = openPoints[i] + tagLen;
    let end = closePoints[i];
    descArr.push(cont.substring(start, end));

    start = closePoints[i] + tagLen;
    end = openPoints[i+1] || cont.length;
    codeArr.push(cont.substring(start, end));
  }

  return {
    descArr,
    codeArr
  };

/*
  let pointPair;
  let opt = {
    open: OPEN,
    close: CLOSE
  };
  let start = 0;
  let ret = [];
  while(pointPair = parsePoints(cont, opt, start)) {
    ret.push(pointPair[0]);
    ret.push(pointPair[1]);
    // console.log(pointPair);
    start = pointPair[1];
  }


  return ret;
*/
}

// var ret = parseFile('test.txt');
// var ret = parseFile('sass/test.scss');

function populateData() {
  let data = [];
  let parsedBefore = parseFile('sass/test.scss');
  let parsedAfter = parseFile('css/test.css');

  for(let i = 0; i < parsedBefore.descArr.length; i++) {
    let one = {};
    let left = parsedBefore.codeArr[i];
    let right = parsedAfter.codeArr[i];
    console.log(left.length, right.length);
    one.description = markdown(parsedBefore.descArr[i]);
    one.left = '<pre><code>' + hljs.highlight('scss', left).value + '</code></pre>';
    one.right = '<pre><code>' + hljs.highlight('css', right).value + '</code></pre>';

    data.push(one);
  }
  return {
    contents: data
  };
}

// hardcode
var content = {
  description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat perferendis, laborum non cupiditate vero dolores impedit labore, voluptate atque iusto asperiores, vel necessitatibus rerum natus earum mollitia. Accusantium libero, ad.</p>'
  ,
  left: '<p>hello</p>',
  right: '<p>world<p>'
};

const data = populateData();


var ret = ejs.render(template, data);
fs.writeFileSync('src/index.html', ret);
