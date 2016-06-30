
function designlistController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

designlistController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		 var ssMenu = new secondsidebarMenu(); ssMenu.init();


		 var mpToolbar = new mainpanelToolbar();  mpToolbar.init();
		 mpToolbar.setBanner('Designlists');
		 mpToolbar.addOption('AddDesignlist','addnewdesignlist.png', 'Add Designlist');
         mpToolbar.addOptionInput('AddDesignlist','name','name','addPrompt','Please enter name for this designlist');
         mpToolbar.addOptionInput('AddDesignlist','list','list','addPrompt','Enter list of design docs in JSON array format');		 
		 mpToolbar.addOptionSubmit('AddDesignlist','Create',function() {self.add()});
		 mpToolbar.setOptionClick('AddDesignlist','addForm');
		 mpToolbar.addOption('DesignlistHelp','help.png', 'Designlists Help');
		 mpToolbar.setOptionHelpfile('DesignlistHelp','help/designlisthelp.html');
		 mpToolbar.addOptionSubmit('DesignlistHelp','Finish',function() {self.bldform.dropdownDestroyAll()});
		 mpToolbar.setOptionClick('DesignlistHelp','helpForm');  
		 
	     var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	     var tableid = 'mainPanelAllDesignlists';
	     mpDataForms.addTable(tableid);
	     mpDataForms.tables[tableid].addHeader(tableid,1,2);
	     mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	     mpDataForms.tables[tableid].setCell(tableid,0,1,'List');


		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req, 
	         function(response) {
			  
			    //handle loop closure environment
			     function get (designlistid,name) {
					 var thisFunction = function(){self.get(designlistid,name)};
					 return thisFunction;
				    } 
			     
		     var items = JSON.parse(response);		     
		     
		     for (var i in items) {
		       var designlistid = items[i]._id;
		       var name       = items[i].name;
		       var list      = JSON.stringify(items[i].list);

		       mpDataForms.tables[tableid].addRow(tableid,parseInt(i) + 1,2);
		       mpDataForms.tables[tableid].setCellAsButton(tableid,parseInt(i) + 1,0,name,get(designlistid,name));
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,1,list); 

		     }
		    }, self.session.logout);
		  window.location.hash = "/_all_designlists";
		  req.open("POST", "_all_designlists", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
designlistController.prototype.get = function (designlistid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		     ssToolbar.setLeftButtonClick(function() {self.getAll()});
		     ssToolbar.setBanner(name);
		 
			 ssToolbar.addAction('removeDesignlist', 'Remove');
			 ssToolbar.setActionRemoveParameters('removeDesignlist','Remove Designlist','mainPanelDesignlist',name,
			 'Please confirm removal of this designlist from the Registry by typing its name in the box below and clicking on confirm', 'designlist name');
			 ssToolbar.addActionCancel('removeDesignlist','Cancel',
					 function() {ssDropdownResultBuild ('Failure','Designlist Not Removed: Cancelled by User')});
			 ssToolbar.addActionSubmit('removeDesignlist','Confirm',function() {self.remove(designlistid,name)});
			 ssToolbar.setActionClick('removeDesignlist','removeForm');
		   
		     ssToolbar.addAction('modifyDesignlist', 'Modify');
		     ssToolbar.setActionModifyParameters('modifyDesignlist','Modify Designlist', 'mainPanelDesignlist',designlistid, 1);
		     ssToolbar.addActionInput('modifyDesignlist','list','list','modifyValue',null,1);
		     ssToolbar.addActionSubmit('modifyDesignlist','Save',function() {self.modify(designlistid,name)});
		     ssToolbar.setActionClick('modifyDesignlist','modifyForm');	     
		     ssToolbar.setRightButtonClick(function() {self.bldform.dropdownForm(ssToolbar.rightButton)});
		     
		     
		   var ssMenu = new secondsidebarMenu(); ssMenu.init();
		     ssMenu.addOption('DesignlistEdit','Edit','hasactions');

		     
		     ssMenu.options['DesignlistEdit'].addAction('modifyDesignlist', 'Modify');
		     ssMenu.options['DesignlistEdit'].setActionModifyParameters('modifyDesignlist','Modify Designlist', 'mainPanelDesignlist',name, 1);
		     ssMenu.options['DesignlistEdit'].addActionInput('modifyDesignlist','list','list','modifyValue',null,1);	     
		     ssMenu.options['DesignlistEdit'].addActionSubmit('modifyDesignlist','Save',function() {self.modify(designlistid,name)});	
		     ssMenu.options['DesignlistEdit'].setActionClick('modifyDesignlist','modifyForm');
		     ssMenu.options['DesignlistEdit'].setClick(function() {self.bldform.dropdownForm(ssMenu.options['DesignlistEdit'])});
		
		    var mpToolbar = new mainpanelToolbar(); mpToolbar.init();

	        var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	         var tableid = 'mainPanelDesignlist';
	         mpDataForms.addTable(tableid);
	         mpDataForms.tables[tableid].addHeader(tableid,1,2);
	         mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	         mpDataForms.tables[tableid].setCell(tableid,0,1,'List');
		
		    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
	              function(response) {
					var item = JSON.parse(response);  
				     if (item != undefined) {
				       var designlistid = item._id;
				       var name       = item.name;
				       var list      = JSON.stringify(item.list);
				       
				       mpDataForms.tables[tableid].addRow(tableid,1,2);
				       mpDataForms.tables[tableid].setCell(tableid,1,0,name);
				       mpDataForms.tables[tableid].setCell(tableid,1,1,list); 
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
	
