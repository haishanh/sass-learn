'use strict';

const pug = require('pug');
const fs = require('fs');
const markdown = require('marked');
const hljs = require('highlight.js');
const _ = require('lodash');

const sassIn = 'sass/content.scss';
const sassOut = 'css/content.css';
const htmlOut = 'dist/index.html';
const templateFile = 'src/index.pug';
const OPEN = /\/\*!/g;
const CLOSE = /!\*\//g;
const descPat = /\/\*!\s*\n([\s\S]*?)!\*\//;

// global
var headings = [];
var renderer = new markdown.Renderer();

/**
 * overwrite default heading renderer of `marked`
 */
renderer.heading = (text, level) => {
  let sepIndex = text.indexOf('|');
  let content;
  let colBreak = false;
  let id;
  if (sepIndex > 0) {
    content = text.substring(0, sepIndex).trim();
    id = text.substring(sepIndex+1).trim();
  } else {
    content = text;
    id = text;
  }
  if (id == "at-rules and directives") {
    colBreak = true;
  }

  let escapedText = id.toLowerCase().replace(/[^\w]+/g, '-');

  headings.push({
    level,
    colBreak,
    text: '<a name="' + escapedText +
          '" href="#' + escapedText + '">' +
          content + '</a>'
  });

  return '<h' + level + ' id="' +
          escapedText + '"' + '><a name="' +
          escapedText +
          '" class="anchor" href="#' +
          escapedText +
          '">#</a>' +
          content + '</h' + level + '>';
};

markdown.setOptions({
  renderer,
  highlight: (code) => hljs.highlightAuto(code).value
});

/**
 * parsing headings to ul > li tree
 *
 * @param headings {Array}
 * @param n {Number} the largest level of headings want to keep
 * @return {String} html string of ul > li tree
 */
function genToc(headings, n) {
  n = n || 3;
  let pre = 1;
  let topLevel = 2;
  let closeTags = [];
  let out = '';
  let hl = _(headings);
  hl
    .filter((h) => {
      return h.level <= n;
    })
    .map((h) => {
      let dif = h.level - pre;
      pre = h.level;
      if (h.level === topLevel) {
        closeTags.forEach((tag) => {
         out += tag;
        });
        out += '<ul class="top-level"><li>';
        closeTags.push('</li></ul>');
      } else if (dif > 0) {
        for(let i = 0; i < dif; i++) {
          out += '<ul><li>';
          closeTags.push('</li></ul>');
        }
      } else if (dif < 0) {
        dif = - dif;
        for(let i = 0; i < dif; i++) {
          out += closeTags.pop();
        }
        out += '</li><li>';
      } else {
        out += '</li><li>';
      }

      out += h.text;
    })
    .value();

  /* in case there is none closed tag */
  closeTags.forEach((tag) => {
    out += tag;
  });

  return out;
}

// function parsePoints(data, opt, start) {
//
//   let open = opt.open;
//   let close = opt.close;
//   let openPoint = null, closePoint = null;
//
//   let cap = null;
//
//   cap = open.exec(data.substring(start));
//   if (cap) {
//     openPoint = cap.index;
//
//     cap = close.exec(data.substring(cap.index + cap[0].length));
//     if (cap) {
//       closePoint = cap.index + cap[0].length;
//       console.log(cap);
//       return [openPoint, closePoint];
//     }
//   }
//   return null;
// }

function parse2(data, pat) {
  let cap;
  let ret = [];
  while (cap = pat.exec(data)) {
    ret.push(cap.index);
  }

  return ret;
}

/**
 * Parse file to `description` array and `code block` array
 */
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
}

/**
 * construct the data needed before rendering template
 */
function populateData() {
  let data = [];
  let parsedBefore = parseFile(sassIn);
  let parsedAfter = parseFile(sassOut);

  for(let i = 0; i < parsedBefore.descArr.length; i++) {
    let one = {};
    let left = parsedBefore.codeArr[i].trim();
    let right = parsedAfter.codeArr[i].trim();
    one.description = markdown(parsedBefore.descArr[i]);
    one.left = hljs.highlight('scss', left).value;
    one.right = hljs.highlight('css', right).value;

    data.push(one);
  }

  // let breakPoint = 0;
  // for (breakPoint = 0; breakPoint < headings.length; breakPoint++) {
  //   if(headings[breakPoint].colBreak) break;
  // }

  // let toc = {
  //   left: genToc(headings.slice(0, breakPoint), 5),
  //   right: genToc(headings.slice(breakPoint), 5),
  // };
  // console.log(breakPoint);
  return {
    contents: data,
    toc: genToc(headings, 5)
  };
}

const data = populateData();

data.pretty = true;

const ret = pug.renderFile(templateFile, data);
fs.writeFileSync(htmlOut, ret);
