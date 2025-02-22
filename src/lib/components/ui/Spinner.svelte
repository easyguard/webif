<div class="progress-ring spinner-indeter">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="progressring">
		<circle class="static" cx="50%" cy="50%" r="43.75%"></circle>
		<circle class="dynamic" cx="50%" cy="50%" r="43.75%"></circle>
	</svg>
</div>

<style>
	@keyframes progressring {
		0% {
			stroke-dasharray: 0% 275%;
			transform: rotate(-90deg);
		}

		50% {
			transform: rotate(360deg);
			stroke-dasharray: 137.5% 137.5%;
		}

		100% {
			stroke-dasharray: 0% 275%;
			transform: rotate(990deg);
		}
	}

	@keyframes progressring-width {
		0% {
			stroke-dasharray: 0% 275%;
			transform: rotate(-90deg);
			stroke-width: 12.5%;
		}

		50% {
			transform: rotate(360deg);
			stroke-dasharray: 137.5% 137.5%;
			stroke-width: 5%;
		}

		100% {
			stroke-dasharray: 0% 275%;
			transform: rotate(990deg);
			stroke-width: 12.5%;
		}
	}

	.progress-ring {
		width: 48px;
		height: 48px;
	}

	.progress-ring > .progressring {
		width: 100%;
		height: 100%;
	}

	.progress-ring > .progressring > .static {
		fill: none;
		-webkit-transform: rotate(-90deg);
		-moz-transform: rotate(-90deg);
		-o-transform: rotate(-90deg);
		transform: rotate(-90deg);
		-webkit-transition: all 0.2s ease-in-out;
		-moz-transition: all 0.2s ease-in-out;
		-o-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
		stroke-width: 12.5%;
		stroke-linecap: round;
		-webkit-transform-origin: 50% 50%;
		-moz-transform-origin: 50% 50%;
		-o-transform-origin: 50% 50%;
		transform-origin: 50% 50%;
		width: 100%;
		display: flex;
		position: relative;
		overflow: hidden;
		align-items: center;
		border-radius: 50%;
		height: 100%;
		/* stroke: #ccccccff; */
		stroke: #333333ff;
	}

	.progress-ring.spinner-indeter > .progressring > .dynamic {
		-webkit-animation: progressring 2s linear infinite;
		-moz-animation: progressring 2s linear infinite;
		-o-animation: progressring 2s linear infinite;
		animation: progressring 2s linear infinite;
	}

	.progress-ring > .progressring > .dynamic {
		fill: none;
		-webkit-transform: rotate(-90deg);
		-moz-transform: rotate(-90deg);
		-o-transform: rotate(-90deg);
		transform: rotate(-90deg);
		-webkit-transition: all 0.2s ease-in-out;
		-moz-transition: all 0.2s ease-in-out;
		-o-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
		stroke-width: 12.5%;
		stroke-linecap: round;
		-webkit-transform-origin: 50% 50%;
		-moz-transform-origin: 50% 50%;
		-o-transform-origin: 50% 50%;
		transform-origin: 50% 50%;
		height: 100%;
		border-radius: 50%;
		stroke: #0064ffff;
	}
</style>