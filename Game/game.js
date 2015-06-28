function game () {
	var THREEx	= THREEx || {};
	THREEx.FullScreen	= THREEx.FullScreen	|| {};
	THREEx.FullScreen._hasWebkitFullScreen	= 'webkitCancelFullScreen' in document	? true : false;	
	THREEx.FullScreen._hasMozFullScreen	= 'mozCancelFullScreen' in document	? true : false;

	var camera, scene, renderer;
	var geometry, material, mesh;
	var controls;

	var type = Math.floor(Math.random() * 2) + 1;  // tipo di sfondo, e colori

	//bandiera
	var geometry = new THREE.BoxGeometry( 10, 150, 10 );
	if(type != 1)
		var material = new THREE.MeshBasicMaterial( { color: 'white' } );
	else
		var material = new THREE.MeshBasicMaterial( { color: 'black' } );
	var flag = new THREE.Mesh( geometry, material );
	geometry = new THREE.BoxGeometry(60,3,20);
	material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
	var flag2 = new THREE.Mesh( geometry, material );
	//
 
	var timeForScore = 45, life = 3, dead = false;

	var changeWidth = 120;
	var changeHeight = 40;

	var powerJump = 130;

	var objects = [];

	var speed = 3;

	var raycaster;

	blockerScreen();

	setInterval(function(){  
	  if(timeForScore > 0){
	  	timeForScore--;
	  }
	},1000);

	init();

	animate();

	var controlsEnabled = false;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var prevTime = performance.now();
	var velocity = new THREE.Vector3();

	var xx = 0, yy = 10, zz = 0; //  coordinate prossimo checkpoint
	var xxSpown, yySpown , zzSpown; //ora coordinate iniziali poi checkpoint

	var nPlatform = 10;

	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );

		scene = new THREE.Scene();
		//scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		controls = new THREE.PointerLockControls( camera );
		scene.add( controls.getObject() );
		
		if(type != 1) document.getElementById("body").style.color = 'white';
		var percorso = '../three.js/examples/textures/cube/skybox/';   //skybox
			scene.add( makeSkybox( [
					(type == 1) ? percorso +'px.jpg' : percorso +'sky_pos_x.jpg' , // right
					(type == 1) ? percorso +'nx.jpg' : percorso +'sky_neg_x.jpg', // left
					(type == 1) ? percorso +'py.jpg' : percorso +'sky_pos_y.jpg', // top
					(type == 1) ? percorso +'ny.jpg' : percorso +'sky_neg_y.jpg', // bottom
					(type == 1) ? percorso +'pz.jpg' : percorso +'sky_neg_z.jpg', // back
					(type == 1) ? percorso +'nz.jpg' : percorso +'sky_pos_z.jpg'  // front
				], 100000 ));

		var onKeyDown = function ( event ) {

			switch ( event.keyCode ) {

				case 38: // up
				case 87: // w
					moveForward = true;
					break;

				case 37: // left
				case 65: // a
					moveLeft = true; break;

				case 40: // down
				case 83: // s
					moveBackward = true;
					break;

				case 39: // right
				case 68: // d
					moveRight = true;
					break;

				case 84: //turbo letter t

					if(speed){
						velocity.z -= 5000;
						speed--;
						document.getElementById("speed").innerHTML = speed;
					}				
					break;
				case 70:
					if(THREEx.FullScreen.available()){
						THREEx.FullScreen.activated();
						THREEx.FullScreen.request();
					}
					break;

				case 32: // space
					if ( canJump === true ) velocity.y += powerJump;
					canJump = false;
					break;

			}

		};

		var onKeyUp = function ( event ) {

			switch( event.keyCode ) {

				case 38: // up
				case 87: // w
					moveForward = false;
					break;

				case 37: // left
				case 65: // a
					moveLeft = false;
					break;

				case 40: // down
				case 83: // s
					moveBackward = false;
					break;

				case 39: // right
				case 68: // d
					moveRight = false;
					break;

			}

		};

		document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );

		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		// object

		var geometry = new THREE.BoxGeometry( 200, 200, 200 );
				
		var texture    = THREE.ImageUtils.loadTexture( '../three.js/examples/textures/crate.gif' );
		texture.anisotropy = renderer.getMaxAnisotropy();

		var material = new THREE.MeshBasicMaterial( { map: texture } );

		var start = new THREE.Mesh( geometry, material );
		start.position.set(0,-110,0);
		scene.add( start );
		objects.push( start );

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function generate(n_platform, varianceWidth, variaceHeight){
		if(n_platform != 10){
			timeForScore += 45;
			document.getElementById("text8").style.display = 'block'; 
			setTimeout(function(){ document.getElementById("text8").style.display = 'none';  },2000);
		}
		xxSpown = xx;
		yySpown = n_platform == 10 ? yy : yy+40;
		velocity.y = 0;
		zzSpown = zz; // cambio punto spown
		powerJump += 20;		
		document.getElementById( 'power' ).innerHTML = powerJump;
		for (var i = 0; i < n_platform; i++) {
			var geometry = new THREE.BoxGeometry( Math.floor((Math.random() * 300) + 10), 20, Math.floor((Math.random() * 300) + 10) );
				
			var texture    = THREE.ImageUtils.loadTexture( '../three.js/examples/textures/crate.gif' );
			texture.anisotropy = renderer.getMaxAnisotropy();

			
			var material = new THREE.MeshBasicMaterial( { map: texture } );
		

			var platform = new THREE.Mesh( geometry, material );

			xx += Math.floor((Math.random() * 2) + 1) == 1 ? Math.floor((Math.random() * varianceWidth) + 100) : -Math.floor((Math.random() * varianceWidth) + 100);
			yy += i < 10 ? Math.floor((Math.random() * variaceHeight) + 20) : Math.floor((Math.random() * 2) + 1) == 1 ? Math.floor((Math.random() * variaceHeight) + 20) :
			-Math.floor((Math.random() * variaceHeight) + 1);
			zz += Math.floor((Math.random() * 2) + 1) == 1 ? Math.floor((Math.random() * varianceWidth) + 100) : -Math.floor((Math.random() * varianceWidth) + 100);
			platform.position.set( xx , yy , zz);
			//if( i % 10 == 0) animate2(platform,0.2,0);
			//if ( i % 11 == 0) animate3(platform,0,1);
			scene.add( platform );
			objects.push( platform );
		};
		//bandiera finale vittoria
		flag.position.set(xx,yy+80,zz);
		flag2.position.set(xx+30,yy+130,zz);
		flag2.rotation.x = 90 * Math.PI /180;
		if(n_platform == 10){
			scene.add( flag );
			scene.add( flag2 );
		}
	}

	function animate2(cube,angularSpeed,lastTime){
		var time = (new Date()).getTime();
		var timeDiff = time - lastTime;
		var angularChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
		cube.rotation.y += angularChange;
		lastTime = time;
		renderer.render(scene, camera);
		requestAnimationFrame(function(){
			animate2(cube,angularSpeed,lastTime);
		})
	}

	function animate3(cube,count,flag){
		count += flag == 1 ? 1 : -1;
		cube.position.x += flag == 1 ? 1 : -1;
		flag = count == 100 ? 0 : count == -100 ? 1 : flag;
		renderer.render(scene, camera);
		requestAnimationFrame(function(){
			animate3(cube,count,flag);
		})
	}

	function animate() {

		requestAnimationFrame( animate );

		if ( controlsEnabled && !dead) {
			raycaster.ray.origin.copy( controls.getObject().position );
			raycaster.ray.origin.y -= 10;

			var intersections = raycaster.intersectObjects( objects );

			var isOnObject = intersections.length > 0;

			var time = performance.now();
			var delta = ( time - prevTime ) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			
			velocity.y -= 3 * 100.0 * delta; // 100.0 = mass

			if ( moveForward ) velocity.z -= 1200.0 * delta;
			if ( moveBackward ) velocity.z += 800.0 * delta;

			if ( moveLeft ) velocity.x -= 1200.0 * delta;
			if ( moveRight ) velocity.x += 800.0 * delta;

			if (isOnObject === true ) {
				velocity.y = Math.max( 0, velocity.y );

				canJump = true;
			}

			controls.getObject().translateX( velocity.x * delta );
			controls.getObject().translateY( velocity.y * delta );
			controls.getObject().translateZ( velocity.z * delta );

			if ( controls.getObject().position.y < -1000 ) {
				speed = 3;
				document.getElementById("speed").innerHTML = 3;
				//document.getElementById("time").innerHTML = (nPlatform/5-2) * 45;
				life--;
				if(life < 0){
					life = 0;
					dead = true;
				}
				document.getElementById("life").innerHTML = life;
				timeForScore = (nPlatform/5-2) * 45;

				controls.getObject().position.set(xxSpown,yySpown,zzSpown);
				if(nPlatform != 15) velocity.y += 1000;
			}

			if(controls.getObject().position.y < yy+100 && controls.getObject().position.y > yy-100){
				if(controls.getObject().position.x < xx+100 && controls.getObject().position.x > xx-100){
					if(controls.getObject().position.z < zz+100 && controls.getObject().position.z > zz-100){
						if(((nPlatform/5-2) * 45 - timeForScore + (nPlatform/5-2)) >= 0){
							var point = parseInt(document.getElementById("point").innerHTML) + (timeForScore + (nPlatform/5-2)) + (life*2);
							document.getElementById("point").innerHTML = point;
						}
						generate(nPlatform, changeWidth, changeHeight);  // genera nuovo livello appena arrivi alla bandiera
						changeHeight+= 10;
						changeWidth += 20;
						nPlatform += 5;
					}
				}
			}

			prevTime = time;

		}else if(dead){
			document.getElementById( 'blocker' ).style.display = 'block';
			document.getElementById( 'text3' ).innerHTML = 'You are dead !';
			document.getElementById( 'text4' ).innerHTML = 'Press f5 for new game';
			var pt = parseInt(document.getElementById("point").innerHTML);
			var rc = parseInt(document.getElementById("Wrecord").innerHTML);
			if(pt > rc) window.location.href = 'newRecord.php?record='+pt;
		}

		renderer.render( scene, camera );

	}

	function makeSkybox( urls, size ) {
		var skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );
		skyboxCubemap.format = THREE.RGBFormat;

		var skyboxShader = THREE.ShaderLib['cube'];
		skyboxShader.uniforms['tCube'].value = skyboxCubemap;

		return new THREE.Mesh(
			new THREE.BoxGeometry( size, size, size ),
			new THREE.ShaderMaterial({
				fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
				uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
			})
		);
	};

	function blockerScreen(){
		var blocker = document.getElementById( 'blocker' );
		var instructions = document.getElementById( 'instructions' );

		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if ( havePointerLock ) {

			var element = document.body;

			var pointerlockchange = function ( event ) {

				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

					controlsEnabled = true;
					controls.enabled = true;

					blocker.style.display = 'none';

				} else {

					controls.enabled = false;

					blocker.style.display = '-webkit-box';
					blocker.style.display = '-moz-box';
					blocker.style.display = 'box';

					instructions.style.display = '';

				}

			}

			var pointerlockerror = function ( event ) {

				instructions.style.display = '';

			}

			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', pointerlockchange, false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

			instructions.addEventListener( 'click', function ( event ) {

				instructions.style.display = 'none';

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							element.requestPointerLock();
						}

					}

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

				} else {

					element.requestPointerLock();

				}
			}, false );

		} else {

			instructions.innerHTML = 'Il tuo browser non supporta questa API';
		}
	}
	
	THREEx.FullScreen.available	= function()
	{
		return this._hasWebkitFullScreen || this._hasMozFullScreen;
	}

	THREEx.FullScreen.activated	= function()
	{
		if( this._hasWebkitFullScreen ){
			return document.webkitIsFullScreen;
		}else if( this._hasMozFullScreen ){
			return document.mozFullScreen;
		}else{
			console.assert(false);
		}
	}

	THREEx.FullScreen.request	= function(element)
	{
		element	= element	|| document.body;
		if( this._hasWebkitFullScreen ){
			element.webkitRequestFullScreen();
		}else if( this._hasMozFullScreen ){
			element.mozRequestFullScreen();
		}else{
			console.assert(false);
		}
	}
}