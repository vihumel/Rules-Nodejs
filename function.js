function validate(func, data){
	function eq3(data){
		if(data.length == 3){
			return true;
		}else{
			return false;
		}		}
	}

	function to(data){
		if (data.length < 140) {
			return true;
		}else{
			return false;
		}
	}

	function use(data){
		if(data == "true"){
			return true;
		}
	}
	else{
		return false;
	}

}