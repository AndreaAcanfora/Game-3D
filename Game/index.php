<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Game</title>
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body id="body">
		<script src="../three.js/build/three.min.js"></script>
		<script src="../three.js/examples/js/controls/PointerLockControls.js"></script>
		<script type="text/javascript" src="game.js"></script>		
		<div id="text">Points: </div>
		<div id="point">0</div>
		<div id="text2">Life: </div>
		<div id="life">3</div>
		<div id="text4"></div>
		<div id="text5">Power jump: </div>
		<div id="power">150</div>
		<div id="text7">Speed: </div>
		<div id="speed">3</div>
		<div id="text6">World record: </div>
		<div id="text8">Flag conquered !!!</div>
		<div id="Wrecord"><?php echo get_object_vars(json_decode(file_get_contents('record.json')))['Record']; ?></div>
		<div id="blocker">	
			<div id="instructions">
				<span id="text3">Click for start</span>
				<br>
				(W, A, S, D = move, SPACE = jump, MOUSE = rotation screen, F = full screen, T = speed)<br>
			</div>
		</div>
		<script>
			game();
		</script>
	</body>
</html>