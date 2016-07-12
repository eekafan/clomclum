
function clusterController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

clusterController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();

		 var mpToolbar = new mainpanelToolbar({
			 banner:'Clusters',
			 options: [{id:'AddCluster',icon:'addnewcluster.png', 
				        clickform: {type: 'addForm', parameters: {
				          header:'Add Cluster',
			              submit:{label:'Create',onclick:function(){self.add();}},
	                      inputs:[{id:'id',label:'id',prompt:'Please enter name for this cluster'},
	                              {id:'url',label:'url',prompt:'Please enter url for this cluster'},
                                  {id:'clustertype',label:'clustertype',choices:['cloudant-dbaas', 'cloudant-local']},
                                  {id:'securitytype',label:'securitytype',choices:['dbaas', 'couchdb']},
                                  {id:'version',label:'version',prompt:'Please enter software version for this cluster'}]
				        }}},
			           {id:'ClusterHelp',icon:'help.png', 
	                    clickform: {type: 'helpForm', parameters: {
	                        header:'Clusters Help', 
	                        submit:{label:'Finish'}, helpfile: 'help/clusterhelp.html'}}
			            }]});	 
			 mpToolbar.load();


		  var mpDataForms = new mainpanelDataForms({
		    	 tables: [{id:'mainPanelAllClusters', 
		    		 header: [{titles:['Name','url','Type','Security','Version']}],rows: []}]
		    	         });
		 
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req, 
	         function(response) {
			  
			    //handle loop closure environment
			     function get (clusterid) {
					 var thisFunction = function(){self.get(clusterid)};
					 return thisFunction;
				    } 
			     
		     var items = JSON.parse(response);		     
		     
		     for (var i in items) {
		       var clusterid = items[i]._id;
		       var url       = items[i].url;
		       var type      = items[i].clustertype;
		       var security  = items[i].securitytype;
		       var version   = items[i].version;
		       
			      mpDataForms.addRow('mainPanelAllClusters',
		                   {cells : [{type: 'button', text: clusterid, onclick: get(clusterid)},
                                     {type: 'text'  , text: url},
                                     {type: 'text'  , text: type},
                                     {type: 'text'  , text: security},
                                     {type: 'text'  , text: version}]
		                   });
                  }
                  mpDataForms.load();
		    }, self.session.logout);
		  window.location.hash = "/_all_clusters";
		  req.open("POST", "_all_clusters", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
clusterController.prototype.get = function (clusterid) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   
		   var ssToolbar = new secondsidebarToolbar({
			     leftbutton: {onclick:function() {self.getAll()}},
				 banner:clusterid,
				 rightbutton: { id:'Toolbar',
					            actions: [{id:'removeCluster', label:'Remove', 
					            	       clickform:{type: 'removeForm', parameters : { 
					                    	   header:'Remove Cluster',currentdata:'mainPanelCluster',removeobject:clusterid, inputlabel:'cluster name',
					                       warning:'Please confirm removal of this cluster from the Registry by typing its name in the box below and clicking on confirm',
					                           submit:{label:'Confirm', onclick: function() {self.remove(clusterid);}},
				                               cancel:{label:'Cancel',text:'Cluster Not Removed: Cancelled by User'}}}},
				                           {id:'modifyCluster', label:'Modify', 
				                            clickform:{type: 'modifyForm', parameters : { 
							                   header:'Modify Cluster',currentdata:'mainPanelCluster',modifyobject:clusterid, currentrow: 1,
							                   submit:{label:'Save', onclick: function() {self.modify(clusterid);}},
						                       inputs: [{id: 'url', label: 'url', type: 'modifyValue', data: null, currentindex: 1},
						                                {id: 'clustertype', label: 'url', type: 'modifyChoice', data: ['cloudant-dbaas', 'cloudant-local'], currentindex: 2},
						                                {id: 'securitytype', label: 'securitytype', type: 'modifyChoice', data: ['dbaas', 'couchdb'], currentindex: 3},
						                                {id: 'version', label: 'software version', type: 'modifyValue', data: null, currentindex: 4}
						                                ]}}}]
				 }});	  
		   ssToolbar.load();
		     
		   var ssMenu = new secondsidebarMenu({
	           options: [{id:'ClusterEdit',label: 'Edit', 
	        	          actions: [{id:'modifyCluster', label:'Modify', 
	                            clickform:{type: 'modifyForm', parameters : { 
					                   header:'Modify Cluster',currentdata:'mainPanelCluster',modifyobject:clusterid, currentrow: 1,
					                   submit:{label:'Save', onclick: function() {self.modify(clusterid);}},
				                       inputs: [{id: 'url', label: 'url', type: 'modifyValue', data: null, currentindex: 1},
				                                {id: 'clustertype', label: 'url', type: 'modifyChoice', data: ['cloudant-dbaas', 'cloudant-local'], currentindex: 2},
				                                {id: 'securitytype', label: 'securitytype', type: 'modifyChoice', data: ['dbaas', 'couchdb'], currentindex: 3},
				                                {id: 'version', label: 'software version', type: 'modifyValue', data: null, currentindex: 4}
				                                ]}}}]},
				          {id:'ClusterSyncSecurity', label: 'Sync Security', onclick: function() {self.syncSecurity(clusterid)}},
				          {id:'ClusterSyncDesign', label: 'Sync Design', onclick: function() {self.syncDesign(clusterid)}},
				          {id:'ClusterManaged', label: 'Managed Document Stores', onclick: function() {self.getDocumentstores(clusterid,'managed')}},
				          {id:'ClusterUnmanaged', label: 'Unmanaged Document Stores', onclick: function() {self.getDocumentstores(clusterid,'unmanaged')}},
				          {id:'ClusterSettings', label: 'Settings', onclick: function() {self.get(clusterid)}},
	                     ]});
	       ssMenu.load();
		     
			var mpToolbar = new mainpanelToolbar({ banner:'' });
			mpToolbar.load();
		
			var mpDataForms = new mainpanelDataForms({
			    	 tables: [{id:'mainPanelCluster', 
			    		 header: [{titles:['Name','url','Type','Security','Version']}],rows: []}]
			    	         });
			  
			  
		    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
	              function(response) {
					var item = JSON.parse(response);  
				     if (item != undefined) {
				       var clusterid = item._id;
				       var url       = item.url;
				       var type      = item.clustertype;
				       var security  = item.securitytype;
				       var version   = item.version;
				       
					      mpDataForms.addRow('mainPanelCluster',
				                   {cells : [{type: 'button', text: clusterid, onclick: function(){self.getDocumentstores(clusterid,'managed')}},
		                                     {type: 'text'  , text: url},
		                                     {type: 'text'  , text: type},
		                                     {type: 'text'  , text: security},
		                                     {type: 'text'  , text: version}]
				                   });
				     }
				     mpDataForms.load();		  
			  }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "cluster", true);
			  window.location.hash = "/cluster/"+clusterid;
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+clusterid); 
	}
	
	
	
