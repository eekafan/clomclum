
function clusterController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

clusterController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		 var ssMenu = new secondsidebarMenu(); ssMenu.init();


		 var mpToolbar = new mainpanelToolbar();  mpToolbar.init();
		 mpToolbar.setBanner('Clusters');
		 mpToolbar.addOption('AddCluster','addnewcluster.png', 'Add Cluster');
		 mpToolbar.addOptionInput('AddCluster','id','id','addPrompt','Please enter name for this cluster');
		 mpToolbar.addOptionInput('AddCluster','url','url','addPrompt','Please enter url for this cluster');
		 mpToolbar.addOptionInput('AddCluster','clustertype','clustertype','addChoice',['cloudant-dbaas', 'cloudant-local']);
		 mpToolbar.addOptionInput('AddCluster','securitytype','securitytype','addChoice',['dbaas', 'couchdb']);
		 mpToolbar.addOptionInput('AddCluster','version','version','addPrompt','Please enter software version for this cluster');
		 mpToolbar.addOptionSubmit('AddCluster','Create',function() {self.add()});
		 mpToolbar.setOptionClick('AddCluster','addForm');
		 mpToolbar.addOption('ClusterHelp','help.png', 'Clusters Help');
		 mpToolbar.setOptionHelpfile('ClusterHelp','help/clusterhelp.html');
		 mpToolbar.addOptionSubmit('ClusterHelp','Finish',function() {self.bldform.dropdownDestroyAll()});
		 mpToolbar.setOptionClick('ClusterHelp','helpForm');  
		 
	     var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	     var tableid = 'mainPanelAllClusters';
	     mpDataForms.addTable(tableid);
	     mpDataForms.tables[tableid].addHeader(tableid,1,5);
	     mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	     mpDataForms.tables[tableid].setCell(tableid,0,1,'url');
	     mpDataForms.tables[tableid].setCell(tableid,0,2,'Type');
	     mpDataForms.tables[tableid].setCell(tableid,0,3,'Security');
	     mpDataForms.tables[tableid].setCell(tableid,0,4,'Version');

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

		       mpDataForms.tables[tableid].addRow(tableid,parseInt(i) + 1,5);
		       mpDataForms.tables[tableid].setCellAsButton(tableid,parseInt(i) + 1,0,clusterid,get(clusterid));
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,1,url); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,2,type);
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,3,security); 
		       mpDataForms.tables[tableid].setCell(tableid,parseInt(i) + 1,4,version); 
		     }
		    }, self.session.logout);
		  window.location.hash = "/_all_clusters";
		  req.open("POST", "_all_clusters", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
clusterController.prototype.get = function (clusterid) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
		     ssToolbar.setLeftButtonClick(function() {self.getAll()});
		     ssToolbar.setBanner(clusterid);
		 
			 ssToolbar.addAction('removeCluster', 'Remove');
			 ssToolbar.setActionRemoveParameters('removeCluster','Remove Cluster','mainPanelCluster',clusterid,
			 'Please confirm removal of this cluster from the Registry by typing its name in the box below and clicking on confirm', 'cluster name');
			 ssToolbar.addActionCancel('removeCluster','Cancel',
					 function() {ssDropdownResultBuild ('Failure','Cluster Not Removed: Cancelled by User')});
			 ssToolbar.addActionSubmit('removeCluster','Confirm',function() {self.remove(clusterid)});
			 ssToolbar.setActionClick('removeCluster','removeForm');
		   
		     ssToolbar.addAction('modifyCluster', 'Modify');
		     ssToolbar.setActionModifyParameters('modifyCluster','Modify Cluster', 'mainPanelCluster',clusterid, 1);
		     ssToolbar.addActionSubmit('modifyCluster','Save',function() {self.modify(clusterid)});
		     ssToolbar.addActionInput('modifyCluster','url','url','modifyValue',null,1);
		     ssToolbar.addActionInput('modifyCluster','clustertype','clustertype','modifyChoice',['cloudant-dbaas', 'cloudant-local'],2);
		     ssToolbar.addActionInput('modifyCluster','securitytype','securitytype','modifyChoice',['dbaas', 'couchdb'],3);
		     ssToolbar.addActionInput('modifyCluster','version','software version','modifyValue',null,4);
		     ssToolbar.setActionClick('modifyCluster','modifyForm');	     
		     ssToolbar.setRightButtonClick(function() {self.bldform.dropdownForm(ssToolbar.rightButton)});
		     
		     
		   var ssMenu = new secondsidebarMenu(); ssMenu.init();
		     ssMenu.addOption('ClusterEdit','Edit','hasactions');
		     ssMenu.addOption('ClusterSyncSecurity','Sync Security','noactions');
		     ssMenu.addOption('ClusterSyncDesign','Sync Design','noactions');
		     ssMenu.addOption('ClusterManaged','Managed Document Stores','noactions');
		     ssMenu.addOption('ClusterUnmanaged','Unmanaged Document Stores','noactions');
		     ssMenu.addOption('ClusterSettings','Settings','noactions');
		     
		     ssMenu.options['ClusterEdit'].addAction('modifyCluster', 'Modify');
		     ssMenu.options['ClusterEdit'].setActionModifyParameters('modifyCluster','Modify Cluster', 'mainPanelCluster',clusterid, 1);
		     ssMenu.options['ClusterEdit'].addActionSubmit('modifyCluster','Save',function() {self.modify(clusterid)});
		     ssMenu.options['ClusterEdit'].addActionInput('modifyCluster','url','url','modifyValue',null,1);
		     ssMenu.options['ClusterEdit'].addActionInput('modifyCluster','clustertype','clustertype','modifyChoice',['cloudant-dbaas', 'cloudant-local'],2);
		     ssMenu.options['ClusterEdit'].addActionInput('modifyCluster','securitytype','securitytype','modifyChoice',['dbaas', 'couchdb'],3);
		     ssMenu.options['ClusterEdit'].addActionInput('modifyCluster','version','software version','modifyValue',null,4);
		     ssMenu.options['ClusterEdit'].setActionClick('modifyCluster','modifyForm');
		     ssMenu.options['ClusterEdit'].setClick(function() {self.bldform.dropdownForm(ssMenu.options['ClusterEdit'])});
		     ssMenu.options['ClusterSyncSecurity'].setClick(function() {self.syncSecurity(clusterid)});
		     ssMenu.options['ClusterSyncDesign'].setClick(function() {self.syncDesign(clusterid)});
		     ssMenu.options['ClusterManaged'].setClick(function() {self.getDocumentstores(clusterid,'managed')});
		     ssMenu.options['ClusterUnmanaged'].setClick(function() {self.getDocumentstores(clusterid,'unmanaged')});
		     ssMenu.options['ClusterSettings'].setClick(function() {self.get(clusterid)});	 
		
		    var mpToolbar = new mainpanelToolbar(); mpToolbar.init();

	        var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
	         var tableid = 'mainPanelCluster';
	         mpDataForms.addTable(tableid);
	         mpDataForms.tables[tableid].addHeader(tableid,1,5);
	         mpDataForms.tables[tableid].setCell(tableid,0,0,'Name');
	         mpDataForms.tables[tableid].setCell(tableid,0,1,'url');
	         mpDataForms.tables[tableid].setCell(tableid,0,2,'Type');
	         mpDataForms.tables[tableid].setCell(tableid,0,3,'Security');
	         mpDataForms.tables[tableid].setCell(tableid,0,4,'Version');
		
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
				       
				       mpDataForms.tables[tableid].addRow(tableid,1,5);
				       mpDataForms.tables[tableid].setCellAsButton(tableid,1,0,clusterid,
				    		   function(){self.getDocumentstores(clusterid,'managed')});
				       mpDataForms.tables[tableid].setCell(tableid,1,1,url); 
				       mpDataForms.tables[tableid].setCell(tableid,1,2,type);
				       mpDataForms.tables[tableid].setCell(tableid,1,3,security); 
				       mpDataForms.tables[tableid].setCell(tableid,1,4,version); 
				     }
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
					       var tableindex = parseInt(i) + 1;
					       mpDataForms.tables[tableid].addRow(tableid,tableindex,2);
						if (items[i]._id != undefined) {
					       var documentstoreid   = items[i]._id;
					       var appscope = items[i].scopetype;
					       var dbid     = items[i].dbid;
					       var name     = items[i].name;
					       var cluster  = items[i].cluster;
					       mpDataForms.tables[tableid].setCellAsButton(tableid,tableindex,0,name,getDocumentstore(appscope,documentstoreid,name));				    		  
					       mpDataForms.tables[tableid].setCell(tableid,tableindex,1,dbid);
					   }
					}
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
					       var tableindex = parseInt(i) + 1;
					       mpDataForms.tables[tableid].addRow(tableid,tableindex,3);
							if (items[i]._id != undefined) { // entry already exists in registry but store is unmanaged
								  var documentstoreid   = items[i]._id;
								   var appscope = items[i].scopetype;
							       var dbid     = items[i].dbid;
							       var name     = items[i].name;
							       var cluster  = items[i].cluster;
							       mpDataForms.tables[tableid].setCellAsButton(tableid,tableindex,0,name,getDocumentstore(appscope,documentstoreid,name));				    		  
							       mpDataForms.tables[tableid].setCell(tableid,tableindex,1,dbid);
							        if (dbid.charAt(0) != '_') {
							        }
							 } else { // no entry in registry so add a new one
								    mpDataForms.tables[tableid].setCell(tableid,tableindex,1,items[i].dbid);			  
							        if (items[i].dbid.charAt(0) != '_') {
							        	mpDataForms.tables[tableid].setCellAsAction(tableid,tableindex,2,'Manage','Manage Documentstore');
							        	clusterchoices = new Array(0); clusterchoices.push(clusterid);
							        	mpDataForms.tables[tableid].addCellActionInput(tableid,tableindex,2,'cluster','cluster','addChoice',clusterchoices);
							        	dbchoices = new Array(0); dbchoices.push(items[i].dbid);
							        	mpDataForms.tables[tableid].addCellActionInput(tableid,tableindex,2,'db','db','addChoice',dbchoices);
							        	mpDataForms.tables[tableid].addCellActionInput(tableid,tableindex,2,'name','name','addPrompt','Please enter name for this documentstore');		
							        	mpDataForms.tables[tableid].addCellActionInput(tableid,tableindex,2,'appscope','appscope','addChoice',['Personal', 'Team', 'Enterprise']);
							        	mpDataForms.tables[tableid].addCellActionInput(tableid,tableindex,2,'adminroles','admin roles','addPrompt','Please enter admin roles in format \[\"role1\",\"role2\",...\]');
							        	mpDataForms.tables[tableid].addCellActionInput(tableid,tableindex,2,'memberroles','member roles','addPrompt','Please enter member roles in format \[\"role1\",\"role2\",...\]');
							        	mpDataForms.tables[tableid].addCellActionSubmit(tableid,tableindex,2,'Save',manageDocumentstore(clusterid,items[i].dbid));
							        	mpDataForms.tables[tableid].setCellActionClick(tableid,tableindex,2,'addForm');
								    }
							  }
		          }
		 }
		
		var responseFunction;
		var mpToolbar = new mainpanelToolbar(); mpToolbar.init();
		var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
		var tableid = 'mainPanelClusterDocuments';
		mpDataForms.addTable(tableid);

	    if (managedstatus == 'managed') {
		        mpToolbar.setBanner('Managed Document Stores');
		        mpDataForms.tables[tableid].addHeader(tableid,1,2);
		        mpDataForms.tables[tableid].setCell(tableid,0,0,'Name'); 
		        mpDataForms.tables[tableid].setCell(tableid,0,1,'Id'); 
			    responseFunction = handleResponse_cluster_documentstores_managed;
	    } 
	    if (managedstatus == 'unmanaged') {
	    	    mpToolbar.setBanner('Unmanaged Document Stores')
	  	        mpDataForms.tables[tableid].addHeader(tableid,1,3);
	    	    mpDataForms.tables[tableid].setCell(tableid,0,0,'Name'); 
	    	    mpDataForms.tables[tableid].setCell(tableid,0,1,'Id'); 
	    	    mpDataForms.tables[tableid].setCell(tableid,0,2,'Actions'); 
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
	
