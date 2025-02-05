<script>
	let { class: className } = $$props;
</script>

<div class="{className} progressbar indeterminate">
  <div class="short-bar"></div>
  <div class="long-bar"></div>
</div>

<style>
	@keyframes progressbarindeterminateshort {
		0% {
			left: -40%;
		}

		75% {
			left: 120%;
		}

		100% {
			left: 120%;
		}
	}

	@keyframes progressbarindeterminatelong {
		0% {
			left: -90%;
		}

		37.5% {
			left: -90%;
		}

		100% {
			left: 100%;
		}
	}

	.progressbar {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: hsl(var(--muted));
		min-height: 3px;
		position: absolute;
		border-radius: 1.5px;
		overflow: hidden !important;
	}

	.progressbar > .short-bar {
		background-color: hsl(var(--primary));
		width: 40%;
		height: 100%;
		left: -40%;
		border-radius: 0.5px;
		position: absolute;
		display: inline-block;
		-webkit-animation: progressbarindeterminateshort 2s ease-in-out infinite;
		-moz-animation: progressbarindeterminateshort 2s ease-in-out infinite;
		-o-animation: progressbarindeterminateshort 2s ease-in-out infinite;
		animation: progressbarindeterminateshort 2s ease-in-out infinite;
	}

	.progressbar > .long-bar {
		background-color: hsl(var(--primary));
		width: 60%;
		height: 100%;
		left: -90%;
		border-radius: 0.5px;
		position: absolute;
		display: inline-block;
		-webkit-animation: progressbarindeterminatelong 2s ease-in-out infinite;
		-moz-animation: progressbarindeterminatelong 2s ease-in-out infinite;
		-o-animation: progressbarindeterminatelong 2s ease-in-out infinite;
		animation: progressbarindeterminatelong 2s ease-in-out infinite;
	}
</style>