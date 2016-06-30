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


function secondsidebarOption (OptionId,location,type) {
	
	this.id = OptionId;
	this.location = location;
	this.type = type;
	if (this.type == 'hasactions') {
	  this.actions = new Array(0);
	}

	this.setClick = function (clickfunction) {
		if (this.location) { 
		 var location = document.getElementById(this.location);
		 if (location) {
		 location.addEventListener('click',clickfunction,false);
	     }
		}
	}
	
	this.addAction = function (ActionId,Label) {
	    
	    this.actions.push(ActionId);
	    this.actions[ActionId] = new Object;
	    this.actions[ActionId].id = ActionId;
	    this.actions[ActionId].label = Label;
	    this.actions[ActionId].inputs = new Array(0);
	}
		
	
	this.addActionInput = function (ActionId, InputId, label, type, data, index) {
		   this.actions[ActionId].inputs.push(InputId);
		   this.actions[ActionId].inputs[InputId] = new Object();
		   this.actions[ActionId].inputs[InputId].label = label;
		   if (type == 'addPrompt') {
		      this.actions[ActionId].inputs[InputId].prompt = data;
		   }
		   if (type == 'addChoice') {
			   this.actions[ActionId].inputs[InputId].choices = data;		   
		   }
		   if (type == 'modifyValue') {
			   this.actions[ActionId].inputs[InputId].label = label;
			   this.actions[ActionId].inputs[InputId].currentindex = index;
		   }
		   if (type == 'modifyChoice') {
			   this.actions[ActionId].inputs[InputId].label = label;
			   this.actions[ActionId].inputs[InputId].currentindex = index;
			   this.actions[ActionId].inputs[InputId].choices = data;	
		   }
	}
	
	this.setActionRemoveParameters = function (ActionId, header, currentdata,removeobject,warning,inputlabel) {
		this.actions[ActionId].remove = new Object();
		this.actions[ActionId].remove.header = header;
		this.actions[ActionId].remove.currentdata = currentdata;
		this.actions[ActionId].remove.removeobject = removeobject;
		this.actions[ActionId].remove.warning = warning;
		this.actions[ActionId].remove.inputlabel = inputlabel;
	}
	
	this.setActionModifyParameters = function (ActionId,header, currentdata,modifyobject,currentrow) {
		this.actions[ActionId].modify = new Object();
		this.actions[ActionId].modify.header = header;
		this.actions[ActionId].modify.currentdata = currentdata;
		this.actions[ActionId].modify.modifyobject = modifyobject;
		this.actions[ActionId].modify.currentrow = currentrow; 
	}
	
	this.addActionCancel = function (ActionId, label, cancelclick) {
		   this.actions[ActionId].cancel = new Object();
		   this.actions[ActionId].cancel.label = label;
		   this.actions[ActionId].cancel.click = cancelclick;
	}
	
	this.addActionSubmit = function (ActionId, label, submitclick) {
		   this.actions[ActionId].submit = new Object();
		   this.actions[ActionId].submit.label = label;
		   this.actions[ActionId].submit.click = submitclick;
	}
	
	this.setActionClick = function(ActionId,type) {
		var form = new formBuilder();
		var forminfo = this.actions[ActionId];
		if (type == 'removeForm') {
			this.actions[ActionId].click = function() {form.removeForm(forminfo)};
		}
		if (type == 'modifyForm') {
			this.actions[ActionId].click = function() {form.modifyForm(forminfo)};
			}
	}
}

