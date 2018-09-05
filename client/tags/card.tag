<card>

	<style scoped>
		:scope{
			width:6vw;
			height:8vw;
			background:url(./cardimages/back.png);
			display:inline-block;
			background-size: cover;
		    border: solid 2px gray;
		}
		:scope.blank{
			background: none;
		    border: solid 1px white;
		    border-radius: 3px;
		}
		:scope.keter{
			border-color:red;
		}
		:scope.euclid{
			border-color:yellow;
		}
		:scope.safe{
			border-color:green;
		}
		.cardimage {
			width:100%;
			height:100%;
		}
		:scope.sandBox:after{
			content: attr(data-secure)'';
		    position: relative;
		    color: #ff0000;
		    font-size: 2.5vw;
		    top: 12%;
		    background: black;
		    display: block;
		    margin: 18%;
		    border-radius: 30%;
		    border: solid 1px black;
		    text-align: center;
		}

	</style>
</card>