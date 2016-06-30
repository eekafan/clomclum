function encryptController () {

    this.bldform = new formBuilder();
    this.session = new userSession();

}

encryptController.prototype.dialogue = function () {
	
    var self=this;
	 
	 var ss = new secondsidebar(); ss.collapse();
	 var ssToolbar = new secondsidebarToolbar(); ssToolbar.init();
	 var ssMenu = new secondsidebarMenu(); ssMenu.init();


	 var mpToolbar = new mainpanelToolbar();  mpToolbar.init();
	 mpToolbar.setBanner('Encrypted Credentials');
	
     var mpDataForms = new mainpanelDataForms(); mpDataForms.init();
     var tableid = 'mainPanelEncrypt';
     mpDataForms.addTable(tableid);
	 
	    var mpTable = document.getElementById('mainPanelEncrypt');
	    mpTable.innerHTML = "";
	    mpTable.innerHTML += "<tr><td>";
	    mpTable.innerHTML += "<form>";
	    mpTable.innerHTML += "This option is intended for use by system administrators.<br>";
	    mpTable.innerHTML += "It can be used to find the encryption string required for<br>";
	    mpTable.innerHTML += "the service account credentials in the server.xml context parameters for a cluster<br>";
	    mpTable.innerHTML += "<br/><br/>";
	    mpTable.innerHTML += "Please Enter the Password for encryption<br/>";
	    mpTable.innerHTML += "<input type=\"password\" name=\"encryptInput\" id=\"encryptInput\"><br/><br/>";
	    mpTable.innerHTML += "Encrypted String<br/>";
	    mpTable.innerHTML += "<textarea name=\"encryptResponse\" id=\"encryptResponse\" style=\"width:70%;resize:none\" >";
	    mpTable.innerHTML += "</form><br/><br/>";
	    mpTable.innerHTML += "<button type=\"button\" id=\"encryptButton\"" +
	                                "onclick=\"var controller = new encryptController();controller.getEncryptedCredentials();\">Encrypt</button><br/>";
	    mpTable.innerHTML += "</td></tr>";
   
}

encryptController.prototype.getEncryptedCredentials = function (){
	
	  var req = newXMLHttpRequest();
	  req.onreadystatechange = getReadyStateHandler(req, 
	   function(response){
	     var responsebox = document.getElementById("encryptResponse");
	     var item = JSON.parse(response);
	     if (item.encrypted) {
	        responsebox.value = item.encrypted;
	        } else {responsebox.value = "Problem Encrypting";} 
	   }
	  );
	  req.open("POST", "encryptCredentials", true);
	  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");	  
	  var credentials = document.getElementById("encryptInput").value;	  
	  req.send("credentials="+credentials);
}
