function parseWindowHashElements (windowhash) {
	  var currentWindowHash = window.location.hash;
	  var parameters = new Array();
	  var hashComponents = currentWindowHash.split("?");
	  if (hashComponents.length > 0) {
         var elementList = hashComponents[0].split("/");
         return(elementList);
      }
}

function parseWindowHashParameters (windowhash) {
	  var currentWindowHash = window.location.hash;
	  var parameters = new Array();
	  var hashComponents = currentWindowHash.split("?");
	  if (hashComponents.length == 2) {
         var parameterList = hashComponents[1].split("&");
         for (i in parameterList) {
        	 var parameterParts = parameterList[i].split('=');
        	 parameters[i] = new Object();
        	 parameters[i].key = parameterParts[0];
        	 parameters[i].value = parameterParts[1];
         }
         return(parameters);
      }
}

function userSession () {
}

userSession.prototype.init = function() {
	
	function updateSelected(e,selectedClass,unselectedClass) {
	  var selected = document.getElementsByClassName(selectedClass);
	  for (var i=0; i<selected.length; i++) {
		if (selected[i].id == e.target.id) 
		{selected[i].className = selectedClass }
		else 
		{selected[i].className = unselectedClass; }	
	  }
	  var unselected = document.getElementsByClassName(unselectedClass);
	  for (var i=0; i<unselected.length; i++) {
			if (unselected[i].id == e.target.id) 
			{unselected[i].className = selectedClass }
			else 
			{unselected[i].className = unselectedClass; }
	  }
	}
	
	document.getElementById('firstSidebarSideMenu').addEventListener('click', function(e) {
            updateSelected(e,'firstSidebarSideMenuButton-selected','firstSidebarSideMenuButton');
		 },false);
	
	document.getElementById('secondSidebarSideMenu').addEventListener('click', function(e) {
        updateSelected(e,'secondSidebarSideMenuButton-selected','secondSidebarSideMenuButton');
	 },false);
	
	var bottomButtonArray = document.getElementsByClassName('firstSidebarBottomButton');
	bottomButtonArray[0].onclick = this.logout;
}

userSession.prototype.logout = function() {
	
	window.location.href = "../ClomClum/logout";
}



function secondsidebar() {
	this.collapse = function() {
		ssToolbar = new secondsidebarToolbar();
		ssMenu = new secondsidebarToolbar();
	    var ssSidebar = document.getElementById("secondSidebar"); 
	    ssSidebar.style.display = "none";
		var pageContainer = document.getElementById("Pagecontainer");
		var firstSidebar  = document.getElementById("firstSidebar");
		pageContainer.style.marginLeft = "200px";
		firstSidebar.style.marginLeft = "-200px";
	}
	this.expand = function() {
		ssToolbar = new secondsidebarToolbar();
		ssMenu = new secondsidebarToolbar();
		var ssSidebar = document.getElementById("secondSidebar"); 
	    ssSidebar.style.display = "block";
		var pageContainer = document.getElementById("Pagecontainer");
		var firstSidebar  = document.getElementById("firstSidebar");
		pageContainer.style.marginLeft = "450px";
		firstSidebar.style.marginLeft = "-450px";
	}
}




function secondsidebarToolbar (content) {
	this.content = content;
}

