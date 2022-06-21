<?php $version = file_get_contents('dist/version_nr.txt');?>
<?php include('src/markup/head.php'); ?>
<div id="particles-js" class="particles-js"></div>
<header>
	<div class="inner header-inner">
		<div class="logo">
			<a href="">
				<?php echo file_get_contents('src/img/logo-simple.svg'); ?>
			</a>
		</div>
		<nav>
			<a href="">Home</a>
			<a href="">Was sind NTFs?</a>
			<a href="">Wie funktioniert's?</a>
			<a href="">Über uns</a>
			<a href="">Blog</a>
			<a href="">Kontakt</a>
		</nav>
	</div>
</header>
<main>
	<div class="component">
		<div class="inner">
			<h1>Deine Kunst digital <span>weltweit</span> verfügbar</h1>
		</div>
	</div>

	<div class="inner-special component">
		<div class="inner">
			<div class="block">
				<div class="block-inner">
					<div class="image-container full" style="background-image:url('src/img/ash-YfgE8WCcZsQ-unsplash.jpg')">
					</div>
					<div class="text">
						<div class="textblock">
							<div class="icon-block">
								<?php echo file_get_contents('src/img/001-nft.svg'); ?>
							</div>
							<div class="text-inner">
								<h2>Was sind NFTs und wie helfen Sie dir?</h2>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipis
									icing elit. Aliquam architecto aspernatur excepturi fuga tempora. Bl
									anditiis consequatur corporis dicta, distinctio impedit ipsam ipsum, iste perspiciatis provident q
									uam quasi, rerum sapiente voluptatem.
								</p>
							</div>

						</div>
						<br>
						<div class="textblock">
							<div class="icon-block">
								<?php echo file_get_contents('src/img/017-blockchain.svg'); ?>
							</div>
							<div class="text-inner">
								<h2>Was ist die Blockchain und was bedeutet dies für die Kunst?</h2>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipis
									icing elit. Aliquam architecto aspernatur excepturi fuga tempora. Bl
									anditiis consequatur corporis dicta, distinctio impedit ipsam ipsum, iste perspiciatis provident q
									uam quasi, rerum sapiente voluptatem.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>

	<div class="component">
		<div class="inner">
			<div class="steps">
				<?php $steps = [
					['006-artist'],
					['029-digital', 'Schritt 1', 'Digitalisierung Deiner Kunst & Generieren des NFTs'],
					['065-Bid', 'Schritt 2', 'Listing auf Verkaufs&shy;plattformen & Marketing'],
					['014-price', 'Schritt 3', 'Abwicklung des Verkaufs&shy;prozesses & Vergütung']
				]; ?>
				<?php foreach ($steps as $key => $step): ?>
					<div class="step">
						<h3><?php echo $step[1];?></h3>
						<div class="icon-container">
							<?php echo file_get_contents('src/img/' . $step[0] . '.svg'); ?>
						</div>

						<div class="text">
							<p>
								<?php echo $step[2];?>
							</p>
						</div>
					</div>
					<?php if ($key + 1 != count($steps)): ?>
						<div class="step-between">
							<?php echo file_get_contents('src/img/011-b-arrow.svg'); ?>
						</div>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>
	</div>

	<div class="component component-image-and-text">
		<div class="inner">
			<h2 class="main-head">Das sind <span>wir</span></h2>
		</div>
		<div class="inner-special from-right">
			<div class="inner">
				<div class="block">
					<div class="block-inner">
						<div class="image-container" style="background-image:url('src/img/daniel2.jpg')">
						</div>
						<div class="text">
							<h2>Daniel</h2>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci asperiores aspernatur assumenda atque cumque exercitationem fugiat illum, maxime modi nam optio possimus quaerat quidem, quo reprehenderit sint tempora vero voluptate?
						</div>
					</div>

				</div>
			</div>
		</div>
		<div class="inner-special from-right component">
			<div class="inner">
				<div class="block">
					<div class="block-inner">
						<div class="image-container" style="background-image:url('src/img/tobias.jpg')">
						</div>
						<div class="text">
							<h2>Tobias</h2>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam aspernatur corporis et excepturi explicabo illo minima nemo, neque nobis porro provident quia quos repellat tempore unde, vero voluptatem voluptatum.
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="component component-contactform">
		<div class="inner">
			<h2 class="main-head">Jetzt <span>Termin</span> vereinbaren!</h2>
			<form action="">
				<div class="form-items-wrapper">
					<div class="form-item">
						<label for="firstname">Vorname</label>
						<input type="text" id="firstname">
					</div>
					<div class="form-item">
						<label for="firstname">Nachname</label>
						<input type="text" id="lastname">
					</div>
				</div>
				<div class="form-items-wrapper">
					<div class="form-item">
						<label for="email">E-Mail-Adresse</label>
						<input type="text" id="email">
					</div>
					<div class="form-item">
						<label for="telnr">Telnr.</label>
						<input type="text" id="telnr">
					</div>
				</div>
				<div class="form-item">
					<label for="message">Nachricht</label>
					<textarea name="message" id="message"></textarea>
				</div>
				<button type="submit">Termin anfragen</button>
			</form>
		</div>

	</div>

</main>
<footer>
	<div class="inner">
		<a href="">Datenschutz</a> <a href="">Impressum</a> <a href="">info@aotb.io</a> &copy; <?php echo date('Y');?> Artists on the block
	</div>
</footer>
<?php include('src/markup/foot.php'); ?>