clusterController.prototype.syncSecurity = function(clusterid){

	var self=this;	   
			
	    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
				  function(response) {
		
					var reasontext;4
					var reply = JSON.parse(response);
					if (reply.hasOwnProperty('result')) {
					   if (reply.result == "Success") { 
						   self.bldform.resultBanner (true,'Cluster Sync Security Successful');
						   }
					   else {
						if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
						self.bldform.resultBanner(false,'Sync operation Problems ' + reasontext);
					   }
					}
					else {
						self.bldform.resultBanner(false,'Sync operation Problems : Reason Not Specified');
					}
			       }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "cluster/syncsecurity", true);
			  window.location.hash = "/cluster/"+clusterid+"/syncsecurity";
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+clusterid);   
	}


clusterController.prototype.syncDesign = function(clusterid){		
	
    var self=this;	
  
	    var req = newXMLHttpRequest();
			  var handlerFunction = getReadyStateHandler(req, 
				  function(response) {
					var reasontext;
					var reply = JSON.parse(response);
					if (reply.hasOwnProperty('result')) {
					   if (reply.result == "Success") {
						   self.bldform.resultBanner (true,'Cluster Sync Design Successful');
						   }
					   else {
						if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
						self.bldform.resultBanner(false,'Sync operation Problems ' + reasontext);
					   }
					}
					else {
						self.bldform.resultBanner(false,'Failure','Sync operation Problems : Reason Not Specified');
					}
			      }, self.session.logout);
			  req.onreadystatechange = handlerFunction;
			  req.open("POST", "cluster/syncdesign", true);
			  window.location.hash = "/cluster/"+clusterid+"/syncdesign";
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send("id="+clusterid);   
	}