secondsidebarToolbar.prototype.load = function() {
	
    var self=this;
	var bldform = new formBuilder();
	
    function removeForm (option) {
    	option.clickform.parameters.cancel.onclick =
		     function() {bldform.resultBanner ('Failure',option.clickform.parameters.cancel.text)};
 		 var thisFunction = function(){bldform.removeForm(option)};
 		 return thisFunction;
 	    }
    
    function modifyForm (option) {
 		 var thisFunction = function(){bldform.modifyForm(option)};
 		 return thisFunction;
 	    }
	
	  var ssToolbarContents = document.getElementById("secondSidebarTopMenu"); 
	  ssToolbarContents.innerHTML = ""; //clear existing toolbar
	  var ssToolbarUl = ssToolbarContents.appendChild(document.createElement('ul'));
	  
	  var ssToolbarLeftButton = document.createElement('li');
	  ssToolbarLeftButton.className = "secondSidebarTopMenuButtonLeft";
	  ssToolbarLeftButton.src= "images/back-icon.png";
	  ssToolbarUl.appendChild(ssToolbarLeftButton);
	  var ssToolbarLeftButtonIcon = document.createElement('img');
	  ssToolbarLeftButtonIcon.className = "secondSidebarBackIcon";
	  ssToolbarLeftButtonIcon.src= "images/back-icon.png";
	  ssToolbarLeftButton.appendChild(ssToolbarLeftButtonIcon);
	  ssToolbarLeftButtonIcon.addEventListener('click',self.content.leftbutton.onclick,false);
	  
	  var ssToolbarCentre = document.createElement('li');
	  ssToolbarCentre.id = "secondSidebarTopMenuButtonCentre";
	  ssToolbarCentre.className = "secondSidebarTopMenuButtonCentre";
	  ssToolbarCentre.innerHTML= self.content.banner;
	  ssToolbarUl.appendChild(ssToolbarCentre);
	  
	  var ssToolbarRightButton = document.createElement('li');
	  ssToolbarRightButton.className = "secondSidebarTopMenuButtonRight";
	  ssToolbarUl.appendChild(ssToolbarRightButton);
	  var ssToolbarRightDiv = document.createElement('div');
	  ssToolbarRightDiv.id = "secondSidebarTopMenuActions";
	  ssToolbarRightDiv.className = "secondSidebarTopMenuActionButton";
	  ssToolbarRightButton.appendChild(ssToolbarRightDiv);
	  var ssToolbarRightButtonIcon = document.createElement('img');
	  ssToolbarRightButtonIcon.id = "secondSidebarTopMenuActionsIcon";
	  ssToolbarRightButtonIcon.className = "secondSidebarActionIcon";
	  ssToolbarRightButtonIcon.src= "images/topmenu-icon-grey.png";
	  ssToolbarRightDiv.appendChild(ssToolbarRightButtonIcon);
	  self.content.rightbutton.location = 'secondSidebarTopMenuActionsIcon';
	  
	    	for (var j in self.content.rightbutton.actions) {
	    	  thisoption = self.content.rightbutton;
		      if (thisoption.actions[j].clickform.type == 'removeForm') {
			  
			  thisoption.actions[j].onclick = removeForm(thisoption.actions[j]);
		      }
		      if (thisoption.actions[j].clickform.type == 'modifyForm') {
		      thisoption.actions[j].onclick  = modifyForm(thisoption.actions[j]);
			  }
	    	}
	    	
	   ssToolbarRightButtonIcon.addEventListener('click',function() {bldform.dropdownForm(self.content.rightbutton)},false);
}






function secondsidebarMenu (content) {
	this.content = content;
}

secondsidebarMenu.prototype.load = function() {
	
	var self=this;
	var bldform = new formBuilder();
	
	   function dropdownForm(option){
		   var thisFunction = function(){bldform.dropdownForm(option)};
	 		 return thisFunction;
	   }
	
	   function removeForm (option) {
	    	option.clickform.parameters.cancel.onclick =
			     function() {bldform.resultBanner ('Failure',option.clickform.parameters.cancel.text)};
	 		 var thisFunction = function(){bldform.removeForm(option)};
	 		 return thisFunction;
	 	    }
	    
	    function modifyForm (option) {
	 		 var thisFunction = function(){bldform.modifyForm(option)};
	 		 return thisFunction;
	 	    }
	    
	var thisMenuList = document.getElementById('secondSidebarSideMenu'); 
	thisMenuList.innerHTML = '<ul style="margin:0"></ul>';
    var menuUl = document.getElementById('secondSidebarSideMenu').childNodes[0];
    
    for (var i in self.content.options) {
	var optionLi = document.createElement('li');
    optionLi.innerHTML= self.content.options[i].label;
	optionLi.className = "secondSidebarSideMenuButton";
	optionLi.id = "secondSidebar" + self.content.options[i].id;
	menuUl.appendChild(optionLi);	
	 if (self.content.options[i].onclick) {
		optionLi.addEventListener('click',self.content.options[i].onclick,false);
		self.content.options[i].location = optionLi.id;
	 }
	 else {
	  var thisoption = self.content.options[i];
	  if (thisoption.actions.length > 0 ) { 
	    var optionIconDiv = document.createElement('div');
	    optionIconDiv.className = 'secondSidebarSideMenuActionButton';
	    optionIconDiv.id = optionLi.id + 'IconDiv';     
	   	optionLi.appendChild(optionIconDiv);
	    var icon = document.createElement('img');
	    icon.className = 'secondSidebarActionIcon';
	    icon.id = optionLi.id + 'Icon';
	    icon.src = 'images/dropdown-icon-grey.png';
	    icon.setAttribute("onmouseover" , "this.src=\'images/dropdown-icon-orange.png\'");
	    icon.setAttribute("onmouseout" , "this.src=\'images/dropdown-icon-grey.png\'");
	    optionIconDiv.appendChild(icon);
	    thisoption.location = icon.id;
	    for (var j in thisoption.actions) {
	    	  
	  	      if (thisoption.actions[j].clickform.type == 'removeForm') {
	  		  
	  		  thisoption.actions[j].onclick = removeForm(thisoption.actions[j]);
	  	      }
	  	      if (thisoption.actions[j].clickform.type == 'modifyForm') {
	  	      thisoption.actions[j].onclick  = modifyForm(thisoption.actions[j]);
	  		  }
	    	}
	    icon.addEventListener('click',dropdownForm(thisoption),false);
	   } 
	 }
   }  
 
}


