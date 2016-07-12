
function documentstoreController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

documentstoreController.prototype.getAll = function(appscope) {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
	
		 var appscopeChoice = new Array(0); appscopeChoice.push(appscope);
		 var mpToolbar = new mainpanelToolbar({
			 banner: appscope + ' Document Stores',
			 options: [{id:'AddDocumentstore',icon:'addnewdocumentstore.png', 
				        clickform: {type: 'addForm', parameters: {
				          header:'Add Documentstore',
			              submit:{label:'Create',onclick:function(){self.add();}},
	                      inputs:[{id:'name',label:'name',prompt:'Please enter name for this documentstore'},
	                              {id:'appscope',label:'scope',choices:appscopeChoice},
                                  {id:'clustertype',label:'clustertype',choices:['cloudant-dbaas', 'cloudant-local']},
                                  {id:'securitytype',label:'securitytype',choices:['dbaas', 'couchdb']},
                                  {id:'version',label:'version',prompt:'Please enter software version for this cluster'}]
				        }}},
			           {id:'DocumentstoreHelp',icon:'help.png', 
	                    clickform: {type: 'helpForm', parameters: {
	                        header:'Documentstore Help', 
	                        submit:{label:'Finish'}, helpfile: 'help/documentstorehelp.html'}}
			            }]});	 
			 mpToolbar.load();


	     var mpDataForms = new mainpanelDataForms({
			    	 tables: [{id:'mainPanelAllDocumentstores', 
			    		 header: [{titles:['Name','DB name','#Docs','Doc Limit']}],rows: []}]
			    	         });

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
		         
			      mpDataForms.addRow('mainPanelAllDocumentstores',
		                   {cells : [{type: 'button', text: name, onclick: get(appscope,documentstoreid,name)},
                                    {type: 'text'  , text: docstoreId},
                                    {type: 'text'  , text: docnumber},
                                    {type: 'text'  , text: doclimit}]                              
		                   });
		     }
		     mpDataForms.load();
		    }, self.session.logout);
		  window.location.hash = "/_all_documentstores/"+appscope+"/";
		  req.open("POST", "_all_documentstores?appscope="+appscope, true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
documentstoreController.prototype.get = function (appscope,documentstoreid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   
		   var ssToolbar = new secondsidebarToolbar({
			     leftbutton: {onclick:function() {self.getAll(appscope)}},
				 banner: name,
				 rightbutton: { id:'Toolbar',
					            actions: [{id:'removeDocumentstore', label:'Remove', 
					            	       clickform:{type: 'removeForm', parameters : { 
					                    	   header:'Remove Documentstore',currentdata:'mainPanelDocumentstore',removeobject:name, inputlabel:'documentstore name',
					                       warning:'Please confirm removal of this documentstore from the Registry by typing its name in the box below and clicking on confirm',
					                           submit:{label:'Confirm', onclick: function() {self.remove(appscope,documentstoreid,name);}},
				                               cancel:{label:'Cancel',text:'Documentstore Not Removed: Cancelled by User'}}}},
				                           {id:'modifyDocumentstore', label:'Modify', 
				                            clickform:{type: 'modifyForm', parameters : { 
							                   header:'Modify Documentstore',currentdata:'mainPanelDocumentstore',modifyobject:name, currentrow: 1,
							                   submit:{label:'Save', onclick: function() {self.modify(appscope,documentstoreid,name);}},
						                       inputs: [{id: 'syncmaster', label: 'syncmaster', type: 'modifyChoice', data: ['registry','database'], currentindex: 7}
						                       ]}}},
								           {id:'modifyRolesDocumentstore', label:'Modify Roles', 
						                     clickform:{type: 'modifyForm', parameters : { 
									            header:'Modify Documentstore',currentdata:'mainPanelDocumentstorePermissions',modifyobject:name, currentrow: 2,
									            submit:{label:'Save', onclick: function() {self.modify_roles(appscope,documentstoreid,name);}},
								                inputs: [{id: 'adminroles', label: 'admin roles', type: 'modifyValue', data: null, currentindex: 0},
								                         {id: 'adminusers', label: 'admin users', type: 'modifyValue', data: null, currentindex: 1},
								                         {id: 'memberroles', label: 'member roles', type: 'modifyValue', data: null, currentindex: 2},
								                         {id: 'memberusers', label: 'member users', type: 'modifyValue', data: null, currentindex: 3}
						                       ]}}}]
				               }});	  
		   ssToolbar.load();
		   
		   var ssMenu = new secondsidebarMenu({
	           options: [{id:'ClusterEdit',label: 'Edit', 
	        	          actions: [{id:'modifyDocumentstore', label:'Modify', 
	                                  clickform:{type: 'modifyForm', parameters : { 
					                   header:'Modify Documentstore',currentdata:'mainPanelDocumentstore',modifyobject:name, currentrow: 1,
					                   submit:{label:'Save', onclick: function() {self.modify(appscope,documentstoreid,name);}},
				                       inputs: [{id: 'syncmaster', label: 'syncmaster', type: 'modifyChoice', data: ['registry','database'], currentindex: 7}
				                       ]}}},
						            {id:'modifyRolesDocumentstore', label:'Modify Roles', 
				                     clickform:{type: 'modifyForm', parameters : { 
							            header:'Modify Documentstore',currentdata:'mainPanelDocumentstorePermissions',modifyobject:name, currentrow: 2,
							            submit:{label:'Save', onclick: function() {self.modify_roles(appscope,documentstoreid,name);}},
						                inputs: [{id: 'adminroles', label: 'admin roles', type: 'modifyValue', data: null, currentindex: 0},
						                         {id: 'adminusers', label: 'admin users', type: 'modifyValue', data: null, currentindex: 1},
						                         {id: 'memberroles', label: 'member roles', type: 'modifyValue', data: null, currentindex: 2},
						                         {id: 'memberusers', label: 'member users', type: 'modifyValue', data: null, currentindex: 3}
				                                ]}}}]},
				          {id:'DocumentstoreSettings', label: 'Settings', onclick: function() {self.get(appscope,documentstoreid,name)}},
	                     ]});
	       ssMenu.load();
		     
		
			var mpToolbar = new mainpanelToolbar({ banner:'' });
			mpToolbar.load();
		
			var mpDataForms = new mainpanelDataForms({
			    	 tables: [{id:'mainPanelDocumentstore', 
			    		 header: [{titles:['Name','Scope','#Docs','Doc Limit','Security Type','Cluster','DB name','Master for sync']}],rows: [], spacer:{rows:2}},
			    		      {id:'mainPanelDocumentstorePermissions',
			    	     header: [],rows:[]}
			    		     ]});

	
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

						      mpDataForms.addRow('mainPanelDocumentstore',
					                   {cells : [{type: 'text'  , text: name},
			                                     {type: 'text'  , text: appscope},
			                                     {type: 'text'  , text: docnumber},
			                                     {type: 'text'  , text: doclimit},
			                                     {type: 'text'  , text: securitytype},
			                                     {type: 'text'  , text: cluster},
			                                     {type: 'text'  , text: dbid},
			                                     {type: 'text'  , text: syncmaster}]
					                   });
						      
						       
						    	  if (securitytype == 'couchdb') {
						    		  mpDataForms.content.tables[1].header = [{titles:['Admin','Member']},
						    		                                  {titles: ['Roles','Users','Roles','Users']}];
							   		  
							   		var adminroles = "";var adminnames = "";var memberroles = "";var membernames = "";
								 	if (securityobject.admins.hasOwnProperty("roles"))  {var adminroles = JSON.stringify(securityobject.admins.roles);}
								   	if (securityobject.admins.hasOwnProperty("names"))  {var adminnames = JSON.stringify(securityobject.admins.names);}	
									if (securityobject.members.hasOwnProperty("roles"))  {var memberroles = JSON.stringify(securityobject.members.roles);} 
								    if (securityobject.members.hasOwnProperty("names"))  {var membernames = JSON.stringify(securityobject.members.names);}
								      
								    mpDataForms.addRow('mainPanelDocumentstorePermissions',
							                   {cells : [{type: 'text'  , text: adminroles},
					                                     {type: 'text'  , text: adminnames},
					                                     {type: 'text'  , text: memberroles},
					                                     {type: 'text'  , text: membernames}]
							                   });								
						    	  }
						    	  
						 	   	 if (securitytype == 'dbaas') {
						    		  mpDataForms.content.tables[1].header = [{titles: ['User','Admin','Replicator','Reader','Writer','actions']}];	

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
									    mpDataForms.addRow('mainPanelDocumentstorePermissions',
								                   {cells : [{type: 'text'  , text: key},
						                                     {type: 'text'  , text: p1},
						                                     {type: 'text'  , text: p2},
						                                     {type: 'text'  , text: p3},
						                                     {type: 'text'  , text: p4}]
								                   });	
							           }
							         }
							      }   
						 	   	 mpDataForms.load();
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
	
