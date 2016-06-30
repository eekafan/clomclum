
function documentstoreController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

documentstoreController.prototype.getAll = function(appscope) {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		 var ssMenu = new secondsidebarMenu(); ssMenu.init();

		 var mpToolbar = new mainpanelToolbar();  mpToolbar.init();
		 mpToolbar.setBanner(appscope +' Documentstores');
		 mpToolbar.addOption('AddDocumentstore','addnewdocumentstore.png', 'Add Documentstore');
         mpToolbar.addOptionInput('AddDocumentstore','name','name','addPrompt','Please enter name for this documentstore');
         var appscopeChoice = new Array(0); appscopeChoice.push(appscope);
    	 mpToolbar.addOptionInput('AddDocumentstore','appscope','appscope','addChoice',appscopeChoice);	
		 mpToolbar.addOptionSubmit('AddDocumentstore','Create',function() {self.add()});
		 mpToolbar.setOptionClick('AddDocumentstore','addForm');
		 mpToolbar.addOption('DocumentstoreHelp','help.png', 'Documentstores Help');
		 mpToolbar.setOptionHelpfile('DocumentstoreHelp','help/documentstorehelp.html');
		 mpToolbar.addOptionSubmit('DocumentstoreHelp','Finish',function() {self.bldform.dropdownDestroyAll()});
		 mpToolbar.setOptionClick('DocumentstoreHelp','helpForm');  
		 
	     var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	     var tableid = 'mainPanelAllDocumentstores';
	     mpDataForms.addTable(tableid);
	     mpDataForms.tables[tableid].addHeader(tableid,1,4);
	     mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	     mpDataForms.tables[tableid].setCell(tableid,0,1,'DB Name');
	     mpDataForms.tables[tableid].setCell(tableid,0,2,'#Docs');
	     mpDataForms.tables[tableid].setCell(tableid,0,3,'Doc Limit');

		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req, 
	         function(response) {
			  
			    //handle loop closure environment
			     function get (appscope,documentstoreid,name) {
					 var thisFunction = function(){self.get(appscope,documentstoreid,name)};
					 return thisFunction;
				    } 
			     
		     var items = JSON.parse(response);		     
		     
		     for (var i in items) {
		         var documentstoreid = items[i]._id;
		         var appscope = items[i].scopetype;
		         var name = items[i].name;
		         var cluster = items[i].cluster;
		         var docstoreId = items[i].dbid;
		         var docnumber = 0;
		         var doclimit = items[i].doclimit;

		       mpDataForms.tables[tableid].addRow(tableid,parseInt(i) + 1,4);
		       mpDataForms.tables[tableid].setCellAsButton(tableid,parseInt(i) + 1,0,name,get(appscope,documentstoreid,name));
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,1,docstoreId); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,2,docnumber); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,3,doclimit); 

		     }
		    }, self.session.logout);
		  window.location.hash = "/_all_documentstores/"+appscope+"/";
		  req.open("POST", "_all_documentstores?appscope="+appscope, true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
documentstoreController.prototype.get = function (appscope,documentstoreid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		     ssToolbar.setLeftButtonClick(function() {self.getAll(appscope)});
		     ssToolbar.setBanner(name);
		 
			 ssToolbar.addAction('removeDocumentstore', 'Remove');
			 ssToolbar.setActionRemoveParameters('removeDocumentstore','Remove Documentstore','mainPanelDocumentstore',name,
			 'Please confirm removal of this documentstore from the Registry by typing its name in the box below and clicking on confirm', 'documentstore name');
			 ssToolbar.addActionCancel('removeDocumentstore','Cancel',
					 function() {ssDropdownResultBuild ('Failure','Documentstore Not Removed: Cancelled by User')});
			 ssToolbar.addActionSubmit('removeDocumentstore','Confirm',function() {self.remove(appscope,documentstoreid,name)});
			 ssToolbar.setActionClick('removeDocumentstore','removeForm');
		   
		     ssToolbar.addAction('modifyDocumentstore', 'Modify');
		     ssToolbar.setActionModifyParameters('modifyDocumentstore','Modify Documentstore', 'mainPanelDocumentstore',name, 1);
		     ssToolbar.addActionInput('modifyDocumentstore','syncmaster','syncmaster','modifyChoice',['registry','database'],7);
 	         ssToolbar.addActionSubmit('modifyDocumentstore','Save',function() {self.modify(appscope,documentstoreid,name)});
		     ssToolbar.setActionClick('modifyDocumentstore','modifyForm');
		     
		     ssToolbar.addAction('modifyRolesDocumentstore', 'Modify Roles');
		     ssToolbar.setActionModifyParameters('modifyRolesDocumentstore','Modify Documentstore Roles', 'mainPanelDocumentstorePermissions',name, 2);
		     ssToolbar.addActionInput('modifyRolesDocumentstore','adminroles','admin roles','modifyValue',null,0);
		     ssToolbar.addActionInput('modifyRolesDocumentstore','adminusers','admin users','modifyValue',null,1);
		     ssToolbar.addActionInput('modifyRolesDocumentstore','memberroles','member roles','modifyValue',null,2);
		     ssToolbar.addActionInput('modifyRolesDocumentstore','memberusers','member users','modifyValue',null,3);	
 	         ssToolbar.addActionSubmit('modifyRolesDocumentstore','Save',function() {self.modify_roles(appscope,documentstoreid,name)});
		     ssToolbar.setActionClick('modifyRolesDocumentstore','modifyForm');	
		     
		     ssToolbar.setRightButtonClick(function() {self.bldform.dropdownForm(ssToolbar.rightButton)});
		     
		     
		   var ssMenu = new secondsidebarMenu(); ssMenu.init();
		     ssMenu.addOption('DocumentstoreEdit','Edit','hasactions');
	     
		     ssMenu.options['DocumentstoreEdit'].addAction('modifyDocumentstore', 'Modify');
		     ssMenu.options['DocumentstoreEdit'].setActionModifyParameters('modifyDocumentstore','Modify Documentstore', 'mainPanelDocumentstore',name, 1);
		     ssMenu.options['DocumentstoreEdit'].addActionInput('modifyDocumentstore','syncmaster','syncmaster','modifyChoice',['registry','database'],7);
		     ssMenu.options['DocumentstoreEdit'].addActionSubmit('modifyDocumentstore','Save',function() {self.modify(appscope,documentstoreid,name)});	
		     ssMenu.options['DocumentstoreEdit'].setActionClick('modifyDocumentstore','modifyForm');
		     
		     ssMenu.options['DocumentstoreEdit'].addAction('modifyRolesDocumentstore', 'Modify Roles');  
		     ssMenu.options['DocumentstoreEdit'].setActionModifyParameters('modifyRolesDocumentstore','Modify Documentstore Roles', 'mainPanelDocumentstorePermissions',name, 2);
		     ssMenu.options['DocumentstoreEdit'].addActionInput('modifyRolesDocumentstore','adminroles','admin roles','modifyValue',null,0);
		     ssMenu.options['DocumentstoreEdit'].addActionInput('modifyRolesDocumentstore','adminusers','admin users','modifyValue',null,1);
		     ssMenu.options['DocumentstoreEdit'].addActionInput('modifyRolesDocumentstore','memberroles','member roles','modifyValue',null,2);
		     ssMenu.options['DocumentstoreEdit'].addActionInput('modifyRolesDocumentstore','memberusers','member users','modifyValue',null,3);
		     ssMenu.options['DocumentstoreEdit'].addActionSubmit('modifyRolesDocumentstore','Save',function() {self.modify_roles(appscope,documentstoreid,name)});
		     ssMenu.options['DocumentstoreEdit'].setActionClick('modifyRolesDocumentstore','modifyForm');	
		     ssMenu.options['DocumentstoreEdit'].setClick(function() {self.bldform.dropdownForm(ssMenu.options['DocumentstoreEdit'])});
		
		    var mpToolbar = new mainpanelToolbar(); mpToolbar.init();

	        var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	         var tableid = 'mainPanelDocumentstore';
	         mpDataForms.addTable(tableid);
	         mpDataForms.tables[tableid].addHeader(tableid,1,8);
	         mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	         mpDataForms.tables[tableid].setCell(tableid,0,1,'Scope');
	         mpDataForms.tables[tableid].setCell(tableid,0,2,'#Docs');
	         mpDataForms.tables[tableid].setCell(tableid,0,3,'DocLimit');
	         mpDataForms.tables[tableid].setCell(tableid,0,4,'Security Type');
	         mpDataForms.tables[tableid].setCell(tableid,0,5,'Cluster');
	         mpDataForms.tables[tableid].setCell(tableid,0,6,'DB name');
	         mpDataForms.tables[tableid].setCell(tableid,0,7,'Master for sync');
	         
	         mpDataForms.addSpacer(2);
	         
	         var table2 = 'mainPanelDocumentstorePermissions';
	         mpDataForms.addTable(table2);
	
	
		    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
	              function(response) {
					var item = JSON.parse(response);  
				     if (item != undefined) {
				    		var documentstoreid = item._id;
				    		var name = item.name;
				    		var appscope = item.scopetype;
					        var docnumber = 0;
					        var doclimit = item.doclimit;
				    		var securitytype = item.securitytype;
				    		var securityobject = item.securityobject;
				    		var cluster = item.cluster;
				    		var dbid = item.dbid;
				    		var syncmaster = item.syncmaster;

				       
						       mpDataForms.tables[tableid].addRow(tableid,1,8);
						       mpDataForms.tables[tableid].setCell(tableid,1,0,name);
						       mpDataForms.tables[tableid].setCell(tableid,1,1,appscope); 
						       mpDataForms.tables[tableid].setCell(tableid,1,2,docnumber); 
						       mpDataForms.tables[tableid].setCell(tableid,1,3,doclimit); 
						       mpDataForms.tables[tableid].setCell(tableid,1,4,securitytype); 
						       mpDataForms.tables[tableid].setCell(tableid,1,5,cluster); 
						       mpDataForms.tables[tableid].setCell(tableid,1,6,dbid); 
						       mpDataForms.tables[tableid].setCell(tableid,1,7,syncmaster); 
						       
						    	  if (securitytype == 'couchdb') {
						    		  mpDataForms.tables[table2].addHeader(table2,2,4); 
						    		  mpDataForms.tables[table2].setCell(table2,0,0,'Admin'); 
						    		  mpDataForms.tables[table2].setCell(table2,0,1,'Member');
						    		  mpDataForms.tables[table2].setCell(table2,1,0,'Roles'); 
						    		  mpDataForms.tables[table2].setCell(table2,1,1,'Users');
						    		  mpDataForms.tables[table2].setCell(table2,1,2,'Roles'); 
						    		  mpDataForms.tables[table2].setCell(table2,1,3,'Users');
							   		  
							   		var adminroles = "";var adminnames = "";var memberroles = "";var membernames = "";
								 	if (securityobject.admins.hasOwnProperty("roles"))  {var adminroles = JSON.stringify(securityobject.admins.roles);}
								   	if (securityobject.admins.hasOwnProperty("names"))  {var adminnames = JSON.stringify(securityobject.admins.names);}	
									if (securityobject.members.hasOwnProperty("roles"))  {var memberroles = JSON.stringify(securityobject.members.roles);} 
								    if (securityobject.members.hasOwnProperty("names"))  {var membernames = JSON.stringify(securityobject.members.names);}
										
									       mpDataForms.tables[table2].addRow(table2,2,4);
									       mpDataForms.tables[table2].setCell(table2,2,0,adminroles); 
									       mpDataForms.tables[table2].setCell(table2,2,1,adminnames); 
									       mpDataForms.tables[table2].setCell(table2,2,2,memberroles); 
									       mpDataForms.tables[table2].setCell(table2,2,3,membernames); 
						    	  }
						    	  
						 	   	 if (securitytype == 'dbaas') {
						 	   		  mpDataForms.tables[table2].addHeader(table2,1,6); 
						 	   		  mpDataForms.tables[table2].setCell(table2,0,0,'Username'); 
						 	   	      mpDataForms.tables[table2].setCell(table2,0,1,'Admin');
						 	          mpDataForms.tables[table2].setCell(table2,0,2,'Replicator'); 
						 	          mpDataForms.tables[table2].setCell(table2,0,3,'Reader');
						 	          mpDataForms.tables[table2].setCell(table2,0,4,'Writer'); 
						 	          mpDataForms.tables[table2].setCell(table2,0,5,'actions');

								     var keyindex = 0;
							         for (var key in item.securityobject) {	     
							           if (item.securityobject.hasOwnProperty(key)) {
							           var userpermissions = item.securityobject[key];
							           var p1 = ""; var p2 = ""; var p3 = ""; var p4 = "";
							           for (var i in userpermissions) {
							           if (userpermissions[i] = "_admin") { p1 = userpermissions[i];}
							           if (userpermissions[i] = "_replicator") { p2 = userpermissions[i];}
							           if (userpermissions[i] = "_reader") { p3 = userpermissions[i];}
							           if (userpermissions[i] = "_writer")  { p4 = userpermissions[i];}
							           }
							           var rowstyle;
							           if( (keyindex == 0) || (keyindex % 2 == 0)){ // accounting for header row
							        	   rowstyle = 'even'; 
							           } else { rowstyle = 'odd'; }
							           var tableindex = parseInt(keyindex + 1);
							           mpDataForms.tables[table2].addRow(table2,tableindex,4,rowstyle);
							           mpDataForms.tables[table2].setCell(table2,tableindex,0,key); 
							           mpDataForms.tables[table2].setCell(table2,tableindex,1,p1);
							           mpDataForms.tables[table2].setCell(table2,tableindex,2,p2); 
							           mpDataForms.tables[table2].setCell(table2,tableindex,3,p3); 
							           mpDataForms.tables[table2].setCell(tableid,tableindex,4,p4);  
							           keyindex++;
							           }
							         }
							      }
						    	  
				     }
			  }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "documentstore", true);
			  window.location.hash = "/documentstore/"+documentstoreid;
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+documentstoreid); 
	}
	
	
	

	