function mainpanelToolbar (config) {
	this.config = config;
}

mainpanelToolbar.prototype.load = function() {
  
        
	    var self=this;
		var bldform = new formBuilder();
		
	    function addForm (option) {
	 		 var thisFunction = function(){bldform.addForm(option)};
	 		 return thisFunction;
	 	    }
	    
	    function helpForm (option) {
	 		 var thisFunction = function(){bldform.helpForm(option)};
	 		 return thisFunction;
	 	    }
		
		
		var mpToolbarContents = document.getElementById("mainPanelToolbarMenu"); 
	    mpToolbarContents.innerHTML = "<ul id=\"mainPanelToolbarMenuList\">" +
	                                 "<li class=\"mainPanelToolbarBanner\"></li></ul>";
		var mpToolbarBanner = document.getElementsByClassName("mainPanelToolbarBanner");
		 mpToolbarBanner[0].innerHTML = this.config.banner;
		   for (var i in self.config.options) {
			self.config.options[i].parent = 'mainPanelDataForms';
			self.config.options[i].inputclass = 'MPTdropdownInput';
		    
			var mpToolbarList =  document.getElementById("mainPanelToolbarMenu"); 
		    var optionLi = document.createElement('li');
		    mpToolbarList.appendChild(optionLi);
		    var toolbarIconDiv = optionLi.appendChild(document.createElement('div'));
		    toolbarIconDiv.id = "mainPanelToolbarButton" + self.config.options[i].id;
		    toolbarIconDiv.className = "mainPanelToolbarButton" ;
		    var toolbarIcon = toolbarIconDiv.appendChild(document.createElement('img'));
		    toolbarIcon.className = "mainPanelToolbarIcon";
		    toolbarIcon.id = "mainPanelToolbarIcon"+self.config.options[i].id;
		    toolbarIcon.src = "images/" + self.config.options[i].icon;
		    
		    if (this.config.options[i].clickform.type == 'addForm') {
		    	toolbarIcon.addEventListener('click',addForm(self.config.options[i]), false);	    	
		    }
		    if (this.config.options[i].clickform.type == 'helpForm') {
		    	this.config.options[i].clickform.parameters.submit.onclick = function() {bldform.dropdownDestroyAll()};
		    	toolbarIcon.addEventListener('click',helpForm(self.config.options[i]), false);	    	
		    }		    
		   }
}



function mainpanelDataForms (content) {	
	this.content = content;
}

mainpanelDataForms.prototype.addRow = function(tableid,row) {
	var self = this;
	var index = 0; var table_found = false;
	while ((index < self.content.tables.length) && (!table_found)) {
		if (self.content.tables[index].id == tableid) {table_found = true;}
		else {index++;}
	}
	if (table_found) {self.content.tables[index].rows.push(row);}
	
}
	