function secondsidebarToolbar () {
	
	this.init = function () {
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
	  
	  var ssToolbarCentre = document.createElement('li');
	  ssToolbarCentre.id = "secondSidebarTopMenuButtonCentre";
	  ssToolbarCentre.className = "secondSidebarTopMenuButtonCentre";
	  ssToolbarCentre.innerHTML= '';
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
	}
  
    this.setLeftButtonClick = function (clickfunction) {
    	var ssToolbarLeftButtonIcon = document.getElementsByClassName("secondSidebarBackIcon");	
    	ssToolbarLeftButtonIcon[0].addEventListener('click',clickfunction,false);
    }
    
    this.rightButton = new secondsidebarOption('Toolbar','secondSidebarTopMenuActionsIcon','hasactions');
    
    this.setRightButtonClick = function (clickfunction) {
    	this.rightButton.setClick(clickfunction);   			
    }
    
	this.addAction = function (ActionId,Label) {
	    this.rightButton.addAction(ActionId,Label);
	}	
	
	this.addActionInput = function (ActionId, InputId, label, type, data, index) {
		this.rightButton.addActionInput(ActionId, InputId, label, type, data, index);
	}
	
	this.addActionCancel = function (ActionId, label, cancelclick) {
		this.rightButton.addActionCancel(ActionId, label, cancelclick);
	}
	
	this.addActionSubmit = function (ActionId, label, submitclick) {
		 this.rightButton.addActionSubmit(ActionId, label, submitclick);
	}
	
	this.setActionClick = function(ActionId,type) {
         this.rightButton.setActionClick(ActionId,type);
	}
	
	this.setActionRemoveParameters = function (ActionId, header,currentdata,removeobject,warning,inputlabel) {
		this.rightButton.setActionRemoveParameters(ActionId, header,currentdata,removeobject,warning,inputlabel);
	}
	this.setActionModifyParameters = function (ActionId, header,currentdata,modifyobject,currentrow) {
		this.rightButton.setActionModifyParameters(ActionId, header,currentdata,modifyobject,currentrow);
	}
	this.clear = function() {
		var ssToolbarContents = document.getElementById("secondSidebarTopMenu"); 
	    ssToolbarContents.innerHTML = "";
	}
	
	this.setBanner = function(label) {
		var banner = document.getElementById("secondSidebarTopMenuButtonCentre");
		 banner.innerHTML = label;
	}

}

function secondsidebarMenu () {
	
  this.init = function() {
	var thisMenuList = document.getElementById('secondSidebarSideMenu'); 
	thisMenuList.innerHTML = '<ul style="margin:0"></ul>';
	 this.options = new Array(0);
  }
 
  this.addOption = function (OptionId, label, type) {
	    var menuUl = document.getElementById('secondSidebarSideMenu').childNodes[0];
		var optionLi = document.createElement('li');
	    optionLi.innerHTML= label;
		optionLi.className = "secondSidebarSideMenuButton";
		optionLi.id = "secondSidebar" + OptionId;
		menuUl.appendChild(optionLi);	
		
		if (type == 'hasactions') {
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
		}
		
	  this.options.push(OptionId);
	  if (type == 'noactions') {
	  this.options[OptionId] = new secondsidebarOption(OptionId,optionLi.id,type);
      }
	  if (type == 'hasactions') {
		  this.options[OptionId] = new secondsidebarOption(OptionId,optionLi.id + 'Icon',type);
	      }
  }
	
	
	this.clear = function() {
		var ssToolbarContents = document.getElementById("secondSidebarTopMenu"); 
	    ssToolbarContents.innerHTML = "";
	}

}


function mainpanelToolbar () {
	
	this.init = function() {
	var mpToolbarContents = document.getElementById("mainPanelToolbarMenu"); 
    mpToolbarContents.innerHTML = "<ul id=\"mainPanelToolbarMenuList\">" +
                                 "<li class=\"mainPanelToolbarBanner\"></li></ul>";
	}
	
    this.options = new Array(0);
	
	this.clear = function() {
		var mpToolbarContents = document.getElementById("mainPanelToolbarMenu"); 
	    mpToolbarContents.innerHTML = "";
	}
	
	this.setBanner = function(name) {
		var mpToolbarBanner = document.getElementsByClassName("mainPanelToolbarBanner");
		 mpToolbarBanner[0].innerHTML = name;
	}
	
	this.setOptionClick = function(OptionId,type) {
		var toolbarIcon = document.getElementById("mainPanelToolbarIcon"+OptionId); 
		var form = new formBuilder();
		var thisOption = this.options[OptionId];
		if (type == 'addForm') {
		toolbarIcon.addEventListener('click',function(){form.addForm(thisOption)}, false);
		}
		if (type == 'helpForm') {
			toolbarIcon.addEventListener('click',function(){form.helpForm(thisOption)}, false);
			}
	}
		
	this.addOption = function (OptionId,OptionIconImage,OptionHeader) {
		   var mpToolbarList =  document.getElementById("mainPanelToolbarMenu"); 
		    var optionLi = document.createElement('li');
		    var toolbarIconDiv = optionLi.appendChild(document.createElement('div'));
		    toolbarIconDiv.id = "mainPanelToolbarButton" + OptionId;
		    toolbarIconDiv.className = "mainPanelToolbarButton" ;
		    var toolbarIcon = toolbarIconDiv.appendChild(document.createElement('img'));
		    toolbarIcon.className = "mainPanelToolbarIcon";
		    toolbarIcon.id = "mainPanelToolbarIcon"+OptionId;
		    toolbarIcon.src = "images/" + OptionIconImage;
		    
		    this.options.push(OptionId);
		    this.options[OptionId] = new Object;
		    this.options[OptionId].id = OptionId;
		    this.options[OptionId].parent = 'mainPanelDataForms';
		    this.options[OptionId].inputclass = 'MPTdropdownInput';
		    this.options[OptionId].header = OptionHeader;
		    this.options[OptionId].inputs = new Array(0);
	
		    if (mpToolbarList) {
				mpToolbarList.appendChild(optionLi);
			}
	}
	
	this.setOptionHelpfile = function (OptionId, file) {
		this.options[OptionId].helpfile = file;
	}
	
	this.addOptionInput = function (OptionId, InputId, label, type, data) {
		   this.options[OptionId].inputs.push(InputId);
		   this.options[OptionId].inputs[InputId] = new Object();
		   this.options[OptionId].inputs[InputId].label = label;
		   if (type == 'addPrompt') {
		      this.options[OptionId].inputs[InputId].prompt = data;
		   }
		   if (type == 'addChoice') {
			   this.options[OptionId].inputs[InputId].choices = data;
		   }
	}
	
	this.addOptionSubmit = function (OptionId, label, submitclick) {
		   this.options[OptionId].submit = new Object();
		   this.options[OptionId].submit.label = label;
		   this.options[OptionId].submit.click = submitclick;
	}
	
}