documentstoreController.prototype.add = function() {
	
    var self=this;	
    
		var formInputs = document.getElementsByClassName('MPTdropdownInput');
		if (formInputs[0].value != formInputs[0].prompt) {
		  var sendstring = 'name='+formInputs[0].value+'&app=ClomClum';
		  for (var i=1;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 1) {sendstring += '&appscope='+document.getElementById(formInputs[i].id).value;}
		      }
		  }
		  var req = newXMLHttpRequest(); 
		  req.onreadystatechange = getReadyStateHandler(req, 
			  function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") { 
					   self.bldform.resultBanner (true,'Documentstore Added Successfully');
					   self.getAll(); //refresh
					   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Documentstore Not Added ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Documentstore Not Added : Reason Not Specified');
				}
		       },self.session.logout);
		  req.open("POST", "_all_documentstores/add", true);
		  if (formInputs[0].value.length > 0) {
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send(sendstring);
		  }	
		  else {
			  self.bldform.resultBanner(false,'Documentstore Not Added: Blank identifier provided');
		  }	
	    } 
		else {  self.bldform.resultBanner(false,'Documentstore Not Added: No identifier provided'); 	}
	}
	
documentstoreController.prototype.modify = function(appscope,documentstoreid,name) {
	
    var self=this;	
    	
	      if (documentstoreid.length > 0) {
		  var sendstring = "id="+documentstoreid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				   
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 0) {sendstring += '&syncmaster='+document.getElementById(formInputs[i].id).value;}
		      }
		  }
		  
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req,
			   function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") {
					   self.bldform.resultBanner (true,'Documentstore Changed Successfully');			   
					   self.get(appscope,documentstoreid,name);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Documentstore Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Documentstore Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "documentstore/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}

