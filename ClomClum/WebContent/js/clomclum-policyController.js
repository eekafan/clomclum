
function policyController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

policyController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		 var ssMenu = new secondsidebarMenu(); ssMenu.init();

		 var mpToolbar = new mainpanelToolbar();  mpToolbar.init();
		 mpToolbar.setBanner('Policies');
		 mpToolbar.addOption('AddPolicy','addnewpolicy.png', 'Add Policy');
         mpToolbar.addOptionInput('AddPolicy','name','name','addPrompt','Please enter name for this policy');
         mpToolbar.addOptionInput('AddPolicy','application','application','addPrompt','Enter application where this policy applies');
         mpToolbar.addOptionInput('AddPolicy','appscope','appscope','addPrompt','Enter application scope where this policy applies');
         mpToolbar.addOptionInput('AddPolicy','templatename','templatename','addPrompt','Enter templatename to use when this policy fires');
         mpToolbar.addOptionInput('AddPolicy','syncmaster','master for sync','addChoice',['registry', 'database']);
         mpToolbar.addOptionInput('AddPolicy','cluster','cluster','addPrompt','Enter cluster to place docstores when policy fires');
		 mpToolbar.addOptionSubmit('AddPolicy','Create',function() {self.add()});
		 mpToolbar.setOptionClick('AddPolicy','addForm');
		 mpToolbar.addOption('PolicyHelp','help.png', 'Policies Help');
		 mpToolbar.setOptionHelpfile('PolicyHelp','help/policyhelp.html');
		 mpToolbar.addOptionSubmit('PolicyHelp','Finish',function() {self.bldform.dropdownDestroyAll()});
		 mpToolbar.setOptionClick('PolicyHelp','helpForm');  
		 
	     var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	     var tableid = 'mainPanelAllPolicies';
	     mpDataForms.addTable(tableid);
	     mpDataForms.tables[tableid].addHeader(tableid,1,9);
	     mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	     mpDataForms.tables[tableid].setCell(tableid,0,1,'Requesting App');
	     mpDataForms.tables[tableid].setCell(tableid,0,2,'Requested AppScope');
	     mpDataForms.tables[tableid].setCell(tableid,0,3,'Requesting Roles');
	     mpDataForms.tables[tableid].setCell(tableid,0,4,'Assign Admin Roles');
	     mpDataForms.tables[tableid].setCell(tableid,0,5,'Assign Member Roles');
	     mpDataForms.tables[tableid].setCell(tableid,0,6,'Use Template');
	     mpDataForms.tables[tableid].setCell(tableid,0,7,'Master on Sync');
	     mpDataForms.tables[tableid].setCell(tableid,0,8,'Place on Cluster');


		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req, 
	         function(response) {
			  
			    //handle loop closure environment
			     function get (policyid,name) {
					 var thisFunction = function(){self.get(policyid,name)};
					 return thisFunction;
				    } 
			     
		     var items = JSON.parse(response);		     
		     
		     for (var i in items) {
		    	    var policyid = items[i]._id;
		  	      var policyid =  items[i]._id;
			       var name      = items[i].name;
			       var requestroles   = JSON.stringify(items[i].requestingroles);
			       var adminroles     = JSON.stringify(items[i].adminroles);
			       var memberroles     = JSON.stringify(items[i].memberroles);
			       var app       = items[i].application;
			       var appscope  = items[i].appscope;
			       var templatename     = items[i].templatename;
			       var syncmaster      = items[i].syncmaster;
			       var cluster      = items[i].cluster;

		       mpDataForms.tables[tableid].addRow(tableid,parseInt(i) + 1,9);
		       mpDataForms.tables[tableid].setCellAsButton(tableid,parseInt(i) + 1,0,name,get(policyid,name));
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,1,app); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,2,appscope); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,3,requestroles); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,4,adminroles); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,5,memberroles); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,6,templatename); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,7,syncmaster); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,8,cluster); 

		     }
		    }, self.session.logout);
		  window.location.hash = "/_all_policies";
		  req.open("POST", "_all_policies", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
policyController.prototype.get = function (policyid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		     ssToolbar.setLeftButtonClick(function() {self.getAll()});
		     ssToolbar.setBanner(name);
		 
			 ssToolbar.addAction('removePolicy', 'Remove');
			 ssToolbar.setActionRemoveParameters('removePolicy','Remove Policy','mainPanelPolicy',name,
			 'Please confirm removal of this policy from the Registry by typing its name in the box below and clicking on confirm', 'policy name');
			 ssToolbar.addActionCancel('removePolicy','Cancel',
					 function() {ssDropdownResultBuild ('Failure','Policy Not Removed: Cancelled by User')});
			 ssToolbar.addActionSubmit('removePolicy','Confirm',function() {self.remove(policyid,name)});
			 ssToolbar.setActionClick('removePolicy','removeForm');
		   
		     ssToolbar.addAction('modifyPolicy', 'Modify');
		     ssToolbar.setActionModifyParameters('modifyPolicy','Modify Policy', 'mainPanelPolicy',name, 1);
		     ssToolbar.addActionInput('modifyPolicy','template','template name','modifyValue',null,6);
		     ssToolbar.addActionInput('modifyPolicy','syncmaster','master for sync','modifyChoice',['registry','database'],7);
		     ssToolbar.addActionInput('modifyPolicy','cluster','cluster','modifyValue',null,8);
		     ssToolbar.addActionSubmit('modifyPolicy','Save',function() {self.modify(policyid,name)});
		     ssToolbar.setActionClick('modifyPolicy','modifyForm');	     
		     ssToolbar.addAction('modifyPolicyRoles', 'Modify Roles');
		     ssToolbar.setActionModifyParameters('modifyPolicyRoles','Modify Policy Roles', 'mainPanelPolicy',name, 1);
		     ssToolbar.addActionInput('modifyPolicyRoles','requestingroles','requesting roles','modifyValue',null,3);
		     ssToolbar.addActionInput('modifyPolicyRoles','adminroles','admin roles','modifyValue',null,4);
		     ssToolbar.addActionInput('modifyPolicyRoles','memberroles','member roles','modifyValue',null,5);
		     ssToolbar.addActionSubmit('modifyPolicyRoles','Save',function() {self.modify_roles(policyid,name)});
		     ssToolbar.setActionClick('modifyPolicyRoles','modifyForm');	 
		     ssToolbar.setRightButtonClick(function() {self.bldform.dropdownForm(ssToolbar.rightButton)});
		     
		     
		   var ssMenu = new secondsidebarMenu(); ssMenu.init();
		     ssMenu.addOption('PolicyEdit','Edit','hasactions');
	     
		     ssMenu.options['PolicyEdit'].addAction('modifyPolicy', 'Modify');
		     ssMenu.options['PolicyEdit'].setActionModifyParameters('modifyPolicy','Modify Policy', 'mainPanelPolicy',name, 1);
		     ssMenu.options['PolicyEdit'].addActionInput('modifyPolicy','template','template name','modifyValue',null,6);
		     ssMenu.options['PolicyEdit'].addActionInput('modifyPolicy','syncmaster','master for sync','modifyChoice',['registry','database'],7);
		     ssMenu.options['PolicyEdit'].addActionInput('modifyPolicy','clusters','cluster','modifyValue',null,8);
		     ssMenu.options['PolicyEdit'].addActionSubmit('modifyPolicy','Save',function() {self.modify(policyid,name)});	
		     ssMenu.options['PolicyEdit'].setActionClick('modifyPolicy','modifyForm');
		     ssMenu.options['PolicyEdit'].addAction('modifyPolicyRoles', 'Modify Roles');
		     ssMenu.options['PolicyEdit'].setActionModifyParameters('modifyPolicyRoles','Modify Policy Roles', 'mainPanelPolicy',name, 1);
		     ssMenu.options['PolicyEdit'].addActionInput('modifyPolicyRoles','requestingroles','requesting roles','modifyValue',null,3);
		     ssMenu.options['PolicyEdit'].addActionInput('modifyPolicyRoles','adminroles','admin roles','modifyValue',null,4);
		     ssMenu.options['PolicyEdit'].addActionInput('modifyPolicyRoles','memberroles','member roles','modifyValue',null,5);
		     ssMenu.options['PolicyEdit'].addActionSubmit('modifyPolicyRoles','Save',function() {self.modify_roles(policyid,name)});
		     ssMenu.options['PolicyEdit'].setActionClick('modifyPolicyRoles','modifyForm');	 		     
		     ssMenu.options['PolicyEdit'].setClick(function() {self.bldform.dropdownForm(ssMenu.options['PolicyEdit'])});
		
		    var mpToolbar = new mainpanelToolbar(); mpToolbar.init();

	        var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	         var tableid = 'mainPanelPolicy';
	         mpDataForms.addTable(tableid);
		     mpDataForms.tables[tableid].addHeader(tableid,1,9);
		     mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
		     mpDataForms.tables[tableid].setCell(tableid,0,1,'Requesting App');
		     mpDataForms.tables[tableid].setCell(tableid,0,2,'Requested AppScope');
		     mpDataForms.tables[tableid].setCell(tableid,0,3,'Requesting Roles');
		     mpDataForms.tables[tableid].setCell(tableid,0,4,'Assign Admin Roles');
		     mpDataForms.tables[tableid].setCell(tableid,0,5,'Assign Member Roles');
		     mpDataForms.tables[tableid].setCell(tableid,0,6,'Use Template');
		     mpDataForms.tables[tableid].setCell(tableid,0,7,'Master on Sync');
		     mpDataForms.tables[tableid].setCell(tableid,0,8,'Place on Cluster');
		
		    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
	              function(response) {
					var item = JSON.parse(response);  
				     if (item != undefined) {
				    	   var policyid =  item._id;
				    	    var name      = item.name;
				    	    var requestroles = JSON.stringify(item.requestingroles);
				    	    var adminroles   = JSON.stringify(item.adminroles);
				    	    var memberroles  = JSON.stringify(item.memberroles);
				    	    var app       = item.application;
				    	    var appscope  = item.appscope;
				    	    var templatename = item.templatename;
				    	    var syncmaster   = item.syncmaster;
				    	    var cluster      = item.cluster;
				       
						       mpDataForms.tables[tableid].addRow(tableid,1,9);
						       mpDataForms.tables[tableid].setCell(tableid,1,0,name);
						       mpDataForms.tables[tableid].setCell(tableid,1,1,app); 
						       mpDataForms.tables[tableid].setCell(tableid,1,2,appscope); 
						       mpDataForms.tables[tableid].setCell(tableid,1,3,requestroles); 
						       mpDataForms.tables[tableid].setCell(tableid,1,4,adminroles); 
						       mpDataForms.tables[tableid].setCell(tableid,1,5,memberroles); 
						       mpDataForms.tables[tableid].setCell(tableid,1,6,templatename); 
						       mpDataForms.tables[tableid].setCell(tableid,1,7,syncmaster); 
						       mpDataForms.tables[tableid].setCell(tableid,1,8,cluster); 

				     }
			  }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "policy", true);
			  window.location.hash = "/policy/"+policyid;
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+policyid); 
	}
	
	
	

	
