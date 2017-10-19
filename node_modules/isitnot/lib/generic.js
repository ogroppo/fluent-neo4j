isEmpty = arg => {
	if(isEmptyObject(arg))
		return true;

	if(isEmptyArray(arg))
		return true;

	if(isEmptyString(arg))
		return true;

	if(arg === null)
		return true;

	if(arg === undefined)
		return true;
	
	return false;
}

isNotEmpty = arg => !isEmpty(arg)