documentstoreController.prototype.modify_roles = function(appscope,documentstoreid,name) {
	
    var self=this;	
    	
	      if (documentstoreid.length > 0) {
		  var sendstring = "id="+documentstoreid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 0) {sendstring += '&adminroles='+formInputs[i].value;}
				    if (i == 1) {sendstring += '&adminnames='+formInputs[i].value;}
				    if (i == 2) {sendstring += '&memberroles='+formInputs[i].value;}
				    if (i == 3) {sendstring += '&membernames='+formInputs[i].value;}				   
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
					   self.bldform.resultBanner (true,'Documentstore Roles Changed Successfully');			   
					   self.get(appscope,documentstoreid,name);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Documentstore Roles Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Documentstore Roles Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "documentstore/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}
	
documentstoreController.prototype.remove = function(appscope,documentstoreid,name) {
	
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
							   self.bldform.resultBanner (true,'Documentstore Removed from Registry Successfully');
							   self.getAll(appscope); 
						   }
						   else {
							if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
							self.bldform.resultBanner(false,'Documentstore Not Removed ' + reasontext);
						   }
						}
						else {
							self.bldform.resultBanner(false,'Documentstore Not Removed from Registry: Reason Not Specified');
						}
				      },self.session.logout);
				  req.open("POST", "documentstore/unmanage", true);
				  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
				  req.send("id="+documentstoreid);
			  }
			  else {
				  self.bldform.resultBanner(false,'Documentstore Not Removed from Registry: Confirmation text is incorrect');
			  }
		  }
	}
	
