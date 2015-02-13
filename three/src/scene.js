var displayScene=function(){	
	var data=utils.mockData(30);
	
	var container, containerWidth, containerHeight;
	var camera, scene, renderer, group, particle, particleLight, axes, geom, cubes, projector, mouseVector;
	var range=5000;
	var mouseX = 0, mouseY = 0;

		// Picking stuff
	
	projector = new THREE.Projector();
	mouseVector = new THREE.Vector3();
	
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	
	init(data);
	animate();
	

	function init(data) {
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		
		containerWidth = container.clientWidth;
		containerHeight = container.clientHeight;
		

		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.z = -1000;
		camera.position.y = 0;
		camera.position.x = 4000;
		
		
		controls = new THREE.OrbitControls( camera );
		controls.addEventListener( 'change', render );
		
		scene = new THREE.Scene();

		//the execution
		particleLight = new THREE.Mesh( new THREE.SphereGeometry( 0, 0, 0 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
		scene.add( particleLight );
		var pointLight = new THREE.PointLight( 0xffffff, 2 );
		particleLight.add( pointLight );
		
		//the dataLine
		var geometry = new THREE.CylinderGeometry( 5, 5, 3000, 3 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		var dataLine = new THREE.Mesh( geometry, material );
		dataLine.rotation.x+=Math.PI/2;
		scene.add( dataLine );


		//deck
		var geometry = new THREE.BoxGeometry( 1000, 10, 1000 );
		var material = new THREE.MeshLambertMaterial(/*{wireframe:true} */);
		var deck = new THREE.Mesh( geometry, material );
		deck.translateY(-500);
		//scene.add( deck );
	
	
		//loop through the data
		var z=-3000;
		var shape;
		var composit = new THREE.Object3D();
		scene.add( composit );
		for (var i=0;i<data.length;i++){
			z+= i*10;
			var shape;
			if (data[i].shape==="function"){
				shape = subroutines.fun( {z:z} );
			} else {
				shape = subroutines.loop( {z:z} );
			}
			
			composit.add( shape );
			//scene.add( shape );
		}
	
		//csg experiment
		/*
		var cube_geometry = new THREE.CubeGeometry( 30, 30, 300 );
		var cube_mesh = new THREE.Mesh( cube_geometry );
		//cube_mesh.position.x = -7;
		var cube_bsp = new ThreeBSP( cube_mesh );
		var sphere_geometry = new THREE.SphereGeometry( 50, 32, 32 );
		var sphere_mesh = new THREE.Mesh( sphere_geometry );
		sphere_mesh.position.x = -7;
		var sphere_bsp = new ThreeBSP( sphere_mesh );
		
		var subtract_bsp = cube_bsp.subtract( sphere_bsp );
		var result = subtract_bsp.toMesh( new THREE.MeshLambertMaterial({ shading: THREE.SmoothShading}) );
		result.geometry.computeVertexNormals();
		scene.add( result );
		*/
		//end csg experiment
		
		/*
		//raycaster experiment
		
		// Add some cubes to the scene
		geom = new THREE.IcosahedronGeometry( 50 );
	
		cubes = new THREE.Object3D();
		scene.add( cubes );
	
		for(var i = 0; i < 100; i++ ) {
			var grayness = Math.random() * 0.5 + 0.25,
				mat = new THREE.MeshLambertMaterial(),
				cube = new THREE.Mesh( geom, mat );
			mat.color.setRGB( grayness, grayness, grayness );
			cube.position.set( range * (0.5 - Math.random()), range * (0.5 - Math.random()), range * (0.5 - Math.random()) );
			//cube.rotation.set( Math.random(), Math.random(), Math.random() ).multiplyScalar( 2 * Math.PI );
			cube.grayness = grayness;
			cubes.add( cube );
		}
		*/
		
		// User interaction
		window.addEventListener( 'mousemove', onMouseMove, false );
		//end raycaster experiment
		
		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor( 0x333333, 1);
		renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
		container.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
	}
	
	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	

	function onMouseMove( e ) {
		var vector = new THREE.Vector3();
		var raycaster = new THREE.Raycaster();
		var dir = new THREE.Vector3();
		
		//check the type of camera
		if ( camera instanceof THREE.OrthographicCamera ) {
	    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, - 1 ); // z = - 1 important!
	    vector.unproject( camera );
	    dir.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );
	    raycaster.set( vector, dir );
		} else if ( camera instanceof THREE.PerspectiveCamera ) {
	    vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ); // z = 0.5 important!
	    vector.unproject( camera );
	    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		}
		
		var intersects = raycaster.intersectObjects( cubes.children, true );	
		
		//cubes (change this later) is just the collection of shapes to check
		cubes.children.forEach(function( cube ) {
			cube.material.color.setRGB( cube.grayness, cube.grayness, cube.grayness );
		});
		
		//here i'll manipulate the objects intersected by the ray
		for( var i = 0; i < intersects.length; i++ ) {
			var intersection = intersects[ i ];
			var obj = intersection.object;
			obj.material.color.setRGB( 1.0 - i / intersects.length, 0, 0 );
		}

		
	}

	
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	
	
	function render() {
		camera.lookAt(new THREE.Vector3(256,256,256));
		
		if (window.scenePaused===false){
			particleLight.position.z +=100;
			if (particleLight.position.z>10000){
				particleLight.position.z=-3000;
			}
		}
		
		renderer.render( scene, camera );
	}
	
};

window.onload=function(){
	window.scenePaused=false;
	displayScene();
	$("body").on("click","button#pause",function(){
		window.scenePaused=!window.scenePaused;
	});
};