clusterController.prototype.getDocumentstores = function (clusterid,managedstatus){
	
    var self=this;	
  	
		function handleResponse_cluster_documentstores_managed(response) {
			
	               function getDocumentstore (appscope,documentstoreid,name) {
	                   var thisDocumentstoreController = new documentstoreController();
						 var thisFunction = function(){thisDocumentstoreController.get(appscope,documentstoreid,name)};
						 return thisFunction;
				    }
			 
			      var items = JSON.parse(response);		
					for (var i in items) { // response is a list of documentstores
						if (items[i]._id != undefined) {
					       var documentstoreid   = items[i]._id;
					       var appscope = items[i].scopetype;
					       var dbid     = items[i].dbid;
					       var name     = items[i].name;
					       var cluster  = items[i].cluster;
					       
						      mpDataForms.addRow('mainPanelClusterDocuments',
					                   {cells : [{type: 'button', text: name, onclick: getDocumentstore(appscope,documentstoreid,name)},
			                                     {type: 'text'  , text: dbid}]
					                   });
					   }
					}
					mpDataForms.load();
		 }

		 function handleResponse_cluster_documentstores_unmanaged(response) {
			
		            function getDocumentstore (appscope,documentstoreid,name) {
		             var thisDocumentstoreController = new documentstoreController();
					 var thisFunction = function(){thisDocumentstoreController.get(appscope,documentstoreid,name)};
					 return thisFunction;
				    }
		            function manageDocumentstore (clusterid,dbid) {
					 var thisFunction = function(){self.manageDocumentstore(clusterid,dbid)};
					 return thisFunction;
				    }
			
			      var items = JSON.parse(response)		
					for (var i in items) { // response is a list of documentstores
	
							if (items[i]._id != undefined) { // entry already exists in registry but store is unmanaged
								  var documentstoreid   = items[i]._id;
								   var appscope = items[i].scopetype;
							       var dbid     = items[i].dbid;
							       var name     = items[i].name;
							       var cluster  = items[i].cluster;
								      mpDataForms.addRow('mainPanelClusterDocuments',
							                   {cells : [{type: 'button', text: name, onclick: getDocumentstore(appscope,documentstoreid,name)},
					                                     {type: 'text'  , text: dbid}]
							                   });
							        if (dbid.charAt(0) != '_') {
							        }
							 } else { // no entry in registry so add a new one
								    var dbid = items[i].dbid;	  
							        if (items[i].dbid.charAt(0) != '_') {
							        	  var clusterchoices = new Array(0); clusterchoices.push(clusterid);
							        	  var dbchoices = new Array(0); dbchoices.push(dbid);
									      mpDataForms.addRow('mainPanelClusterDocuments',
								                   {cells : [{type: 'text', text: ''},
						                                     {type: 'text', text: dbid},
						                                     {type: 'action', 
						                                		 action: {id:'ManageDocumentstore', label:'Manage',
						                     				        clickform: {type: 'addForm', parameters: {
						                     				          header:'Manage Documentstore',
						                     			              submit:{label:'Save',onclick:manageDocumentstore(clusterid,dbid)},
						                     	                      inputs:[{id:'cluster',label:'cluster',choices:clusterchoices},
						                     	                              {id:'db',label:'db',choices:dbchoices},
						                                                       {id:'appscope',label:'scope',choices:['Personal', 'Team', 'Enterprise']},
						                                                       {id:'adminroles',label:'admin roles',prompt:'Please enter admin roles in format \[\"role1\",\"role2\",...\]'},
						                                                       {id:'memberroles',label:'member roles',prompt:'Please enter member roles in format \[\"role1\",\"role2\",...\]'}   				         
						                                                      ]}}}}
						                            ]});
								    }
							  }
		          }
			      mpDataForms.load();
		 }
		
		var responseFunction;
        var mpToolbar;
	
		var mpDataForms; 

	    if (managedstatus == 'managed') {		
	    	    mpToolbar = new mainpanelToolbar({ banner:'Managed Document Stores' });
		        mpToolbar.load();
		        mpDataForms= new mainpanelDataForms({
			    	 tables: [{id:'mainPanelClusterDocuments', 
			    		 header: [{titles:['Name','Id']}],rows: []}]
			    	         });
			    responseFunction = handleResponse_cluster_documentstores_managed;
	    } 
	    if (managedstatus == 'unmanaged') {
    	    mpToolbar = new mainpanelToolbar({ banner:'Managed Document Stores' });
	        mpToolbar.load();
	        mpDataForms= new mainpanelDataForms({
		    	 tables: [{id:'mainPanelClusterDocuments', 
		    		 header: [{titles:['Name','Id','Actions']}],rows: []}]
		    	         });
		        responseFunction = handleResponse_cluster_documentstores_unmanaged;
		  }
		  
	      var req = newXMLHttpRequest();
		  var handlerFunction = getReadyStateHandler(req, responseFunction, self.session.logout);
		  req.onreadystatechange = handlerFunction;
		  req.open("POST", "cluster/documentstores", true);
		  window.location.hash = "/cluster/"+clusterid+"/documentstores?managedstatus="+managedstatus;
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("id="+clusterid+"&managedstatus="+managedstatus);   
	}
	

	
