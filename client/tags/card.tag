<card>
    	<div class="back" if={opts.name}>
    		<img class="back-image" src="./cardimages/{opts.class||opts.type}.png">
    		<img class="card-image" src="./cardimages/image/{opts.id||opts.name}.png">
    	</div>
<!--	<div class="cost" if={opts.name}>
    		{opts.cost||'-'}
    	</div>
    	<div class="name" if={opts.name}>
    		{opts.name}
    	</div>
    	<div class="protect" if={opts.name}>
    		{opts.protect}
    	</div>
    	<div class="text" if={opts.name}>
    		<div class="type">
    			【{opts.type}】
    		</div>
    		<div class="effect">
    			{opts.text}
    		</div>
    		<div class="flavor">
    			{opts.flavor}
    		</div>
    	</div>
    	<div class="tag" if={opts.name}></div> -->
    	<style scoped>
    		:scope{
    			width:6vw;
    			height:8vw;
    			background:url(./cardimages/back.png);
    			display:inline-block;
    			background-size: cover;
    		    border: solid 2px gray;
    		    /*position:absolute;*/
    		}
    		:scope.blank{
    			background: none;
    		    border: solid 1px white;
    		    border-radius: 3px;
    		}
    		:scope.sandBox.keter{
    			border-color:red;
    		}
    		:scope.sandBox.euclid{
    			border-color:yellow;
    		}
    		:scope.sandBox.safe{
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
    		.card-image {
    			width: 87%;
    			height: 46%;
    			position: absolute;
    			top: 18%;
    			left: 11%;
    		}
    		.back-image {
    			width: 100%;
    		    height: 100%;
    			z-index: 9;
    			position: absolute;
    			left: 0;
    		}
    		.back {
    			position: absolute;
    			width: inherit;
    			height: inherit;
    		}
    	</style>
    	<script>
    		console.log(this.opts)
    	</script>
</card>