mainpanelDataForms.prototype.load = function() {
	  var self = this;
	  
	  
		var isEven = function(x) { return (x%2)==0; }
		var isOdd  = function(x) { return !isEven(x); }
		
		function loadHeader (table) {
			
			var mpTableResults = document.getElementById(table.id);
		    var tr_oddStyle = "class=\"mainPanelTable-tr-odd\"";
		    var tr_evenStyle = "class=\"mainPanelTable-tr-even\"";
		    var th_singlestyle = "style= \"border-left: 1px solid; border-right: 1px solid\"";
		    var th_line1style = "style= \"text-align:center;border:1px solid\" colspan=\"2\"";
		    var th_line2style = "style= \"border-left: 1px solid; border-right: 1px solid\"";
		    
		    if (table.header.length == 2) {
		    	   var row1_heading_html = "";
		    	   var row2_heading_html = "";
		    	   for (var i=0; i<table.header[0].titles.length; i++) {
		    		   row1_heading_html += "<th " + th_line1style + ">" + table.header[0].titles[i] + "</th>";
		    	   }
		    	   for (var i=0; i<table.header[1].titles.length; i++) {
		    		   row2_heading_html += "<th " + th_line2style + ">" + table.header[1].titles[i] + "</th>";
		    	   }
			       mpTableResults.innerHTML =  "<tr " + tr_evenStyle + ">" + row1_heading_html + "</tr>";
			       mpTableResults.innerHTML += "<tr " + tr_evenStyle + ">" + row2_heading_html + "</tr>";
		    } else {
		    	if (table.header.length == 1) {
		    	   	   var row_heading_html = "";  
			    	   for (var i=0; i<table.header[0].titles.length; i++) {
			    		   row_heading_html += "<th " + th_singlestyle + ">" + table.header[0].titles[i] + "</th>";
			    	   }
		        	   mpTableResults.innerHTML =  "<tr " + tr_evenStyle + ">" + row_heading_html + "</tr>";
		      } else {
		    	   mpTableResults.innerHTML = "";
		        }
		    }
		}
		
		function loadRow (table,index) {
			var self = this;	
			var bldform = new formBuilder();
			
		    function addForm (option) {
		 		 var thisFunction = function(){bldform.addForm(option)};
		 		 return thisFunction;
		 	    }
		    
			var mpTableResults = document.getElementById(table.id);
		    var newrow = mpTableResults.insertRow(parseInt(index) + parseInt(table.header.length));
		    
		        if (isEven(index)) { newrow.className = "mainPanelTable-tr-even"; }
		         else { newrow.className = "mainPanelTable-tr-odd"; }

		        for (var i in table.rows[index].cells) {
		        	var thisrow = table.rows[index];
		        	var newcell = newrow.insertCell(i);
		        	if (thisrow.cells[i].type == 'text') {newcell.innerHTML = thisrow.cells[i].text;}   
		        	if (thisrow.cells[i].type == 'button') {
		      		  if (isEven(index)) { newcell.className = "mainPanelTableButtonEven";} else {newcell.className = "mainPanelTableButtonOdd";}  
		      		  newcell.addEventListener('click',thisrow.cells[i].onclick);
		      		  newcell.innerHTML = thisrow.cells[i].text;
		      	    }
		        	if (thisrow.cells[i].type == 'action') {
		    		  newcell.id = table.id + String(parseInt(index) + parseInt(table.header.length)) + String(j);
		    		  thisrow.cells[i].action.parent = 'mainPanelDataForms';
		      		  if (isEven(index)) { newcell.className = "mainPanelTableButtonEven";} else {newcell.className = "mainPanelTableButtonOdd";}       		  
		      	      if (thisrow.cells[i].action.clickform.type == 'addForm') {
				    	newcell.addEventListener('click',addForm(thisrow.cells[i].action), false);	
				    	newcell.innerHTML = thisrow.cells[i].action.label;
				      }   		
		        	}
		        }
		}
		
	  // clear any current contents from DOM
	  var mpDataFormsContents = document.getElementById("mainPanelDataForms"); 
	      mpDataFormsContents.innerHTML = "";
	
	 // load content to DOM   
	 for (var i in self.content.tables) {
		var thistable = self.content.tables[i];
		var mpContainer = document.getElementById('mainPanelDataForms');
		if (!document.getElementById(thistable.id)) { //create a new blank table
	    var mpTableResults = document.createElement('table');
	    mpTableResults.id = thistable.id;
	    mpTableResults.className = "mainPanelTable";
	    mpTableResults.innerHTML = "";
	    mpContainer.appendChild(mpTableResults);


		} else { // already exists so blank current contents
			var mpTableResults = document.getElementById(thistable.id);
			mpTableResults.innerHTML = "";
		}
	    loadHeader(thistable);
	    for (var j in thistable.rows) {
	      loadRow(thistable,j);
	    }
	    if (thistable.spacer) {
	        var mpSpacer = document.createElement('p');
		    mpSpacer.id = "mainPanelSpacer";
		    mpContainer.appendChild(mpSpacer);
			var text = ""; var j;
			for (j=0; j< thistable.spacer.rows; j++) {text += "<br/>";}
			mpSpacer.innerHTML = text;
	     }
	 }
}





function formBuilder () {
}	

