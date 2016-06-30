
function templateController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

templateController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		 var ssMenu = new secondsidebarMenu(); ssMenu.init();

		 var mpToolbar = new mainpanelToolbar();  mpToolbar.init();
		 mpToolbar.setBanner('Templates');
		 mpToolbar.addOption('AddTemplate','addnewtemplate.png', 'Add Template');
         mpToolbar.addOptionInput('AddTemplate','name','name','addPrompt','Please enter name for this template');
    	 mpToolbar.addOptionInput('AddTemplate','numcopies','numcopies','addChoice',['3','4','5','6']);	
    	 mpToolbar.addOptionInput('AddTemplate','quorum','quorum','addChoice',['8','2','3','4','5','6','7','9','10']);
    	 mpToolbar.addOptionInput('AddTemplate','read','read','addChoice',['2','3','4','5']);	
     	 mpToolbar.addOptionInput('AddTemplate','write','write','addChoice',['2','3','4','5']);
         mpToolbar.addOptionInput('AddTemplate','defaultdesigndocs','default designlist','addPrompt','Please enter design list name that applies with this template');
		 mpToolbar.addOptionSubmit('AddTemplate','Create',function() {self.add()});
		 mpToolbar.setOptionClick('AddTemplate','addForm');
		 mpToolbar.addOption('TemplateHelp','help.png', 'Templates Help');
		 mpToolbar.setOptionHelpfile('TemplateHelp','help/templatehelp.html');
		 mpToolbar.addOptionSubmit('TemplateHelp','Finish',function() {self.bldform.dropdownDestroyAll()});
		 mpToolbar.setOptionClick('TemplateHelp','helpForm');  
		 
	     var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	     var tableid = 'mainPanelAllTemplates';
	     mpDataForms.addTable(tableid);
	     mpDataForms.tables[tableid].addHeader(tableid,1,6);
	     mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	     mpDataForms.tables[tableid].setCell(tableid,0,1,'N');
	     mpDataForms.tables[tableid].setCell(tableid,0,2,'Q');
	     mpDataForms.tables[tableid].setCell(tableid,0,3,'R');
	     mpDataForms.tables[tableid].setCell(tableid,0,4,'W');
	     mpDataForms.tables[tableid].setCell(tableid,0,5,'Design List');


		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req, 
	         function(response) {
			  
			    //handle loop closure environment
			     function get (templateid,name) {
					 var thisFunction = function(){self.get(templateid,name)};
					 return thisFunction;
				    } 
			     
		     var items = JSON.parse(response);		     
		     
		     for (var i in items) {
		    	    var templateid = items[i]._id;
		    	       var name      = items[i].name;
		    	       var numcopies = items[i].numcopies;
		    	       var quorum    = items[i].quorum;
		    	       var read      = items[i].read;
		    	       var write     = items[i].write;
		    	       var list      = items[i].designlist;

		       mpDataForms.tables[tableid].addRow(tableid,parseInt(i) + 1,6);
		       mpDataForms.tables[tableid].setCellAsButton(tableid,parseInt(i) + 1,0,name,get(templateid,name));
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,1,numcopies); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,2,quorum); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,3,read); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,4,write); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,5,list); 

		     }
		    }, self.session.logout);
		  window.location.hash = "/_all_templates";
		  req.open("POST", "_all_templates", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
templateController.prototype.get = function (templateid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		     ssToolbar.setLeftButtonClick(function() {self.getAll()});
		     ssToolbar.setBanner(name);
		 
			 ssToolbar.addAction('removeTemplate', 'Remove');
			 ssToolbar.setActionRemoveParameters('removeTemplate','Remove Template','mainPanelTemplate',name,
			 'Please confirm removal of this template from the Registry by typing its name in the box below and clicking on confirm', 'template name');
			 ssToolbar.addActionCancel('removeTemplate','Cancel',
					 function() {ssDropdownResultBuild ('Failure','Template Not Removed: Cancelled by User')});
			 ssToolbar.addActionSubmit('removeTemplate','Confirm',function() {self.remove(templateid,name)});
			 ssToolbar.setActionClick('removeTemplate','removeForm');
		   
		     ssToolbar.addAction('modifyTemplate', 'Modify');
		     ssToolbar.setActionModifyParameters('modifyTemplate','Modify Template', 'mainPanelTemplate',name, 1);
		     ssToolbar.addActionInput('modifyTemplate','numcopies','numcopies','modifyChoice',['3','4','5','6'],1);
		     ssToolbar.addActionInput('modifyTemplate','quorum','quorum','modifyChoice',['8','2','3','4','5','6','7','9','10'],2);
		     ssToolbar.addActionInput('modifyTemplate','read','read','modifyChoice',['2','3','4','5'],3);
		     ssToolbar.addActionInput('modifyTemplate','write','write','modifyChoice',['2','3','4','5'],4);
		     ssToolbar.addActionInput('modifyTemplate','defaultdesigndocs','default designlist','modifyValue',null,5);
		     ssToolbar.addActionSubmit('modifyTemplate','Save',function() {self.modify(templateid,name)});
		     ssToolbar.setActionClick('modifyTemplate','modifyForm');	     
		     ssToolbar.setRightButtonClick(function() {self.bldform.dropdownForm(ssToolbar.rightButton)});
		     
		     
		   var ssMenu = new secondsidebarMenu(); ssMenu.init();
		     ssMenu.addOption('TemplateEdit','Edit','hasactions');
	     
		     ssMenu.options['TemplateEdit'].addAction('modifyTemplate', 'Modify');
		     ssMenu.options['TemplateEdit'].setActionModifyParameters('modifyTemplate','Modify Template', 'mainPanelTemplate',name, 1);
		     ssMenu.options['TemplateEdit'].addActionInput('modifyTemplate','numcopies','numcopies','modifyChoice',['3','4','5','6'],1);
		     ssMenu.options['TemplateEdit'].addActionInput('modifyTemplate','quorum','quorum','modifyChoice',['8','2','3','4','5','6','7','9','10'],2);
		     ssMenu.options['TemplateEdit'].addActionInput('modifyTemplate','read','read','modifyChoice',['2','3','4','5'],3);
		     ssMenu.options['TemplateEdit'].addActionInput('modifyTemplate','write','write','modifyChoice',['2','3','4','5'],4);
		     ssMenu.options['TemplateEdit'].addActionInput('modifyTemplate','defaultdesigndocs','default designlist','modifyValue',null,5);
		     ssMenu.options['TemplateEdit'].addActionSubmit('modifyTemplate','Save',function() {self.modify(templateid,name)});	
		     ssMenu.options['TemplateEdit'].setActionClick('modifyTemplate','modifyForm');
		     ssMenu.options['TemplateEdit'].setClick(function() {self.bldform.dropdownForm(ssMenu.options['TemplateEdit'])});
		
		    var mpToolbar = new mainpanelToolbar(); mpToolbar.init();

	        var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	         var tableid = 'mainPanelTemplate';
	         mpDataForms.addTable(tableid);
	         mpDataForms.tables[tableid].addHeader(tableid,1,6);
	         mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	         mpDataForms.tables[tableid].setCell(tableid,0,1,'N');
	         mpDataForms.tables[tableid].setCell(tableid,0,2,'Q');
	         mpDataForms.tables[tableid].setCell(tableid,0,3,'R');
	         mpDataForms.tables[tableid].setCell(tableid,0,4,'W');
	         mpDataForms.tables[tableid].setCell(tableid,0,5,'Design List');
		
		    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
	              function(response) {
					var item = JSON.parse(response);  
				     if (item != undefined) {
				    	   var templateid = item._id;
				    	    var name      = item.name;
				    	    var numcopies = item.numcopies;
				    	    var quorum    = item.quorum;
				    	    var read      = item.read;
				    	    var write     = item.write;
				    	    var list      = item.designlist;
				       
						       mpDataForms.tables[tableid].addRow(tableid,1,6);
						       mpDataForms.tables[tableid].setCell(tableid,1,0,name);
						       mpDataForms.tables[tableid].setCell(tableid,1,1,numcopies); 
						       mpDataForms.tables[tableid].setCell(tableid,1,2,quorum); 
						       mpDataForms.tables[tableid].setCell(tableid,1,3,read); 
						       mpDataForms.tables[tableid].setCell(tableid,1,4,write); 
						       mpDataForms.tables[tableid].setCell(tableid,1,5,list); 
				     }
			  }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "template", true);
			  window.location.hash = "/template/"+templateid;
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+templateid); 
	}
	
	
	

	