policyController.prototype.add = function() {
	
    var self=this;	
    
		var formInputs = document.getElementsByClassName('MPTdropdownInput');
		if (formInputs[0].value != formInputs[0].prompt) {
		  var sendstring = 'name='+formInputs[0].value;
		  	  for (var i=1;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
				   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 1) {sendstring += '&application='+formInputs[i].value;}
				    if (i == 2) {sendstring += '&appscope='+formInputs[i].value;}
				    if (i == 3) {sendstring += '&templatename='+formInputs[i].value;}
				    if (i == 5) {sendstring += '&cluster='+formInputs[i].value;}
				   }
			      } else if (formInputs[i].tagName == 'SELECT') {
			    	  if (i == 4) {sendstring += '&syncmaster='+document.getElementById(formInputs[i].id).value;}
			    	  }
		      }
		  var req = newXMLHttpRequest(); 
		  req.onreadystatechange = getReadyStateHandler(req, 
			  function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") { 
					   self.bldform.resultBanner (true,'Policy Added Successfully');
					   self.getAll(); //refresh
					   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Policy Not Added ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Policy Not Added : Reason Not Specified');
				}
		       },self.session.logout);
		  req.open("POST", "_all_policies/add", true);
		  if (formInputs[0].value.length > 0) {
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send(sendstring);
		  }	
		  else {
			  self.bldform.resultBanner(false,'Policy Not Added: Blank identifier provided');
		  }	
	    } 
		else {  self.bldform.resultBanner(false,'Policy Not Added: No identifier provided'); 	}
	}
	
