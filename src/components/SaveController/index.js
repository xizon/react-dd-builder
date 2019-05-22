import './style.scss';

/**
* Output the latest results to the form to save the data.
* @param  {JSON} jsonData    Input modules data
* @param  {String} id        The ID of the form in which the data is stored
* @return {JSON}             The latest modules data.
*/
const SaveController = ( jsonData, id ) => {


	var data =  jsonData;

	if ( data && Object.prototype.toString.call( data )=='[object Array]' && data.length > 0 ) {
		let output = '';
		for (let k = 0; k < data.length; k++ ) {	
			output += data[k].code;	
		}

		document.getElementById( id ).value = output;
		
		return jsonData;
	}

  
}

export default SaveController;

