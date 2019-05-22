import React, { Component, Fragment } from 'react';
import './style.scss';

/**
* Create a container for save data.
*/
class SaveContainer extends Component {
	constructor(props) {
		super(props);

	}

  render() {

    return (
		
		<textarea rows={15} cols={50} id={this.props.id} defaultValue={""} />
	
    );
  }
  
}



export default SaveContainer;