clusterController.prototype.add = function() {
	
    var self=this;	
    
		var formInputs = document.getElementsByClassName('MPTdropdownInput');
		if (formInputs[0].value != formInputs[0].prompt) {
		  var sendstring = 'id='+formInputs[0].value;
		  for (var i=1;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
			    if (i == 1) {sendstring += '&url='+formInputs[i].value;}
			    if (i == 4) {sendstring += '&version='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 2) {sendstring += '&clustertype='+document.getElementById(formInputs[i].id).value;}
		    	  if (i == 3) {sendstring += '&securitytype='+document.getElementById(formInputs[i].id).value;}
		      }
		  }
		  var req = newXMLHttpRequest(); 
		  req.onreadystatechange = getReadyStateHandler(req, 
			  function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") { 
					   self.bldform.resultBanner (true,'Cluster Added Successfully');
					   self.getAll(); //refresh
					   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Cluster Not Added ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Cluster Not Added : Reason Not Specified');
				}
		       },self.session.logout);
		  req.open("POST", "_all_clusters/add", true);
		  if (formInputs[0].value.length > 0) {
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send(sendstring);
		  }	
		  else {
			  self.bldform.resultBanner(false,'Cluster Not Added: Blank identifier provided');
		  }	
	    } 
		else {  self.bldform.resultBanner(false,'Cluster Not Added: No identifier provided'); 	}
	}
	
