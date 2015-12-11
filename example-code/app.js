import * as h from './helpers';
import $ from 'jquery'; 

/* We would either do the entire library */
import _ from 'lodash';

/* OR cherry pick methods from lodash */
import { throttle } from 'lodash';

import request from 'superagent';

// import some code that isn't a module
import './not-a-module';

// import an exported object
import coolDude from './object-export';

console.log(coolDude);

// import 

// Use imported jQuery
$('p').on('click',function() {
  alert('ya clicked it');
});

// use the imported helper object
console.log(h.formatPrice(5000));

// use imported superagent module
request
.get('https://api.github.com/users/wesbos')
.end(function(err, res){
    console.log(res.body);
});

// try out lodash
var dogs = [
  { 'name': 'snickers', 'age': 2, breed : 'King Charles'},
  { 'name': 'prudence', 'age': 5, breed : 'Poodle'}
];

console.log(_.findWhere(dogs, { 'breed': 'King Charles' }));

// try out cherry picked lodash
$('.click-me').on('click',throttle(function() {
  console.count('ouch!');
}, 1000));

