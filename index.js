'use strict';

const ejs = require('ejs');
const fs = require('fs');


const templateFile = 'src/template.html';
const template = fs.readFileSync(templateFile, 'utf-8');
const descPat = /\/\*!([.\n]*)!\*\//;


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