formBuilder.prototype.resultBanner = function(success,message) {	
	   var self = this;
	
	  
	    var page = document.getElementById("Pagecontainer");
		var dropdownResultDiv = document.createElement('div');
		var dropdownResultLi  = document.createElement('li');
	    page.appendChild(dropdownResultDiv);
	    dropdownResultDiv.appendChild(dropdownResultLi);
	    if (success) {
		    self.dropdownDestroyAll("SSdropdown");  
		    self.dropdownDestroyAll("SSdropdownOptionForm");
			self.dropdownDestroyAll("MPTdropdown");  
			self.dropdownDestroyAll("MPTdropdownForm");
			dropdownResultDiv.className = "SSresultBannerContainerSuccess";
	    }
	    else {
	    	dropdownResultDiv.className = "SSresultBannerContainerFailure";
	    }
		
		dropdownResultDiv.id = "SSresultBannerContainer";
		dropdownResultLi.className ='SSresultBanner';
		dropdownResultDiv.onclick =function() {page.removeChild(dropdownResultDiv)}; //delegated from li
	    dropdownResultLi.innerHTML = '<br/>' + message;
	}


formBuilder.prototype.dropdownDestroyAll = function() {
	var dropdownarray;
	dropdownarray = document.getElementsByClassName('SSdropdown');
	for (var i=0; i<dropdownarray.length; i++) {
		dropdownarray[i].parentNode.removeChild(dropdownarray[i]);
	    }
	dropdownarray = document.getElementsByClassName('SSdropdownOptionForm');
	for (var i=0; i<dropdownarray.length; i++) {
		dropdownarray[i].parentNode.removeChild(dropdownarray[i]);
	    }
	dropdownarray = document.getElementsByClassName('MPTdropdown');
	for (var i=0; i<dropdownarray.length; i++) {
		dropdownarray[i].parentNode.removeChild(dropdownarray[i]);
	    }
	dropdownarray = document.getElementsByClassName('MPTdropdownForm');
	for (var i=0; i<dropdownarray.length; i++) {
		dropdownarray[i].parentNode.removeChild(dropdownarray[i]);
	    }
}


formBuilder.prototype.dropdownDestroyAllExcept = function (dropdownClass,elementid) {
 var dropdowns = document.getElementsByClassName(dropdownClass);
 for (var i=0; i<dropdowns.length; i++) {
	if (dropdowns[i].id != elementid) {
	dropdowns[i].parentNode.removeChild(dropdowns[i]);
    }
 }
}

 	
formBuilder.prototype.dropdownForm = function (forminfo) {
	
	    var self=this;
	
		var thisOption = document.getElementById(forminfo.location).parentElement; 
		var optionId = forminfo.id;
		if (thisOption) {
			var thisDropdown = document.getElementById("SSdropdown" + optionId);	
		    if (thisDropdown) {
		    	 self.dropdownDestroyAll("SSdropdown");
		    	 self.dropdownDestroyAll("SSdropdownOptionForm");
		    } else {
		      var dropdownDiv = document.createElement('div');
		    	  dropdownDiv.className = "SSdropdown";
		    	  dropdownDiv.id = "SSdropdown" + optionId;
		    	  self.dropdownDestroyAllExcept("SSdropdown","SSdropdown" + optionId);
		    	  self.dropdownDestroyAll("SSdropdownOptionForm");
		    	  
	          var dropdown =	thisOption.appendChild(dropdownDiv);
	          var dropdownUl = dropdown.appendChild(document.createElement('ul'));

	          var iconActions = forminfo.actions;
	          if (iconActions != undefined) {
		      for (var i=0; i<iconActions.length; i++) {
	    	    var thisAction = document.createElement('li');
	    	    thisAction.className = "SSdropdown-li";
	    	    var actionid = iconActions[i];
	    	    if (iconActions[i].id) { actionid = i;} 
	    	    if (iconActions[actionid] != undefined) {
	    	    if (iconActions[actionid].label != undefined) {thisAction.innerHTML = iconActions[actionid].label;}
	    	    dropdownUl.appendChild(thisAction);
	            if (iconActions[actionid].onclick != undefined) {thisAction.addEventListener('click',iconActions[actionid].onclick,false);}
	    	    }
	          }
	          }
		    }
		}
	}
	
