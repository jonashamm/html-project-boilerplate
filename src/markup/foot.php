<script src="dist/all-vendor-scripts.js?version=<?php echo $version;?>"></script>
<script src="dist/custom-babelified.js?version=<?php echo $version;?>"></script>
<script>
	<?php if ($_GET['version'] == 'light') : ?>
		<?php $particles_conf_file = 'particlesjs-config2.json'; ?>
	<?php else: ?>
		<?php $particles_conf_file = 'particlesjs-config.json'; ?>
	<?php endif; ?>
	particlesJS.load('particles-js', 'src/js/<?php echo $particles_conf_file; ?>', function() {
		console.log('callback - particles.js config loaded');
	});
</script>
</body>
</html>
