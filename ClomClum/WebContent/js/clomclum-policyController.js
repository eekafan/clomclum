
function policyController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

policyController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var mpToolbar = new mainpanelToolbar({
			 banner:'Policies',
			 options: [{id:'AddPolicy',icon:'addnewpolicy.png', 
				        clickform: {type: 'addForm', parameters: {
				          header:'Add Policy',
			              submit:{label:'Create',onclick:function(){self.add();}},
	                      inputs:[{id:'name',label:'id',prompt:'Please enter name for this policy'},
	                              {id:'application',label:'application',prompt:'Enter application where this policy applies'},
	                              {id:'appscope',label:'appscope',prompt:'Enter application scope where this policy applies'},
	                              {id:'templatename',label:'template',prompt:'Enter template to use when this policy applies'},
                                  {id:'syncmaster',label:'master for sync',choices:['registry', 'database']},
                                  {id:'cluster',label:'cluster',prompt:'Enter cluster to place docstores when policy fires'}]
				        }}},
			           {id:'PolicyHelp',icon:'help.png', 
	                    clickform: {type: 'helpForm', parameters: {
	                        header:'Policies Help', 
	                        submit:{label:'Finish'}, helpfile: 'help/policyhelp.html'}}
			            }]});	 
			 mpToolbar.load();
			 
			 var mpDataForms = new mainpanelDataForms({
			    	 tables: [{id:'mainPanelAllPolicies', 
			    		 header: [{titles:['Name','Requesting App','Requesting AppScope','Requesting Roles',
			    		                   'Assign Admin Roles','Assign Member Roles','Use Template','master on Sync','Place on Cluster']}],rows: []}]
			    	         });
		 
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

				      mpDataForms.addRow('mainPanelAllPolicies',
			                   {cells : [{type: 'button', text: name, onclick: get(policyid,name)},
	                                     {type: 'text'  , text: app},
	                                     {type: 'text'  , text: appscope},
	                                     {type: 'text'  , text: requestroles},
	                                     {type: 'text'  , text: adminroles},
	                                     {type: 'text'  , text: memberroles},
	                                     {type: 'text'  , text: templatename},
	                                     {type: 'text'  , text: syncmaster},
	                                     {type: 'text'  , text: cluster}]
			                   });
		     }
		     mpDataForms.load();
		    }, self.session.logout);
		  window.location.hash = "/_all_policies";
		  req.open("POST", "_all_policies", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
policyController.prototype.get = function (policyid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   
		   var ssToolbar = new secondsidebarToolbar({
			     leftbutton: {onclick:function() {self.getAll()}},
				 banner:name,
				 rightbutton: { id:'Toolbar',
					            actions: [{id:'removePolicy', label:'Remove', 
					            	       clickform:{type: 'removeForm', parameters : { 
					                    	   header:'Remove Policy',currentdata:'mainPanelPolicy',removeobject:name, inputlabel:'policy name',
					                       warning:'Please confirm removal of this policy from the Registry by typing its name in the box below and clicking on confirm',
					                           submit:{label:'Confirm', onclick: function() {self.remove(policyid,name);}},
				                               cancel:{label:'Cancel',text:'Cluster Not Removed: Cancelled by User'}}}},
					                      {id:'modifyPolicy', label:'Modify', 
						                    clickform:{type: 'modifyForm', parameters : { 
									            header:'Modify Policy',currentdata:'mainPanelPolicy',modifyobject:name, currentrow: 1,
									            submit:{label:'Save', onclick: function() {self.modify(policyid,name);}},
								                inputs: [{id: 'template', label: 'template', type: 'modifyValue', data: null, currentindex: 6},
								                         {id: 'syncmaster', label: 'master for sync', type: 'modifyChoice', data: ['registry', 'database'], currentindex: 7},
								                         {id: 'cluster', label: 'place on cluster', type: 'modifyValue', data: null, currentindex: 8}
								                         ]}}},								                         
				                           {id:'modifyPolicyRoles', label:'Modify Roles', 
				                            clickform:{type: 'modifyForm', parameters : { 
							                   header:'Modify Policy Roles',currentdata:'mainPanelPolicy',modifyobject:name, currentrow: 1,
							                   submit:{label:'Save', onclick: function() {self.modify_roles(policyid,name);}},
						                       inputs: [{id: 'requestingroles', label: 'requesting roles', type: 'modifyValue', data: null, currentindex: 3},
						                                {id: 'adminroles', label: 'assign admin roles', type: 'modifyValue', data: null, currentindex: 4},
						                                {id: 'memberroles', label: 'assign member roles', type: 'modifyValue', data: null, currentindex: 5}
						                                ]}}}]
				              }});	  
		   ssToolbar.load();
		   
	
		   var ssMenu = new secondsidebarMenu({
	           options: [{id:'ClusterEdit',label: 'Edit', 
		            actions: [{id:'removePolicy', label:'Remove', 
	            	       clickform:{type: 'removeForm', parameters : { 
	                    	   header:'Remove Policy',currentdata:'mainPanelPolicy',removeobject:name, inputlabel:'policy name',
	                       warning:'Please confirm removal of this policy from the Registry by typing its name in the box below and clicking on confirm',
	                           submit:{label:'Confirm', onclick: function() {self.remove(policyid,name);}},
                            cancel:{label:'Cancel',text:'Cluster Not Removed: Cancelled by User'}}}},
	                      {id:'modifyPolicy', label:'Modify', 
		                    clickform:{type: 'modifyForm', parameters : { 
					            header:'Modify Policy',currentdata:'mainPanelPolicy',modifyobject:name, currentrow: 1,
					            submit:{label:'Save', onclick: function() {self.modify(policyid,name);}},
				                inputs: [{id: 'template', label: 'template', type: 'modifyValue', data: null, currentindex: 6},
				                         {id: 'syncmaster', label: 'master for sync', type: 'modifyChoice', data: ['registry', 'database'], currentindex: 7},
				                         {id: 'cluster', label: 'place on cluster', type: 'modifyValue', data: null, currentindex: 8}
				                         ]}}},								                         
                          {id:'modifyPolicyRoles', label:'Modify Roles', 
                            clickform:{type: 'modifyForm', parameters : { 
			                   header:'Modify Policy Roles',currentdata:'mainPanelPolicy',modifyobject:name, currentrow: 1,
			                   submit:{label:'Save', onclick: function() {self.modify_roles(policyid,name);}},
		                       inputs: [{id: 'requestingroles', label: 'requesting roles', type: 'modifyValue', data: null, currentindex: 3},
		                                {id: 'adminroles', label: 'assign admin roles', type: 'modifyValue', data: null, currentindex: 4},
		                                {id: 'memberroles', label: 'assign member roles', type: 'modifyValue', data: null, currentindex: 5}
		                                ]}}}]
	                     }]});
	       ssMenu.load();
	       
		
			var mpToolbar = new mainpanelToolbar({ banner:'' });
			mpToolbar.load();

			 var mpDataForms = new mainpanelDataForms({
		    	 tables: [{id:'mainPanelPolicy', 
		    		 header: [{titles:['Name','Requesting App','Requesting AppScope','Requesting Roles',
		    		                   'Assign Admin Roles','Assign Member Roles','Use Template','master on Sync','Place on Cluster']}],rows: []}]
		    	         });
		
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
				    	    
						      mpDataForms.addRow('mainPanelPolicy',
					                   {cells : [{type: 'text', text: name},
			                                     {type: 'text'  , text: app},
			                                     {type: 'text'  , text: appscope},
			                                     {type: 'text'  , text: requestroles},
			                                     {type: 'text'  , text: adminroles},
			                                     {type: 'text'  , text: memberroles},
			                                     {type: 'text'  , text: templatename},
			                                     {type: 'text'  , text: syncmaster},
			                                     {type: 'text'  , text: cluster}]
					                   });			       
	
				     }
				     mpDataForms.load();
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
	