formBuilder.prototype.addForm = function(formInfo) {
		
		var self=this;
		
			function keydownFunction(elementid) {
				var keydownListener = function () {
					thisElement = document.getElementById(elementid);
				    thisElement.value = "";
				    thisElement.onkeydown = null;
			    }
				return keydownListener;
			}
			
			var parameters = formInfo.clickform.parameters;
			var thisOption = document.getElementById(formInfo.parent); 
			if (thisOption) {
		    var thisDropdown = document.getElementById("MPTdropdown" + formInfo.id);	
		    if (thisDropdown) {
		    	 self.dropdownDestroyAll();
			    } else {
			self.dropdownDestroyAllExcept("MPTdropdown","MPTdropdown" + formInfo.id);
			var dropdownDiv = thisOption.appendChild(document.createElement('div'));
			dropdownDiv.className = "MPTdropdown";
			dropdownDiv.id = "MPTdropdown" + formInfo.id;
			
		  
		    var dropdownTable = dropdownDiv.appendChild(document.createElement('table'));
		    dropdownTable.className = "MPTdropdownTable";
		    dropdownTable.id        = "MPTdropdownTable";
		    var row = dropdownTable.insertRow(0);
		    var cell1 = row.insertCell(0);
		    var cell2 = row.insertCell(1);
		    var dropdownForm = cell1.appendChild(document.createElement('form'));
		    dropdownForm.className = "MPTdropdownForm";
		    dropdownForm.id = "MPTdropdownForm";
		    var dropdownFormHeader = dropdownForm.appendChild(document.createElement('p'));
		    dropdownFormHeader.className = "MPTdropdownFormHeader"; 
		    dropdownFormHeader.innerHTML = parameters.header;
		    var dropdownFormTable = dropdownForm.appendChild(document.createElement('table'));
		    dropdownFormTable.id = "MPTdropdownFormTable";
		    var dropdownButton = cell2.appendChild(document.createElement('button'));
		    dropdownButton.className = "MPTdropdownButton";
		    dropdownButton.id = "MPTdropdownButton";
		    dropdownButton.innerHTML = parameters.submit.label;
		    dropdownButton.addEventListener('click',parameters.submit.onclick, false);
		     
		     if (parameters.inputs) {
		      for (var i=0; i<parameters.inputs.length; i++) {
		  	   var thisRow = dropdownFormTable.insertRow(i);
		  	   var thisLabelCell = thisRow.insertCell(0);
		  	   var thisInputCell = thisRow.insertCell(1);
	           var inputparameters = parameters.inputs[i];
		  	   if (inputparameters.prompt) {
		  	   var thisInput = document.createElement('input');
		  	   thisInput.className = "MPTdropdownInput";
		  	   thisInput.type = "text";
		  	   thisInput.id = "MPTdropdownInput" + inputparameters.id;
		  	   thisInput.fieldindex = i;
		  	   thisInput.value = inputparameters.prompt;
		  	   thisInput.prompt = inputparameters.prompt;
		  	   thisInputCell.appendChild(thisInput);
		  	   thisInput.onkeydown = keydownFunction(thisInput.id); 

		  	   } else { if (inputparameters.choices.length > 0) {
		  	 	  var thisInput = document.createElement('select');
		  		  thisInput.className = "MPTdropdownInput";
		  		  thisInput.type = "text";
		  		  thisInput.id = "MPTdropdownInput" + inputparameters.id;
		  		  thisInput.fieldindex = i;
		  		  thisInputCell.appendChild(thisInput);
		  		  for (var j=0; j<inputparameters.choices.length; j++) {
		  			  var thisChoice= document.createElement('option');
		  			  thisChoice.className = "MPTdropdownChoice";
		  			  thisChoice.value = inputparameters.choices[j];
		  			  thisChoice.innerHTML = inputparameters.choices[j];
		  			  thisChoice.id = inputparameters.id + inputparameters.choices[j] ;
		  			  thisInput.appendChild(thisChoice);
		  		  }
		  	     }
		  	    }
		  	  
		  	  var thisLabel = document.createElement('p');
		  	  thisLabel.className = "MPTdropdownInputLabel";
		  	  thisLabel.innerHTML = inputparameters.label;
		  	  thisLabelCell.appendChild(thisLabel);
		     }
			}
		}
		}
}
	
	
formBuilder.prototype.helpForm = function (formInfo) {

	        var self=this;
			var parameters = formInfo.clickform.parameters;
			var thisOption = document.getElementById(formInfo.parent); 
			if (thisOption) {
		    var thisDropdown = document.getElementById("MPTdropdown" + formInfo.id);	
		    if (thisDropdown) {
			    	 self.dropdownDestroyAll();
			    } else {
			    self.dropdownDestroyAllExcept("MPTdropdown","MPTdropdown" + formInfo.id);
			    var dropdownDiv = thisOption.appendChild(document.createElement('div'));
			    dropdownDiv.className = "MPTdropdown";
			    dropdownDiv.id = "MPTdropdown" + formInfo.id;
			    dropdownDiv.style.top = "100px"; // shift enclosing box down so some data is visible

			   var dropdownTable = dropdownDiv.appendChild(document.createElement('table'));
			    dropdownTable.className = "MPTdropdownTable";
			    dropdownTable.id        = "MPTdropdownTable";
			    var row = dropdownTable.insertRow(0);
			    var cell1 = row.insertCell(0);
			    var cell2 = row.insertCell(1);
			    var dropdownHelpFrame = cell1.appendChild(document.createElement('iframe'));
			    dropdownHelpFrame.id = "MPTdropdownHelp";
			    dropdownHelpFrame.className = "MPTdropdownHelp";
			    dropdownHelpFrame.setAttribute("src",parameters.helpfile);

			    var dropdownButton = cell2.appendChild(document.createElement('button'));
			    dropdownButton.className = "MPTdropdownButton";
			    dropdownButton.id = "MPTdropdownButton";
			    dropdownButton.innerHTML = parameters.submit.label;
			    dropdownButton.addEventListener('click',parameters.submit.onclick, false);
			  }
			}	
	}
	
