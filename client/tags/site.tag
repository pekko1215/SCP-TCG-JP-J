<site>
	<card class="{!sandBox.site[0]&&'blank'}"/>
	<card class="{!sandBox.site[1]&&'blank'}"/>
	<card class="{!sandBox.site[2]&&'blank'}"/>
	<card class="{!sandBox.site[3]&&'blank'}"/>
	<card class="{!sandBox.site[4]&&'blank'}"/>
	<card class="{!sandBox.site[5]&&'blank'}"/>
	<style scoped>
		:scope{
			display:inline-block;
		}
	</style>
	<script>
		observer.on('refresh',()=>{
			console.log(this.root.querySelectorAll('card'));
			[...this.root.querySelectorAll('card')].forEach((e,i)=>{
				riot.mount(e,sandBox.site[i])
			})
		})
	</script>
</site>