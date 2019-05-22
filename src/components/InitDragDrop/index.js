import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import SaveController from '../SaveController';
import SaveContainer from '../SaveContainer';
import classie from '../Utilities/classie';
import './style.scss';



class App extends Component {
	constructor(props) {

		//You are extending the React.Component class, and per the ES2015 spec, 
		//a child class constructor cannot make use of this until super() has 
		//been called; also, ES2015 class constructors have to call super() 
		//if they are subclasses.
		super(props);
		//console.log(this.props) //props will get logged.

		
		//init data
		this.state = {
			newCompletedTasks: [],
			completedTasks: [],
			draggedTask: {},
			todos: [],
			isLoading: true,
			errors: null
		}

	}


	
	
	/**
	 * Get and save the latest results
	 *
	 */
	saveData = () => {
		
		let allNewResults  = ReactDOM.findDOMNode( this ).innerHTML.match(/<div\s*class=\"app-section\"(.*?)>(.*?)<\/div>/gim);

		if ( allNewResults !== null ) {
			
			const {
				completedTasks
			} = this.state;
			
			let newValue = [];

			for (let i = 0; i < completedTasks.length; i++) {
			
				
				//Avoid adding an empty object
				if ( typeof completedTasks[i].taskID != typeof undefined ) {
				
					newValue.push( {
								  "taskID": completedTasks[i].taskID,
								  "preview": completedTasks[i].preview,
								  "code": allNewResults[i]
								} );	
					
					
				} 
				

				
			}
			
			//don't update completedTasks in order to get correct 
			//caret position in contentEditable div 
			this.setState({
				newCompletedTasks: newValue
			});
			
	
			//Output the latest results to the form to save the data.
			let result = SaveController( newValue, 'app-alldata' );
			console.log( result );
			
		}
	}

	/**
	 * Bind a Drag event to default modules.
	 *
	 */
	handleDrag = (e, todo ) => {
		e.preventDefault();
		
		this.setState({
			draggedTask: todo
		});	

	}
	

	/**
	 * Bind a Click event to default modules.
	 *
	 */
	handleClick = (e, todo ) => {
	
		e.preventDefault();
		
		
		this.setState({
			newCompletedTasks: [...this.state.completedTasks, todo],
			completedTasks: [...this.state.completedTasks, todo]

		});	

		//Output the latest results to the form to save the data.
		let result = SaveController( [...this.state.completedTasks, todo], 'app-alldata' );


	}
	
	

	
	/**
	 * Bind a DragOver event to target modules.
	 *
	 */
	handleDragOver = ( e ) => {
		e.preventDefault();
	}

	
	/**
	 * Bind a Drop event to target modules.
	 *
	 */
	handleDrop = ( e ) => {
		const {
			completedTasks,
			draggedTask,
			todos
		} = this.state;
		
	
		if ( true === classie.has( e.target, 'app__dones' ) ) {
			
			//Check if a key exists inside draggedTask
			if ( true === draggedTask.hasOwnProperty( 'taskID' ) ) {
				
				this.setState({
					completedTasks: [...completedTasks, draggedTask],
					//todos: todos.filter(task => task.taskID !== draggedTask.taskID),   //remove orginal elements
					draggedTask: {},
				});	
			}	
			
		}
		


	}
	



	/**
	 * Bind a DragEnd event to default modules.
	 *
	 */
	handleDragEnd = ( e ) => {

		//save data
		this.saveData();


	}

	/**
	 * Set hover effect of the default modules 
	 *
	 */
  
    handleHoverOIn = ( e, id, type, subprefix = '' ) => {
		 if (typeof id != typeof undefined) {
			 
			let obj = e.target;
			
			
			 
		 }
         
		
    }

    handleHoverOut = ( e, id, type, subprefix = '' ) => {
		if (typeof id != typeof undefined) {
			
			let obj =  e.target;
			
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
	 * Listen to changes on a contenteditable element
	 *
	 */
	divEditable = ( e ) => {

		
        let html = ReactDOM.findDOMNode( this ).innerHTML;
        if ( this.props.onChange && html !== this.lastHtml ) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
		
		//save data
		this.saveData();
		
		
	}
	
	
	/**
	 * Load default module data from external
	 *
	 */
	 getTodos = () => {
		 
		   // The API where we're fetching data from
		  fetch(`assets/json/modules.json`)
		  // We get a response and receive the data in JSON format...
		  .then(response => response.json())
		  // ...then we update the state of our application
		  .then(
		    data =>
			  this.setState({
			      todos: data,
			      isLoading: false,
			  })
		  )
		  // If we catch errors instead of a response, let's update the app
		  .catch(error => this.setState({ error, isLoading: false }));
		 
	  }

	 
	/**
	 * Sortable items
	 *
	 */
	handleSortableOnDragStart = ( i ) => {
		
		this.setState({
			dragging: i,
			itemsOnDragStart: this.state.newCompletedTasks //Use newCompletedTasks to get the latest sort defaults
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

			this.setState({
				completedTasks: newItems,
				overIndex: i
			});	
		}
		

	}
	

	navHandleClick = ( e ) => {
		e.preventDefault();
		e.stopPropagation();
		
		this.toggleClass( e.target.parentElement, 'nav-active');
	}

	
	// hasClass
	hasClass = (elem, className) => {
	  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}

	// toggleClass
	toggleClass = (elem, className) => {
	  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
		if ( this.hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		} else {
			elem.className += ' ' + className;
		}
	}
	 
	
	/**
	 * componentDidMount() is invoked immediately after a component 
	 * is mounted (inserted into the tree). 
	 * Initialization that requires DOM nodes should go here. 
	 * If you need to load data from a remote endpoint, this 
	 * is a good place to instantiate the network request.
	 */
	componentDidMount() {
	    //do shmething
		this.getTodos();
		
	}
	
	componentDidUpdate = (prevProps, prevState) => {

	}
	

  render() {
    const { todos, completedTasks, isLoading } = this.state;

    return (
		
	  <React.Fragment>
		  <div className="app">

			<div className="app__todos">
		        <ul className="app__primary-menu">
					  {(() => {
					   if ( !isLoading ) {


							let displayEl = [];
							if ( typeof todos != typeof undefined ) {

								for (let i = 0; i < todos.length; i++) {
									
								  //sub menu
								  let displaySubEl = null;
							
									
								  if ( typeof todos[i].content != typeof undefined ) {
									  
									    let submenus = todos[i].content;

									    if ( submenus.length > 0 ) {

											
										      displaySubEl = React.createElement( 'ul',
																{
																  className: 'app__primary-submenu'
																},		 
																submenus.map( (item, k ) => {
												  
												 
																  return (

																	  <li
																		id={"app__todo-sub" + k}
																		key={k}
																		data-id={item.taskID}
																		draggable="true"
																		onDrag={(event) => this.handleDrag(event, item )}
																		onDragEnd={this.handleDragEnd.bind(this)}
																		onMouseEnter={(event) => this.handleHoverOIn(event, k, 0, 'sub')}
																		onMouseLeave={(event) => this.handleHoverOut(event, k, 0, 'sub')}
																		onClick={(event) => this.handleClick(event, item )}
																		>

																		{this.HTMLDecode( item.preview )}

																	  </li>
											
																  );
																})
															  );
											

									  
								    	}//end if submenus

  
								  }
									
									
								  displayEl.push(
									  <li
										key={i}
									    onClick={(event) => this.navHandleClick(event)}
										>

										{this.HTMLDecode( todos[i].preview )}
						   
						                {displaySubEl}
						   
						   

									  </li>

								  );
								}


								return displayEl;	
							}


					   } 
					  })()}
				</ul>




			</div>



				
			<div
			  onDrop={(event) => this.handleDrop(event)}
			  onDragOver={(event => this.handleDragOver(event))}
			  className="app__dones"
			>
			  
			  {(() => {
				let displayEl2 = [];


				for (let i = 0; i < completedTasks.length; i++) {

				  let task = completedTasks[i];

				  if ( typeof task.taskID != typeof undefined ) {

					  displayEl2.push(
							<div
							  id={"app__done-" + i}
							  key={i}
							  data-id={task.taskID}
							  contenteditable="true"
 							  className="app__done-sortable"
 							  data-sortindex={i}
							  onInput={(event) => this.divEditable(event)}
							  onBlur={(event) => this.divEditable(event)}
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

				

                 
				return displayEl2;

			  })()}	  
			
			</div>

		  </div>

          <SaveContainer id={"app-alldata"} />
		  


      </React.Fragment>


    );
  }
  
}


export default App;
