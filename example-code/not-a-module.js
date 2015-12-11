console.log("This runs on page load..");

var woof = document.querySelector('.dog');

woof.addEventListener('click',function(){
  console.log("Woof!");
});