formBuilder.prototype.removeForm = function (formInfo) {

	  var self=this;
	  var parameters = formInfo.clickform.parameters;
	  
	  var thisOption = document.getElementById("mainPanelDataForms"); 
	  var thisOptionDiv = document.getElementById("SSdropdownOptionFormRemove"); 
	  if (thisOptionDiv) { 
		    	thisOptionDiv.parentNode.removeChild(thisOptionDiv);
		    } else {		  
	  self.dropdownDestroyAllExcept("SSdropdownOptionForm","SSdropdownOptionFormRemove");
	  optionDiv = document.createElement('div');
	  optionDiv.className = "SSdropdownOptionForm";
	  optionDiv.id = "SSdropdownOptionFormRemove";
	  thisOption.appendChild(optionDiv);
	  
	  var dropdownTable = document.createElement('table');
	  dropdownTable.className = "SSdropdownTable";
	  dropdownTable.id        = "SSdropdownTable";
	  var row = dropdownTable.insertRow(0);
	  var cell1 = row.insertCell(0);
	  var cell2 = row.insertCell(1);
	  optionDiv.appendChild(dropdownTable);
	  var dropdownForm = document.createElement('form');
	  dropdownForm.className = "SSdropdownForm";
	  dropdownForm.id = "SSdropdownForm";
	  var dropdownFormHeader = dropdownForm.appendChild(document.createElement('p'));
	  dropdownFormHeader.className = "SSdropdownFormHeader";  
	  dropdownFormHeader.innerHTML = parameters.header+"<br/>"+parameters.removeobject;
	  var dropdownFormTable = dropdownForm.appendChild(document.createElement('table'));
	  dropdownFormTable.id = "SSdropdownFormTable";
	  
	  var cancelButton = document.createElement('button');
	  cancelButton.className = "SSdropdownButton";
	  cancelButton.id = "SSdropdownButton";
	  cancelButton.innerHTML = parameters.cancel.label;
	
	  var confirmButton = document.createElement('button');
	  confirmButton.className = "SSdropdownButton";
	  confirmButton.id = "SSdropdownButton";
	  confirmButton.innerHTML = parameters.submit.label;
	 
	  cell1.appendChild(dropdownForm);
	  cell2.appendChild(cancelButton);
	  cancelButton.addEventListener("click",parameters.cancel.onclick,false );
	  cell2.appendChild(confirmButton);
	  confirmButton.addEventListener("click",parameters.submit.onclick,false );
	  
		  var warningRow = dropdownFormTable.insertRow(0);
		  var warningCell = warningRow.insertCell(0);
		  var retypeRow = dropdownFormTable.insertRow(1);
		  var retypeCell = retypeRow.insertCell(0);
		  

		  var retypeInput = document.createElement('input');
			  retypeInput.className = "SSdropdownInput";
			  retypeInput.type = "text";
			  retypeInput.id = formInfo.id + parameters.inputlabel; 
			  retypeInput.value = "";
			  retypeCell.appendChild(retypeInput);

		  var warningPara = document.createElement('p');
		  warningPara.className = "SSdropdownText";;
		  warningPara.innerHTML = parameters.warning;
		  warningCell.appendChild(warningPara);
	  } 
	}
	