function mainpanelTable() {
	
	function isEven(x) { return (x%2)==0; }
	function isOdd(x) { return !isEven(x); }
	
	this.headerRows = 0;
	
	this.init = function(container,tableid) {
	var mpTableContainer = document.getElementById(container);
	if (!document.getElementById(tableid)) { //create a new blank table
    var mpTableResults = document.createElement('table');
    mpTableResults.id = tableid;
    mpTableResults.className = "mainPanelTable";
    mpTableResults.innerHTML = "";
    mpTableContainer.appendChild(mpTableResults);
	} else { // already exists so blank current contents
		var mpTableResults = document.getElementById(tableid);
		mpTableResults.innerHTML = "";
	}
	}
	
	this.addHeader = function (tableid,rows,headings) {
		this.headerRows = rows;
		var mpTableResults = document.getElementById(tableid);
	    var tr_oddStyle = "class=\"mainPanelTable-tr-odd\"";
	    var tr_evenStyle = "class=\"mainPanelTable-tr-even\"";
	    var th_singlestyle = "style= \"border-left: 1px solid; border-right: 1px solid\"";
	    var th_line1style = "style= \"text-align:center;border:1px solid\" colspan=\"2\"";
	    var th_line2style = "style= \"border-left: 1px solid; border-right: 1px solid\"";
	    
	    if (rows == 2) {
	    	   var row1_heading_html = "";
	    	   var row2_heading_html = "";
	    	   for (var i=0; i<headings/2; i++) {
	    		   row1_heading_html += "<th " + th_line1style + "></th>";
	    	   }
	    	   for (var i=0; i<headings; i++) {
	    		   row2_heading_html += "<th " + th_line2style + "></th>";
	    	   }
		       mpTableResults.innerHTML =  "<tr " + tr_evenStyle + ">" + row1_heading_html + "</tr>";
		       mpTableResults.innerHTML += "<tr " + tr_evenStyle + ">" + row2_heading_html + "</tr>";
	    } else {
	    	if (rows == 1) {
	    	   	   var row_heading_html = "";  
	        	   for (i=0; i<headings; i++) {
	        		   row_heading_html += "<th " + th_singlestyle + "></th>";
	        	   }
	        	   mpTableResults.innerHTML =  "<tr " + tr_evenStyle + ">" + row_heading_html + "</tr>";
	      } else {
	    	   mpTableResults.innerHTML = "";
	        }
	    }
	}
	
	this.addRow = function (tableid,index, cells) {
		
		var mpTableResults = document.getElementById(tableid);

	    var newrow = mpTableResults.insertRow(index);
	        if (this.headerRows == 1) {
	         if (isEven(index)) { newrow.className = "mainPanelTable-tr-odd"; }
	         else { newrow.className = "mainPanelTable-tr-even"; }
	        }
	        if (this.headerRows == 2) {
		     if (isEven(index)) { newrow.className = "mainPanelTable-tr-even"; }
		     else { newrow.className = "mainPanelTable-tr-odd"; }   	
	        }
	        for (var i=0;i<cells;i++) {
	        	var newcell = newrow.insertCell(i);
	        }
	}
	 
	this.setCell = function (tableid, row, cell, html) {
		var mpTableResults = document.getElementById(tableid);
		mpTableResults.rows[row].cells[cell].innerHTML = html;
	}
	
	this.setCellAsButton = function(tableid, row, cell, buttonlabel, buttonOnClickFunction) {
		  var mpTableResults = document.getElementById(tableid);
		  var button_oddClass = "mainPanelTableButtonOdd";
		  var button_evenClass = "mainPanelTableButtonEven";
		  if (isEven(row)) { mpTableResults.rows[row].cells[cell].className = button_oddClass;}
		  else {mpTableResults.rows[row].cells[cell].className = button_evenClass;}  
		mpTableResults.rows[row].cells[cell].addEventListener('click',buttonOnClickFunction);
		mpTableResults.rows[row].cells[cell].innerHTML = buttonlabel;
	}
	
	
	this.setCellAsAction = function(tableid, row, cell, buttonlabel,  header) {
		  var thisCell = document.getElementById(tableid).rows[row].cells[cell];
		  thisCell.id = tableid + String(document.getElementById(tableid).rows[row].rowIndex) + String(document.getElementById(tableid).rows[row].cells[cell].cellIndex);
		  if (isEven(row)) { thisCell.className = "mainPanelTableButtonOdd";} else {thisCell.className = "mainPanelTableButtonEven";}  
		   thisCell.action = new Object();
		   thisCell.action.inputs = new Array(0);
		   thisCell.action.parent = 'mainPanelDataForms';
		   thisCell.action.header = header;
		   thisCell.action.id = buttonlabel;
		   thisCell.innerHTML = buttonlabel;
	}
	
	this.setCellActionClick = function(tableid, row, cell,type) {
		var thisCell = document.getElementById(tableid).rows[row].cells[cell];
		var form = new formBuilder();
		if (type == 'addForm') {
		thisCell.addEventListener('click',function() {form.addForm(thisCell.action)}, false);
		}
		if (type == 'helpForm') {
			thisCell.addEventListener('click',function() {form.helpForm(thisCell.action)}, false);
			}
	}
	
	this.addCellActionInput = function(tableid, row, cell, InputId, label, type, data) {
		  var thisCell = document.getElementById(tableid).rows[row].cells[cell];
		   thisCell.action.inputs.push(InputId);
		   thisCell.action.inputs[InputId] = new Object();
		   thisCell.action.inputs[InputId].label = label;
		   if (type == 'addPrompt') {
			   thisCell.action.inputs[InputId].prompt = data;
		   }
		   if (type == 'addChoice') {
			   thisCell.action.inputs[InputId].choices = data;
		   }
	}
		   
	this.addCellActionSubmit = function (tableid, row, cell,label, submitclick) {
		 var thisCell = document.getElementById(tableid).rows[row].cells[cell];
			 thisCell.action.submit = new Object();
			 thisCell.action.submit.label = label;
			 thisCell.action.submit.click = submitclick;
			}
}

