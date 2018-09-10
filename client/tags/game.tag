<game>
	<div id="gameLeft">
		<enemmyTale></enemmyTale>
		<decommissioned></decommissioned>
	</div>
	<div id="main">
		<div id="enemmyZone">
			<enemmySandBox></enemmySandBox><br>
			<enemmySite></enemmySite>
		</div>
		<div id="zone">
			<site></site><br>
			<sandBox></sandBox>
		</div>
	</div>
	<div id="gameRight">
		<enemmyDecommissioned></enemmyDecommissioned>
		<tale></tale>
	</div>
	<style scoped>
	:scope{
		background-color:black;
		width:100vw;
		height:80vw;
		max-height:100vh;
		position:absolute;
	}
	#gameRight{
		height: 100%;
		right: 5%;
		width: 15%;
		position: absolute;
		top: 3vw;
	}
	#gameLeft{
		margin-left: 5%;
		height: 100%;
		position: absolute;
		padding-top:3vw;
	}
	#main{
		width: auto;
	    height: 94%;
	    padding-left: 20%;
	    padding-right: 20%;
	    padding-top: 3%;
	    padding-bottom: 3%;
	    text-align: center;
	}
	#enemmyZone{
		height:50%;
	}

	#zone{
		height:50%;
	}

	#zone > div{
		height:50%;
	}
	#enemmyZone > div{
		height:50%;
	}

	tale {
		position: absolute;
		bottom: 5vw;
	}

	decommissioned {
		position:absolute;
		bottom:5vw;
	}
	enemmySandBox,site{
		height:50%;
	}
	</style>
</game>