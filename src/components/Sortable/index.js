import React, { Component, Fragment } from 'react';
import './style.scss';

/**
* Create a container for sortable items.
* @example <SortableItems display={completedTasks} latestResult={newCompletedTasks} />
*/
class SortableItems extends Component {
	constructor(props) {
		super(props);
		
		//default items
		this.state = {
		  items: []
		}	
		
		this.newItems = [];
	}


	/**
	 * Set hover effect of the default modules 
	 *
	 */
  
    handleHoverOIn = ( e, id, type ) => {
		 if (typeof id != typeof undefined) {
			 
			
			let obj = null;
			
			 if ( type == 0 ) {
				 obj = document.querySelector( '#app__todo-' + id + ' > div > .app-preview > div' );
				 obj.style.backgroundColor = "lightblue";
				 obj.style.cursor = "move";
			 } else {
				 obj = document.querySelector( '#app__done-' + id + ' > div > .app-section' );
				 obj.style.borderColor = "#f00";
			 }
			 
			 
			 
		 }
         
		
    }

    handleHoverOut = ( e, id, type ) => {
		if (typeof id != typeof undefined) {
			
			let obj = null;
			
			 if ( type == 0 ) {
				 obj = document.querySelector( '#app__todo-' + id + ' > div > .app-preview > div' );
				 obj.style.backgroundColor = "#333";
				 obj.style.cursor = "default";
			 } else {
				 obj = document.querySelector( '#app__done-' + id + ' > div > .app-section' );
				 obj.style.borderColor = "#333";
			 }
			
			
		}
        
    }
	
	
	/**
	 * HTML decode of the content in JSX
	 *
	 */
	HTMLDecode = ( children ) => {

		return React.createElement( 'div', {
			dangerouslySetInnerHTML: {
				__html: children
			}
		});
	}
	

	/**
	 * Fire Drag & Drop events
	 *
	 */
	handleSortableOnDragStart = ( i ) => {
		

		this.setState({
			dragging: i,
			itemsOnDragStart: ( this.state.items.length > 0 ) ? this.state.items : this.props.latestResult //Use newCompletedTasks to get the latest sort defaults
		});

	}

	handleSortableOnDragEnd = () => {
		this.setState({
			overIndex: null
		});
	}

	handleSortableOnDragOver = ( i ) => {
		

		if ( typeof this.state.dragging != typeof undefined ) {
			
			const item = this.state.itemsOnDragStart[this.state.dragging];
			const newItems = [...this.state.itemsOnDragStart];
			
			//Changes the contents of an array by removing or replacing existing 
			//elements and/or adding new elements.
			newItems.splice(this.state.dragging, 1);
			newItems.splice(i, 0, item);

			this.newItems = newItems;
			
			this.setState({
				items: newItems,
				overIndex: i
			});	
		}
		

	}



  render() {
	  

    return (
		
		  <Fragment>
		
				  
			  {(() => {
			   
			
				let displayEl = [];
			    let listItems = ( this.newItems.length == 0 ) ? this.props.display : this.newItems;
			   
				for (let i = 0; i < listItems.length; i++) {

				  let task = listItems[i];

				  if ( typeof task.taskID != typeof undefined ) {

					  displayEl.push(
							<div
							  id={"app__done-" + i}
							  key={i}
							  data-id={task.taskID}
 							  className="app__done-sortable"
 							  data-sortindex={i}
							  onMouseEnter={(event) => this.handleHoverOIn(event, i, 1)}
							  onMouseLeave={(event) => this.handleHoverOut(event, i, 1)}

							  draggable="true"
							  onDragEnd={(event) => this.handleSortableOnDragEnd()}
							  onDragOver={(event) => this.handleSortableOnDragOver( i )}
							  onDragStart={(event) => this.handleSortableOnDragStart( i )}

							>
							  {this.HTMLDecode( task.code )}
							</div>

						);

					}

				}
	

				return displayEl;	

			  })()}	  
		
		  </Fragment>
	
    );
  }
  
}



export default SortableItems;