function mainpanelDataForms () {
	
	this.init = function() {
	  var mpDataFormsContents = document.getElementById("mainPanelDataForms"); 
	    mpDataFormsContents.innerHTML = "";
	    this.tables = new Array(0);
	}
	

	
	this.clear = function() {
		var mpToolbarContents = document.getElementById("mainPanelDataForms"); 
	    mpToolbarContents.innerHTML = "";
	}
		
	this.addTable = function (tableid) {
		this.tables.push(tableid);
		this.tables[tableid] = new mainpanelTable();
		this.tables[tableid].init('mainPanelDataForms',tableid);
	}
	
	this.addSpacer = function (numlines) {	 
		var mpSpacerContainer = document.getElementById("mainPanelDataForms");
		var mpSpacer;
		if (!document.getElementById("mainPanelSpacer")) { //create a new blank table
	    mpSpacer = document.createElement('p');
	    mpSpacer.id = "mainPanelSpacer";
	    mpSpacerContainer.appendChild(mpSpacer);
		} else { // already exists
		   mpSpacer = document.getElementById("mainPanelSpacer");
		}
		var text = ""; var j;
		for (j=0; j< numlines; j++) {text += "<br/>";}
		mpSpacer.innerHTML = text;
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
	    	    if (iconActions[actionid] != undefined) {
	    	    if (iconActions[actionid].forminfo != undefined) {thisAction.forminfo = iconActions[actionid].forminfo;}
	    	    if (iconActions[actionid].label != undefined) {thisAction.innerHTML = iconActions[actionid].label;}
	    	    dropdownUl.appendChild(thisAction);
	            if (iconActions[actionid].click != undefined) {thisAction.addEventListener('click',iconActions[actionid].click,false);}
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
		    dropdownFormHeader.innerHTML = formInfo.header;
		    var dropdownFormTable = dropdownForm.appendChild(document.createElement('table'));
		    dropdownFormTable.id = "MPTdropdownFormTable";
		    var dropdownButton = cell2.appendChild(document.createElement('button'));
		    dropdownButton.className = "MPTdropdownButton";
		    dropdownButton.id = "MPTdropdownButton";
		    dropdownButton.innerHTML = formInfo.submit.label;
		    dropdownButton.addEventListener('click',formInfo.submit.click, false);
		    
		    
		    for (var i=0; i<formInfo.inputs.length; i++) {
		  	  var thisRow = dropdownFormTable.insertRow(i);
		  	  var thisLabelCell = thisRow.insertCell(0);
		  	  var thisInputCell = thisRow.insertCell(1);
		  	  var inputname = formInfo.inputs[i];
		  	  if (formInfo.inputs[inputname].prompt) {
		  	  var thisInput = document.createElement('input');
		  	  thisInput.className = "MPTdropdownInput";
		  	  thisInput.type = "text";
		  	  thisInput.id = "MPTdropdownInput" + inputname;
		  	  thisInput.fieldindex = i;
		  	  thisInput.value = formInfo.inputs[inputname].prompt;
		  	  thisInput.prompt = formInfo.inputs[inputname].prompt;
		  	  thisInputCell.appendChild(thisInput);
		  	  thisInput.onkeydown = keydownFunction(thisInput.id); 

		  	  } else { if (formInfo.inputs[inputname].choices.length > 0) {
		  		  var thisInput = document.createElement('select');
		  		  thisInput.className = "MPTdropdownInput";
		  		  thisInput.type = "text";
		  		  thisInput.id = "MPTdropdownInput" + inputname;
		  		  thisInput.fieldindex = i;
		  		  thisInputCell.appendChild(thisInput);
		  		  for (var j=0; j<formInfo.inputs[inputname].choices.length; j++) {
		  			  var thisChoice= document.createElement('option');
		  			  thisChoice.className = "MPTdropdownChoice";
		  			  thisChoice.value = formInfo.inputs[inputname].choices[j];
		  			  thisChoice.innerHTML = formInfo.inputs[inputname].choices[j];
		  			  thisChoice.id = formInfo.inputs[inputname].id + formInfo.inputs[inputname].choices[j] ;
		  			  thisInput.appendChild(thisChoice);
		  		  }
		  	    }
		  	  }
		  	  var thisLabel = document.createElement('p');
		  	  thisLabel.className = "MPTdropdownInputLabel";
		  	  thisLabel.innerHTML = formInfo.inputs[inputname].label;
		  	  thisLabelCell.appendChild(thisLabel);
		    }
			}
		}
}
	
	
formBuilder.prototype.helpForm = function (formInfo) {

	        var self=this;
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
			    dropdownHelpFrame.setAttribute("src",formInfo.helpfile);

			    var dropdownButton = cell2.appendChild(document.createElement('button'));
			    dropdownButton.className = "MPTdropdownButton";
			    dropdownButton.id = "MPTdropdownButton";
			    dropdownButton.innerHTML = formInfo.submit.label;
			    dropdownButton.addEventListener('click',formInfo.submit.click, false);
			  }
			}	
	}
	
