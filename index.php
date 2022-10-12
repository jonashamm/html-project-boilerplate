<?php $version = file_get_contents('version_nr.txt');?>
<?php include('src/markup/head.php'); ?>
<header>
	<div class="inner">
		Header
	</div>
</header>
<main>
	<div class="inner">
		<h1>Test Content</h1>
		<p>This is only test content.</p>
	</div>
</main>
<footer>
	<div class="inner">
		Footer
	</div>
</footer>
<?php include('src/markup/foot.php'); ?>