clusterController.prototype.manageDocumentstore = function(clusterid,dbid) {
	
    var self=this;	
    
		var formInputs = document.getElementsByClassName('MPTdropdownInput');
		  var sendstring = 'clusterid='+clusterid+'&dbid='+dbid;
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
				    if (i == 2) {sendstring += '&name='+formInputs[i].value;}
				    if (i == 4) {sendstring += '&adminroles='+formInputs[i].value;}
				    if (i == 5) {sendstring += '&memberroles='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 3) {sendstring += '&appscope='+document.getElementById(formInputs[i].id).value;}
		      }
		  }

		  var req = newXMLHttpRequest(); 
		  req.onreadystatechange = getReadyStateHandler(req, 
			  function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") { 
					   self.bldform.resultBanner (true,'Cluster Documentstore Taken into Management Successfully');
					   self.getAll(); //refresh
					   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Cluster Documentstore Not Taken into Management ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Cluster Documentstore Not Taken into Management : Reason Not Specified');
				}
		       },self.session.logout);
		  req.open("POST", "documentstore/manage", true);
		  window.location.hash="/cluster/"+document.getElementById(formInputs[0].id).value+"/documentstore/"+document.getElementById(formInputs[1].id).value+"/manage";
		  if (formInputs[0].value.length > 0) {
			  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
			  req.send(sendstring);
		  }	
		  else {
			  self.bldform.resultBanner(false,'Cluster Documentstore Not Taken into Management: Blank identifier provided');
		  }	
	}
	
clusterController.prototype.modify = function(clusterid) {
	
    var self=this;	
    	
	      if (clusterid.length > 0) {
		  var sendstring = "id="+clusterid;  
		  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  for (var i=0;i<formInputs.length;i++) { 
			  if (formInputs[i].tagName == 'INPUT') {
			   if (formInputs[i].value != formInputs[i].prompt) {	  
			    if (i == 0) {sendstring += '&url='+formInputs[i].value;}
			    if (i == 3) {sendstring += '&version='+formInputs[i].value;}
			   }
		      } else if (formInputs[i].tagName == 'SELECT') {
		    	  if (i == 1) {sendstring += '&clustertype='+document.getElementById(formInputs[i].id).value;}
		    	  if (i == 2) {sendstring += '&securitytype='+document.getElementById(formInputs[i].id).value;}
		      }
		  }
		  
		  var req = newXMLHttpRequest();
		  req.onreadystatechange = getReadyStateHandler(req,
			   function(response) {
				var reply = JSON.parse(response);
				var reasontext;
				if (reply.hasOwnProperty('result')) {
				   if (reply.result == "Success") {
					   self.bldform.resultBanner (true,'Cluster Changed Successfully');			   
					   self.get(clusterid);
				   }
				   else {
					if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
					self.bldform.resultBanner(false,'Cluster Not Changed ' + reasontext);
				   }
				}
				else {
					self.bldform.resultBanner(false,'Cluster Not Changed : Reason Not Specified');
				}
		       }, self.session.logout);
		  req.open("POST", "cluster/modify", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send(sendstring);
	      }	
	}
	
clusterController.prototype.remove = function(clusterid) {
	
    var self=this;	
  
	  var formInputs = document.getElementsByClassName('SSdropdownInput');
		  // assume only one input
		  if (formInputs[0]) {
			  if (formInputs[0].value == clusterid) {
				  var req = newXMLHttpRequest();
				  req.onreadystatechange = getReadyStateHandler(req,
	                   function(response) {
	
						var reply = JSON.parse(response);
						var reasontext;
						if (reply.hasOwnProperty('result')) {
						   if (reply.result == "Success") {
							   self.bldform.resultBanner (true,'Cluster Removed Successfully');
							   self.getAll(); //refresh
						   }
						   else {
							if (reply.hasOwnProperty('reason')) {reasontext = "Reason: "+ reply.reason;} else reasontext = "";
							self.bldform.resultBanner(false,'Cluster Not Removed ' + reasontext);
						   }
						}
						else {
							self.bldform.resultBanner(false,'Cluster Not Removed : Reason Not Specified');
						}
				      },self.session.logout);
				  req.open("POST", "cluster/remove", true);
				  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
				  req.send("id="+clusterid);
			  }
			  else {
				  self.bldform.resultBanner(false,'Cluster Not Removed: Confirmation text is incorrect');
			  }
		  }
	}
	