formBuilder.prototype.removeForm = function (formInfo) {

	var self=this;
		  
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
	  dropdownFormHeader.innerHTML = formInfo.remove.header+"<br/>"+formInfo.remove.removeobject;
	  var dropdownFormTable = dropdownForm.appendChild(document.createElement('table'));
	  dropdownFormTable.id = "SSdropdownFormTable";
	  
	  var cancelButton = document.createElement('button');
	  cancelButton.className = "SSdropdownButton";
	  cancelButton.id = "SSdropdownButton";
	  cancelButton.innerHTML = formInfo.cancel.label;
	
	  var confirmButton = document.createElement('button');
	  confirmButton.className = "SSdropdownButton";
	  confirmButton.id = "SSdropdownButton";
	  confirmButton.innerHTML = formInfo.submit.label;
	 
	  cell1.appendChild(dropdownForm);
	  cell2.appendChild(cancelButton);
	  cancelButton.addEventListener("click",formInfo.cancel.click,false );
	  cell2.appendChild(confirmButton);
	  confirmButton.addEventListener("click",formInfo.submit.click,false );
	  
		  var warningRow = dropdownFormTable.insertRow(0);
		  var warningCell = warningRow.insertCell(0);
		  var retypeRow = dropdownFormTable.insertRow(1);
		  var retypeCell = retypeRow.insertCell(0);
		  

		  var retypeInput = document.createElement('input');
			  retypeInput.className = "SSdropdownInput";
			  retypeInput.type = "text";
			  retypeInput.id = formInfo.id + formInfo.remove.inputlabel; 
			  retypeInput.value = "";
			  retypeCell.appendChild(retypeInput);

		  var warningPara = document.createElement('p');
		  warningPara.className = "SSdropdownText";;
		  warningPara.innerHTML = formInfo.remove.warning;
		  warningCell.appendChild(warningPara);
	  } 
	}
	
