'use strict';

const ejs = require('ejs');
const fs = require('fs');


const templateFile = 'src/template.html';
const template = fs.readFileSync(templateFile, 'utf-8');
const START = /\/\*!/;
const END = /!\*\//;
const descPat = /\/\*!([.\n]*)!\*\//;

function parsePoints(data, opt) {

  let open = opt.open;
  let close = opt.close;
  let start = opt.start || 0;
  let openPoint = null, closePoint = null;

  let cap = null;

  cap = open.exec(data.substring(start));
  if (cap) {
    openPoint = cap.index;

    cap = close.exec(data.substring(cap.index + cap[0].length));
    if (cap) {
      closePoint = cap.index + cap[0].length;
    }
  }
}

function parseTo(file) {
  let cont = fs.readFileSync(file, 'utf-8');
  console.log(cont);
  let code = [];
  let desc = [];

  let cap;

  let pre = 0, cur = 0;
  while(cap = descPat.exec(cont.substring(pre))) {
    console.log(cap);

    code.push(cap[1]);

    cur = cap.index;

    if(pre != cur) {
      desc.push(cont.substring(pre, cur))
    }

    pre = cap.index + cap[0].length;
  }

  return {
    code,
    desc
  };
}

var ret = parseTo('sass/test.scss');
console.log(ret);


// hardcode
var content = {
  description: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat perferendis, laborum non cupiditate vero dolores impedit labore, voluptate atque iusto asperiores, vel necessitatibus rerum natus earum mollitia. Accusantium libero, ad.</p>'
  ,
  left: '<p>hello</p>',
  right: '<p>world<p>'
};

const data = {
  contents: [content, content]
}


var ret = ejs.render(template, data);