templateController.prototype.add = function() {
	
    var self=this;	
    
		var formInputs = document.getElementsByClassName('MPTdropdownInput');
		if (formInputs[0].value != formInputs[0].prompt) {
		  var sendstring = 'name='+formInputs[0].value;
		  for (var i=1;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 0) {sendstring += '&name='+formInputs[i].value;}
				    if (i == 5) {sendstring += '&designlist='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 1) {sendstring += '&numcopies='+document.getElementById(formInputs[i].id).value;}
		    	  if (i == 2) {sendstring += '&quorum='+document.getElementById(formInputs[i].id).value;}	
		    	  if (i == 3) {sendstring += '&read='+document.getElementById(formInputs[i].id).value;}	
		    	  if (i == 4) {sendstring += '&write='+document.getElementById(formInputs[i].id).value;}	
		      }
		  }
		  var req = newXMLHttpRequest(); 
		  req.onreadystatechange = getReadyStateHandler(req, 
			  function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") { 
					   self.bldform.resultBanner (true,'Template Added Successfully');
					   self.getAll(); //refresh
					   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Template Not Added ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Template Not Added : Reason Not Specified');
				}
		       },self.session.logout);
		  req.open("POST", "_all_templates/add", true);
		  if (formInputs[0].value.length > 0) {
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send(sendstring);
		  }	
		  else {
			  self.bldform.resultBanner(false,'Template Not Added: Blank identifier provided');
		  }	
	    } 
		else {  self.bldform.resultBanner(false,'Template Not Added: No identifier provided'); 	}
	}
	