formBuilder.prototype.modifyForm = function (formInfo) {
	
	var self=this;
	 var parameters = formInfo.clickform.parameters;
	
	    var thisOption = document.getElementById("mainPanelDataForms"); 
	    var thisOptionDiv = document.getElementById("SSdropdownOptionFormModify"); 
	    if (thisOptionDiv) { 
	    	thisOptionDiv.parentNode.removeChild(thisOptionDiv);
	    } else {
	    self.dropdownDestroyAllExcept("SSdropdownOptionForm","SSdropdownOptionFormModify");
		  var optionDiv = document.createElement('div');
		  optionDiv.className = "SSdropdownOptionForm";
		  optionDiv.id = "SSdropdownOptionFormModify";
	    thisOption.appendChild(optionDiv);
	    
	    var dropdownTable = document.createElement('table');
	    dropdownTable.className = "SSdropdownTable";
	    dropdownTable.id        = "SSdropdownTable";
	    var row = dropdownTable.insertRow(0);
	    var cell1 = row.insertCell(0);
	    var cell2 = row.insertCell(1);
	    optionDiv.appendChild(dropdownTable);
	    var dropdownForm = document.createElement('form');
	    dropdownForm.className = "SSdropdownForm";
	    dropdownForm.id = "SSdropdownForm";
	    var dropdownFormHeader = dropdownForm.appendChild(document.createElement('p'));
	    dropdownFormHeader.className = "SSdropdownFormHeader"; 
		var thisObjectId = parameters.modifyobject;	
	    dropdownFormHeader.innerHTML = parameters.header+"<br/>"+thisObjectId;
	    var dropdownFormTable = dropdownForm.appendChild(document.createElement('table'));
	    dropdownFormTable.id = "SSdropdownFormTable";
	    var dropdownButton = document.createElement('button');
	    dropdownButton.className = "SSdropdownButton";
	    dropdownButton.id = "SSdropdownButton";
	    dropdownButton.innerHTML = parameters.submit.label;
	    dropdownButton.addEventListener('click',parameters.submit.onclick );
	    cell1.appendChild(dropdownForm);
	    cell2.appendChild(dropdownButton);

	    var currentTable = document.getElementById(parameters.currentdata);
	    var currentRow = parseInt(parameters.currentrow);
	    
	    for (var i=0;i<parameters.inputs.length;i++) {
	  	  var thisRow = dropdownFormTable.insertRow(i);
	  	  var thisLabelCell = thisRow.insertCell(0);
	  	  var thisInputCell = thisRow.insertCell(1);
	  	  var inputparameters = parameters.inputs[i];
		  if (!inputparameters.choices) {
			  var thisInput = document.createElement('input');
			  thisInput.className = "SSdropdownInput";
			  thisInput.type = "text";
			  thisInput.id = formInfo.label + inputparameters.label;
			  if (currentTable.rows[currentRow].cells[parseInt(inputparameters.currentindex)]) {
			  thisInput.value = currentTable.rows[currentRow].cells[parseInt(inputparameters.currentindex)].innerHTML;
		       }
			  thisInputCell.appendChild(thisInput);
			  } else { if (parameters.inputs[i].choices.length > 0) {
				  var thisInput = document.createElement('select');
				  thisInput.className = "SSdropdownInput";
				  thisInput.type = "text";
				  thisInput.id = formInfo.label + inputparameters.label;
				  thisInputCell.appendChild(thisInput);
				  for (var j=0; j<inputparameters.choices.length; j++) {
					  var thisChoice= document.createElement('option');
					  thisChoice.className = "SSdropdownChoice";
					  thisChoice.value = inputparameters.choices[j];
					  if (currentTable.rows[currentRow].cells[parseInt(inputparameters.currentindex)]) {
					   if (thisChoice.value == currentTable.rows[currentRow].cells[parseInt(inputparameters.currentindex)].innerHTML) {
						  thisChoice.selected = 'selected';
					   }
					  }
					  thisChoice.innerHTML = inputparameters.choices[j];
					  thisChoice.id = formInfo.label + inputparameters.label + inputparameters.choices[j] ;
					  thisInput.appendChild(thisChoice);
				  }
			    }
			  }
	 
	  	  var thisLabel = document.createElement('p');
	  	  thisLabel.className = "SSdropdownInputLabel";
	  	  thisLabel.innerHTML = inputparameters.label;
	  	  thisLabelCell.appendChild(thisLabel);
	    }
	    }
	}

