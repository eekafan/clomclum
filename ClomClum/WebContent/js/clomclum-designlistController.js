
function designlistController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

designlistController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();

		 var mpToolbar = new mainpanelToolbar({
		 banner:'Designlists',
		 options: [{id:'AddDesignlist',icon:'addnewdesignlist.png', 
			        clickform: {type: 'addForm', parameters: {
			          header:'Add Designlist',
		              submit:{label:'Create',onclick:function(){self.add();}},
                      inputs:[{id:'name',label:'name',prompt:'Please enter name for this designlist'},
                              {id:'list',label:'list',prompt:'Enter list of design docs in JSON array format'}]
			        }}},
		           {id:'DesignlistHelp',icon:'help.png', 
                    clickform: {type: 'helpForm', parameters: {
                        header:'Designlists Help', 
                        submit:{label:'Finish'}, helpfile: 'help/designlisthelp.html'}}
		            }]});	 
		 mpToolbar.load();
		 
	     var mpDataForms = new mainpanelDataForms({
	    	 tables: [{id:'mainPanelAllDesignlists', header: [{titles:['Name','List']}],rows: []}]
	    	         });
	     
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req, 
	         function(response) {
			    //handle loop closure environment
			     var get = function(designlistid,name) {
					 var thisFunction = function(){self.get(designlistid,name)};
					 return thisFunction;
				    } 
			     
		     var items = JSON.parse(response);		     
		     
		     for (var i in items) {
		       var designlistid = items[i]._id;
		       var name       = items[i].name;
		       var list      = JSON.stringify(items[i].list);

		      mpDataForms.addRow('mainPanelAllDesignlists',
		    		                   {cells : [{type: 'button', text: name, onclick: get(designlistid,name)},
		                                         {type: 'text'  , text: list}]
		    		                   });
		      }
		      mpDataForms.load();
		    }, 
		    self.session.logout);
		  window.location.hash = "/_all_designlists";
		  req.open("POST", "_all_designlists", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
designlistController.prototype.get = function (designlistid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   
		   var ssToolbar = new secondsidebarToolbar({
			     leftbutton: {onclick:function() {self.getAll()}},
				 banner:name,
				 rightbutton: { id:'Toolbar',
					            actions: [{id:'removeDesignlist', label:'Remove', 
					            	       clickform:{type: 'removeForm', parameters : { 
					                    	   header:'Remove Designlist',currentdata:'mainPanelDesignlist',removeobject:name, inputlabel:'designlist name',
					                       warning:'Please confirm removal of this designlist from the Registry by typing its name in the box below and clicking on confirm',
					                           submit:{label:'Confirm', onclick: function() {self.remove(designlistid,name);}},
				                               cancel:{label:'Cancel',text:'Designlist Not Removed: Cancelled by User'}}}},
				                           {id:'modifyDesignlist', label:'Modify', 
				                            clickform:{type: 'modifyForm', parameters : { 
							                   header:'Modify Designlist',currentdata:'mainPanelDesignlist',modifyobject:name, currentrow: 1 ,
							                   submit:{label:'Save', onclick: function() {self.modify(designlistid,name);}},
						                       inputs: [{id: 'list', label: 'list', type: 'modifyValue', data: null, currentindex: 1}]}}}
					                      ]
				 }});	  
		   ssToolbar.load();
		  
		     
		     
		   var ssMenu = new secondsidebarMenu({
		           options: [{id:'DesignlistEdit',label: 'Edit', 
		        	          actions: [{id:'modifyDesignlist', label:'Modify', 
		        	        	         clickform:{type:'modifyForm', parameters : { 
					                     header:'Modify Designlist',currentdata:'mainPanelDesignlist',modifyobject:designlistid, currentrow: 1 ,
					                     submit:{label:'Save', onclick: function() {self.modify(designlistid,name);}},
				                         inputs: [{id: 'list', label: 'list', type: 'modifyValue', currentindex: 1}]}}}
			                           ]}
		           ]});
		   ssMenu.load();
	
			 var mpToolbar = new mainpanelToolbar({ banner:'' });
			 mpToolbar.load();

		    var mpDataForms = new mainpanelDataForms({
		    	 tables: [{id:'mainPanelDesignlist', 
		    		       header: [{titles:['Name','List']}],
		    		       rows: []}
		    	         ]
		    	         });
		
		    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
	              function(response) {
					var item = JSON.parse(response);  
				     if (item != undefined) {
				       var designlistid = item._id;
				       var name       = item.name;
				       var list      = JSON.stringify(item.list);
				       
					      mpDataForms.addRow('mainPanelDesignlist',
	    		                   {cells : [{type: 'text', text: name},
	                                         {type: 'text', text: list}]
	    		                   });         
	                      mpDataForms.load();		       
				     }
			  }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "designlist", true);
			  window.location.hash = "/designlist/"+designlistid;
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+designlistid); 
	}
	
	
	

	
designlistController.prototype.add = function() {
	
    var self=this;	
    
		var formInputs = document.getElementsByClassName('MPTdropdownInput');
		if (formInputs[0].value != formInputs[0].prompt) {
		  var sendstring = 'name='+formInputs[0].value;
		  for (var i=1;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 1) {sendstring += '&list='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {

		      }
		  }
		  var req = newXMLHttpRequest(); 
		  req.onreadystatechange = getReadyStateHandler(req, 
			  function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") { 
					   self.bldform.resultBanner (true,'Designlist Added Successfully');
					   self.getAll(); //refresh
					   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Designlist Not Added ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Designlist Not Added : Reason Not Specified');
				}
		       },self.session.logout);
		  req.open("POST", "_all_designlists/add", true);
		  if (formInputs[0].value.length > 0) {
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send(sendstring);
		  }	
		  else {
			  self.bldform.resultBanner(false,'Designlist Not Added: Blank identifier provided');
		  }	
	    } 
		else {  self.bldform.resultBanner(false,'Designlist Not Added: No identifier provided'); 	}
	}
	
designlistController.prototype.modify = function(designlistid,name) {
	
    var self=this;	
    	
	      if (designlistid.length > 0) {
		  var sendstring = "id="+designlistid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 0) {sendstring += '&list='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
	
		      }
		  }
		  
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req,
			   function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") {
					   self.bldform.resultBanner (true,'Designlist Changed Successfully');			   
					   self.get(designlistid,name);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Designlist Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Designlist Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "designlist/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}
	
designlistController.prototype.remove = function(designlistid,name) {
	
    var self=this;	
  
	  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  // assume only one input
		  if (formInputs[0]) {
			  if (formInputs[0].value == name) {
				  var req = newXMLHttpRequest();
				  req.onreadystatechange = getReadyStateHandler(req,
	                   function(response) {
	
						var reply = JSON.parse(response);
						var reasontext;
						if (reply.hasOwnProperty('result')) {
						   if (reply.result == "Success") {
							   self.bldform.resultBanner (true,'Designlist Removed Successfully');
							   self.getAll(); //refresh
						   }
						   else {
							if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
							self.bldform.resultBanner(false,'Designlist Not Removed ' + reasontext);
						   }
						}
						else {
							self.bldform.resultBanner(false,'Designlist Not Removed : Reason Not Specified');
						}
				      },self.session.logout);
				  req.open("POST", "designlist/remove", true);
				  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
				  req.send("id="+designlistid);
			  }
			  else {
				  self.bldform.resultBanner(false,'Designlist Not Removed: Confirmation text is incorrect');
			  }
		  }
	}
	