templateController.prototype.modify = function(templateid,name) {
	
    var self=this;	
    	
	      if (templateid.length > 0) {
		  var sendstring = "id="+templateid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 4) {sendstring += '&designlist='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 0) {sendstring += '&numcopies='+document.getElementById(formInputs[i].id).value;}
		    	  if (i == 1) {sendstring += '&quorum='+document.getElementById(formInputs[i].id).value;}	
		    	  if (i == 2) {sendstring += '&read='+document.getElementById(formInputs[i].id).value;}	
		    	  if (i == 3) {sendstring += '&write='+document.getElementById(formInputs[i].id).value;}	
		      }
		  }
		  
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req,
			   function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") {
					   self.bldform.resultBanner (true,'Template Changed Successfully');			   
					   self.get(templateid,name);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Template Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Template Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "template/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}
	
templateController.prototype.remove = function(templateid,name) {
	
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
							   self.bldform.resultBanner (true,'Template Removed Successfully');
							   self.getAll(); //refresh
						   }
						   else {
							if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
							self.bldform.resultBanner(false,'Template Not Removed ' + reasontext);
						   }
						}
						else {
							self.bldform.resultBanner(false,'Template Not Removed : Reason Not Specified');
						}
				      },self.session.logout);
				  req.open("POST", "template/remove", true);
				  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
				  req.send("id="+templateid);
			  }
			  else {
				  self.bldform.resultBanner(false,'Template Not Removed: Confirmation text is incorrect');
			  }
		  }
	}
	