formBuilder.prototype.modifyForm = function (formInfo) {
	
	var self=this;
	
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
		var thisObjectId = formInfo.modify.modifyobject;	
	    dropdownFormHeader.innerHTML = formInfo.modify.header+"<br/>"+thisObjectId;
	    var dropdownFormTable = dropdownForm.appendChild(document.createElement('table'));
	    dropdownFormTable.id = "SSdropdownFormTable";
	    var dropdownButton = document.createElement('button');
	    dropdownButton.className = "SSdropdownButton";
	    dropdownButton.id = "SSdropdownButton";
	    dropdownButton.innerHTML = formInfo.submit.label;
	    dropdownButton.addEventListener('click',formInfo.submit.click );
	    cell1.appendChild(dropdownForm);
	    cell2.appendChild(dropdownButton);

	    var currentTable = document.getElementById(formInfo.modify.currentdata);
	    var currentRow = parseInt(formInfo.modify.currentrow);
	    
	    for (var i=0;i<formInfo.inputs.length;i++) {
	  	  var thisRow = dropdownFormTable.insertRow(i);
	  	  var thisLabelCell = thisRow.insertCell(0);
	  	  var thisInputCell = thisRow.insertCell(1);
	  	  var inputname = formInfo.inputs[i];
	  	  
		  if (!formInfo.inputs[inputname].choices) {
			  var thisInput = document.createElement('input');
			  thisInput.className = "SSdropdownInput";
			  thisInput.type = "text";
			  thisInput.id = formInfo.label + formInfo.inputs[inputname].label;
			  if (currentTable.rows[currentRow].cells[parseInt(formInfo.inputs[inputname].currentindex)]) {
			  thisInput.value = currentTable.rows[currentRow].cells[parseInt(formInfo.inputs[inputname].currentindex)].innerHTML;
		       }
			  thisInputCell.appendChild(thisInput);
			  } else { if (formInfo.inputs[inputname].choices.length > 0) {
				  var thisInput = document.createElement('select');
				  thisInput.className = "SSdropdownInput";
				  thisInput.type = "text";
				  thisInput.id = formInfo.label + formInfo.inputs[inputname].label;
				  thisInputCell.appendChild(thisInput);
				  for (var j=0; j<formInfo.inputs[inputname].choices.length; j++) {
					  var thisChoice= document.createElement('option');
					  thisChoice.className = "SSdropdownChoice";
					  thisChoice.value = formInfo.inputs[inputname].choices[j];
					  if (currentTable.rows[currentRow].cells[parseInt(formInfo.inputs[inputname].currentindex)]) {
					   if (thisChoice.value == currentTable.rows[currentRow].cells[parseInt(formInfo.inputs[inputname].currentindex)].innerHTML) {
						  thisChoice.selected = 'selected';
					   }
					  }
					  thisChoice.innerHTML = formInfo.inputs[inputname].choices[j];
					  thisChoice.id = formInfo.label + formInfo.inputs[inputname].label + formInfo.inputs[inputname].choices[j] ;
					  thisInput.appendChild(thisChoice);
				  }
			    }
			  }
	 
	  	  var thisLabel = document.createElement('p');
	  	  thisLabel.className = "SSdropdownInputLabel";
	  	  thisLabel.innerHTML = formInfo.inputs[inputname].label;
	  	  thisLabelCell.appendChild(thisLabel);
	    }
	    }
	}
