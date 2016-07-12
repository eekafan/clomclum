
function templateController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

templateController.prototype.getAll = function() {
	
	     var self=this;
		 
		 var ss = new secondsidebar(); ss.collapse();
		 var mpToolbar = new mainpanelToolbar({
			 banner:'Templates',
			 options: [{id:'AddTemplate',icon:'addnewpolicy.png', 
				        clickform: {type: 'addForm', parameters: {
				          header:'Add Template',
			              submit:{label:'Create',onclick:function(){self.add();}},
	                      inputs:[{id:'name',label:'id',prompt:'Please enter name for this template'},
	                              {id:'numcopies',label:'application',choices:['3','4','5','6']},
	                              {id:'quorum',label:'quorum',choices:['8','2','3','4','5','6','7','9','10']},
	                              {id:'read',label:'read',choices:['2','3','4','5','6']},
	                              {id:'write',label:'write',choices:['2','3','4','5','6']},
	                              {id:'read',label:'appscope',prompt:'Enter application scope where this policy applies'},
	                              {id:'defaultdesigndocs',label:'default designlist',prompt:'Enter designlist name to use with this template'}]
				        }}},
			           {id:'TemplateHelp',icon:'help.png', 
	                    clickform: {type: 'helpForm', parameters: {
	                        header:'Policies Help', 
	                        submit:{label:'Finish'}, helpfile: 'help/templatehelp.html'}}
			            }]});	 
			 mpToolbar.load();

			 var mpDataForms = new mainpanelDataForms({
		    	 tables: [{id:'mainPanelAllTemplates', 
		    		 header: [{titles:['Name','N','Q','R','W', 'Design List']}],rows: []}]
		    	         });
		 

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
		    	       
		    		      mpDataForms.addRow('mainPanelAllTemplates',
				                   {cells : [{type: 'button', text: name, onclick: get(templateid,name)},
		                                     {type: 'text'  , text: numcopies},
		                                     {type: 'text'  , text: quorum},
		                                     {type: 'text'  , text: read},
		                                     {type: 'text'  , text: write},
		                                     {type: 'text'  , text: list}]
				                   });
		     }
		     mpDataForms.load();
		    }, self.session.logout);
		  window.location.hash = "/_all_templates";
		  req.open("POST", "_all_templates", true);
		  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");  
		  req.send("");   

	     }
	
templateController.prototype.get = function (templateid,name) {
	
	       var self=this;	
	       
		   var ss = new secondsidebar(); ss.expand();
		   
		   var ssToolbar = new secondsidebarToolbar({
			     leftbutton: {onclick:function() {self.getAll()}},
				 banner:name,
				 rightbutton: { id:'Toolbar',
					            actions: [{id:'removeTemplate', label:'Remove', 
					            	       clickform:{type: 'removeForm', parameters : { 
					                    	   header:'Remove Template',currentdata:'mainPanelTemplate',removeobject:name, inputlabel:'template name',
					                       warning:'Please confirm removal of this template from the Registry by typing its name in the box below and clicking on confirm',
					                           submit:{label:'Confirm', onclick: function() {self.remove(templateid,name);}},
				                               cancel:{label:'Cancel',text:'Cluster Not Removed: Cancelled by User'}}}},
					                      {id:'modifyTemplate', label:'Modify', 
						                    clickform:{type: 'modifyForm', parameters : { 
									            header:'Modify Template',currentdata:'mainPanelTemplate',modifyobject:name, currentrow: 1,
									            submit:{label:'Save', onclick: function() {self.modify(templateid,name);}},
								                inputs: [{id: 'numcopies', label: 'numcopies', type: 'modifyChoice', data: ['3','4','5','6'], currentindex: 1},
								                         {id: 'quorum', label: 'quorum', type: 'modifyChoice', data: ['8','2','3','4','5','6','7','9','10'], currentindex: 2},
								                         {id: 'read', label: 'read', type: 'modifyChoice', data: ['2','3','4','5','6'], currentindex: 3},
								                         {id: 'write', label: 'write', type: 'modifyChoice', data: ['2','3','4','5','6'], currentindex: 4},
								                         {id: 'defaultdesigndocs', label: 'default designlist', type: 'modifyValue', data: null, currentindex: 5}
								                         ]}}}]							                         
				              }});	  
		   ssToolbar.load();
		   
		   var ssMenu = new secondsidebarMenu({
	           options: [{id:'TemplateEdit',label: 'Edit', 
		            actions: [
	                      {id:'modifyTemplate', label:'Modify', 
		                    clickform:{type: 'modifyForm', parameters : { 
					            header:'Modify Template',currentdata:'mainPanelTemplate',modifyobject:name, currentrow: 1,
					            submit:{label:'Save', onclick: function() {self.modify(templateid,name);}},
				                inputs: [{id: 'numcopies', label: 'numcopies', type: 'modifyChoice', data: ['3','4','5','6'], currentindex: 1},
				                         {id: 'quorum', label: 'quorum', type: 'modifyChoice', data: ['8','2','3','4','5','6','7','9','10'], currentindex: 2},
				                         {id: 'read', label: 'read', type: 'modifyChoice', data: ['2','3','4','5','6'], currentindex: 3},
				                         {id: 'write', label: 'write', type: 'modifyChoice', data: ['2','3','4','5','6'], currentindex: 4},
				                         {id: 'defaultdesigndocs', label: 'default designlist', type: 'modifyValue', data: null, currentindex: 5}
				                         ]}}}]							                         
	                     }]});
	       ssMenu.load();
	       
		
			var mpToolbar = new mainpanelToolbar({ banner:'' });
			mpToolbar.load();

			 var mpDataForms = new mainpanelDataForms({
		    	 tables: [{id:'mainPanelTemplate', 
		    		 header: [{titles:['Name','N','Q','R','W', 'Design List']}],rows: []}]
		    	         });

		
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
				       
			    		      mpDataForms.addRow('mainPanelTemplate',
					                   {cells : [{type: 'button', text: name},
			                                     {type: 'text'  , text: numcopies},
			                                     {type: 'text'  , text: quorum},
			                                     {type: 'text'  , text: read},
			                                     {type: 'text'  , text: write},
			                                     {type: 'text'  , text: list}]
					                   });
			     }
			     mpDataForms.load();
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
	
