function getKeyPos(buffer, toFind, index){
	return buffer.split(toFind, index).join(toFind).length;
}

// https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
