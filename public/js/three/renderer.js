// renderer.js



var makeRenderer = function() {

  // current code:
  // var renderer = new THREE.CanvasRenderer();

  // http://codepen.io/nireno/pen/cAoGI?editors=001
  var renderer = new THREE.WebGLRenderer();    
      // ( { antialias: true } );

  renderer.setClearColor( 0x333333, 1);
  renderer.setSize( window.innerWidth - 20, window.innerHeight - 20 );


  return renderer;
};