policyController.prototype.modify = function(policyid,name) {
	
    var self=this;	
    	
	      if (policyid.length > 0) {
		  var sendstring = "id="+policyid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 1) {sendstring += '&template='+formInputs[i].value;}
				    if (i == 3) {sendstring += '&cluster='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 2) {sendstring += '&syncmaster='+document.getElementById(formInputs[i].id).value;}
		      }
		  }
		  
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req,
			   function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") {
					   self.bldform.resultBanner (true,'Policy Changed Successfully');			   
					   self.get(policyid,name);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Policy Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Policy Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "policy/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}

policyController.prototype.modify_roles = function(policyid,name) {
	
    var self=this;	
    	
	      if (policyid.length > 0) {
		  var sendstring = "id="+policyid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
				   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 0) {sendstring += '&requestingroles='+formInputs[i].value;}
				    if (i == 1) {sendstring += '&adminroles='+formInputs[i].value;}
				    if (i == 2) {sendstring += '&memberroles='+formInputs[i].value;}
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
					   self.bldform.resultBanner (true,'Policy Changed Successfully');			   
					   self.get(policyid,name);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Policy Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Policy Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "policy/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}
	
policyController.prototype.remove = function(policyid,name) {
	
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
							   self.bldform.resultBanner (true,'Policy Removed Successfully');
							   self.getAll(); //refresh
						   }
						   else {
							if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
							self.bldform.resultBanner(false,'Policy Not Removed ' + reasontext);
						   }
						}
						else {
							self.bldform.resultBanner(false,'Policy Not Removed : Reason Not Specified');
						}
				      },self.session.logout);
				  req.open("POST", "policy/remove", true);
				  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
				  req.send("id="+policyid);
			  }
			  else {
				  self.bldform.resultBanner(false,'Policy Not Removed: Confirmation text is incorrect');
			  }
		  }
	}
	
