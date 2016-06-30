package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.api.model.DbInfo;
import com.cloudant.client.api.model.DesignDocument;
import com.cloudant.client.api.model.Response;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;


/**
 * Servlet implementation class fetchDocumentStores
 */
@WebServlet({"/documentstore","/_all_documentstores","/_all_documentstores/add","/documentstore/modify", "/documentstore/manage","/documentstore/unmanage"})
public class documentstoreServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	private static List<String> parseURI(HttpServletRequest request) {
		String uriElements[] =request.getRequestURI().split("/");
		List<String> endpointItems = new ArrayList<String>();
		int index = 2;
		if (uriElements.length >= 2) {
		  while (index < uriElements.length ) {
			endpointItems.add(uriElements[index]);
			index++;
		  }
		}
		return(endpointItems);
	}
	
	private static JsonObject unmanageDatabase(Database registryDB, JsonObject inputs) throws  IOException {

		JsonObject response = new JsonObject();
		try {
		 JsonObject item = new JsonObject();	 
			 
			 if (inputs.has("id")) {	
				 item = registryDB.find(JsonObject.class,inputs.get("id").getAsString());
				 Response Result = registryDB.remove(item);
 		        if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Modifying this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Documentstore id is empty");	
				}
			
		 }
		catch (com.cloudant.client.org.lightcouch.DocumentConflictException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Duplicate identifier");
		}
		catch (com.cloudant.client.org.lightcouch.CouchDbException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Problem Accessing Registry");
		}

			if (!(response.has("result")))  {
				response.addProperty("result","Failure");
				response.addProperty("reason","Indeterminate");
			}
			System.out.println("Documentstore Unmanage Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);
	}
		
	private static JsonObject manageDatabase(Database registryDB, ServletContext ctx, JsonObject inputs) throws  IOException {
		
		JsonObject response = new JsonObject();
		try {
			 JsonObject item = new JsonObject();	
			 System.out.println(inputs.toString());
			 if (inputs.has("dbid") && inputs.has("clusterid")) {
				 String documentstoreid = inputs.get("clusterid").getAsString() + "." + inputs.get("dbid").getAsString(); // naming convention for all docstores		 
				 if (registryDB.contains(documentstoreid)) {  
    		     item = registryDB.find(JsonObject.class,documentstoreid);
                 if (item.has("managedstatus")) {
                	if (item.get("managedstatus").getAsString().equals("managed")) {
                			//do nothing and report error
                		   response.addProperty("result","Failure");
						   response.addProperty("reason","Document store is already managed");	
                	    }
                	if (item.get("managedstatus").getAsString().equals("unmanaged")) {
                          	CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,inputs.get("clusterid").getAsString());
                        	Database thisDB = clusterClient.database(inputs.get("dbid").getAsString(), false);
                        	JsonObject documentStoreSecurityObject = thisDB.find(JsonObject.class,"_security");
                        	clusterClient.shutdown();     
                        	if (item.has("securityobject")){item.remove("securityobject");}
                          	item.add("securityobject", documentStoreSecurityObject);
                          	item.remove("managedstatus"); item.addProperty("managedstatus", "managed");
                        	Response responseupdate = registryDB.update(item);
                        	if (!responseupdate.getError().isEmpty()) {response.addProperty("result","Success");}
                        	else {
                    			  response.addProperty("result","Failure");
                    		      response.addProperty("reason","Problems Managing Document Store");
                        	}
                		}
                	} else { // no managedstatus property        		
                    	CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,inputs.get("clusterid").getAsString());
                    	Database thisDB = clusterClient.database(inputs.get("dbid").getAsString(), false);
                    	JsonObject documentStoreSecurityObject = thisDB.find(JsonObject.class,"_security");
                    	clusterClient.shutdown();     
                    	if (item.has("securityobject")){item.remove("securityobject");}
                      	item.add("securityobject", documentStoreSecurityObject);
                      	item.addProperty("managedstatus", "managed");
                    	Response responseupdate = registryDB.update(item);
                      	if (!responseupdate.getError().isEmpty()) {response.addProperty("result","Success");}
                    	else {
                			  response.addProperty("result","Failure");
                		      response.addProperty("reason","Problems Managing Document Store");
                    	}
                	}
				  }
                  else { // new registry entry required for this documentstore
                	    JsonObject clusterDetails = registryDB.find(JsonObject.class,inputs.get("clusterid").getAsString());
                    	JsonObject documentEntry = new JsonObject();
                       	JsonObject securityObjectAsJson = new JsonObject();
                    	documentEntry.addProperty("_id", inputs.get("clusterid").getAsString() + "." + inputs.get("dbid").getAsString());
                    	documentEntry.addProperty("cluster", inputs.get("clusterid").getAsString());
                    	documentEntry.addProperty("type", "docstore-settings");
                    	documentEntry.addProperty("dbid", inputs.get("dbid").getAsString());
                    	documentEntry.addProperty("securitytype", clusterDetails.get("securitytype").getAsString());
                    	if (inputs.has("name")) { documentEntry.addProperty("name", inputs.get("name").getAsString()); } 
                    	  else {documentEntry.addProperty("name", inputs.get("dbid").getAsString());}
                    	if (inputs.has("appscope")) { documentEntry.addProperty("scopetype", inputs.get("appscope").getAsString()); } 
                    	  else {documentEntry.addProperty("scopetype", "Unspecified");}
                    	documentEntry.addProperty("managedstatus", "managed");
                    	documentEntry.addProperty("syncmaster", "registry");
                    	documentEntry.addProperty("doclimit", "1000");
                    	
                    	 // security object handling - if no roles supplied then fetch any existing security document and add it to document
                    	if (!inputs.has("adminroles") && !inputs.has("memberroles")) {
                    		CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,inputs.get("clusterid").getAsString());
                          	Database thisDB = clusterClient.database(inputs.get("dbid").getAsString(), false);
                        	JsonObject documentStoreSecurityObject = thisDB.find(JsonObject.class,"_security");
                        	clusterClient.shutdown();
                        	documentEntry.add("securityobject", documentStoreSecurityObject);
                        	
                    	} else { // user has requested new roles to be applied so build a security document with those
                    	
                    	 JsonArray adminRoles = new JsonArray();  
                    	 JsonArray memberRoles = new JsonArray();   	
   			    	     if (inputs.has("adminroles")) {
			    		 String roles[] = inputs.get("adminroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");	 
			    		  for (int j = 0; j< roles.length; j++) {
		    			    if (!roles[j].isEmpty()) { JsonPrimitive element = new JsonPrimitive(roles[j]); adminRoles.add(element);}
		    			  }
   			    	     }
			    	     if (inputs.has("memberroles")) {
			    		 String roles[] = inputs.get("memberroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
			    			 
			    		 for (int j = 0; j< roles.length; j++) {
			    		    if (!roles[j].isEmpty()) {  JsonPrimitive element = new JsonPrimitive(roles[j]); memberRoles.add(element);}
			    		  }
		    		     }
	
						 JsonObject members = new JsonObject();	 
						 members.add("names",new JsonArray()); members.add("roles", memberRoles);
						 JsonObject admins = new JsonObject(); admins.add("names",new JsonArray()); 
						 admins.add("roles", adminRoles);
						 JsonObject securityEntry = new JsonObject();		 
				         securityEntry.add("admins", admins); securityEntry.add("members",members);
				         System.out.println(securityEntry.toString());
				         CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,inputs.get("clusterid").getAsString());
				         Boolean putResult = CloudantSecurityCommon.putCouchdbSecurityDocument (clusterClient, clusterDetails,inputs.get("dbid").getAsString(), securityEntry);
				         clusterClient.shutdown();
				         if (putResult) { documentEntry.add("securityobject", securityEntry);}
                    	}
                    	
                    	String result = documentEntry.toString();
           				Response entryResult = registryDB.post(documentEntry);
            			if (registryDB.contains(documentEntry.get("_id").getAsString())) {response.addProperty("result","Success");} 
            			 else {
            			  response.addProperty("result","Failure");
            		      response.addProperty("reason","Problems Managing Document Store");
            			 }
                       
			       }
			
			 }
			 
	    }
		catch (com.cloudant.client.org.lightcouch.DocumentConflictException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Duplicate identifier");
		}
		catch (com.cloudant.client.org.lightcouch.CouchDbException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Problem Accessing Registry");
		}

			if (!(response.has("result")))  {
				response.addProperty("result","Failure");
				response.addProperty("reason","Indeterminate");
			}
			System.out.println("Documentstore Manage Attempt for ["+inputs.get("dbid").getAsString()+"] result="+response);
			return(response);
	}
	
private static JsonObject modifyDocumentstore(Database thisDB, ServletContext ctx, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("id")) {
				 item = thisDB.find(JsonObject.class,inputs.get("id").getAsString());
				 if (inputs.has("syncmaster")) {
				  		 if (item.has("syncmaster")) {item.remove("syncmaster");}
			    		 item.addProperty("syncmaster",inputs.get("syncmaster").getAsString());}

				 if (inputs.has("adminroles") || inputs.has("adminnames") || inputs.has("memberroles") || inputs.has("membernames")) {
               	 JsonArray adminRoles = new JsonArray();  
               	 JsonArray adminNames = new JsonArray();
            	 JsonArray memberRoles = new JsonArray();  
            	 JsonArray memberNames = new JsonArray();
		    	 if (inputs.has("adminroles")) {
	    		 String roles[] = inputs.get("adminroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");	 
	    		  for (int j = 0; j< roles.length; j++) {
    			    if (!roles[j].isEmpty()) { JsonPrimitive element = new JsonPrimitive(roles[j]); adminRoles.add(element);}
    			  }
		    	 }
		    	 if (inputs.has("adminnames")) {
	    		 String roles[] = inputs.get("adminnames").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");	 
	    		  for (int j = 0; j< roles.length; j++) {
    			    if (!roles[j].isEmpty()) { JsonPrimitive element = new JsonPrimitive(roles[j]); adminNames.add(element);}
    			  }
		    	 }
	    	     if (inputs.has("memberroles")) {
	    		 String roles[] = inputs.get("memberroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
	    			 
	    		 for (int j = 0; j< roles.length; j++) {
	    		    if (!roles[j].isEmpty()) {  JsonPrimitive element = new JsonPrimitive(roles[j]); memberRoles.add(element);}
	    		  }
    		     }
	    	     if (inputs.has("membernames")) {
	    		 String roles[] = inputs.get("membernames").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
	    			 
	    		 for (int j = 0; j< roles.length; j++) {
	    		    if (!roles[j].isEmpty()) {  JsonPrimitive element = new JsonPrimitive(roles[j]); memberNames.add(element);}
	    		  }
    		     }
				 JsonObject members = new JsonObject();	 
				 members.add("names",memberNames); members.add("roles", memberRoles);
				 JsonObject admins = new JsonObject(); 
				 admins.add("names",adminNames); admins.add("roles", adminRoles);
				 JsonObject securityEntry = new JsonObject();		 
		         securityEntry.add("admins", admins); securityEntry.add("members",members);

         	        JsonObject clusterDetails = thisDB.find(JsonObject.class,item.get("cluster").getAsString());
			        CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (thisDB,ctx,item.get("cluster").getAsString());

	        		if (item.get("syncmaster").getAsString().equals("registry")) {
	       		    Boolean putResult = CloudantSecurityCommon.putCouchdbSecurityDocument (clusterClient, clusterDetails, 
	       		    		  item.get("dbid").getAsString(), securityEntry);
	                if (putResult) {item.remove("securityobject");	item.add("securityobject", securityEntry);}
	          		}
	             	if (item.get("syncmaster").getAsString().equals("database")) {
	             		Database currentDB = clusterClient.database(item.get("dbid").getAsString(), false);
	      				JsonObject documentStoreSecurityObject = currentDB.find(JsonObject.class,"_security");
	      				item.remove("securityobject");	item.add("securityobject", documentStoreSecurityObject);
	            	}
				  }
				 
  	              Response Result = thisDB.update(item);
 		          if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Modifying this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Documentstore id is empty");	
				}
				 
		}
		catch (com.cloudant.client.org.lightcouch.DocumentConflictException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Duplicate identifier");
		}
		catch (com.cloudant.client.org.lightcouch.CouchDbException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Illegal identifier");
		}

			if (!(response.has("result")))  {
				response.addProperty("result","Failure");
				response.addProperty("reason","Indeterminate");
			}
			System.out.println("Documentstore Modify Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	

	private static JsonObject addDatabaseOnCluster(HttpSession session, ServletContext ctx, Database registryDB, String fullid, JsonObject template, 
			JsonObject cluster, JsonElement designdoclist, JsonElement adminRolesElement, JsonElement memberRolesElement)  throws IOException, InterruptedException{
		
		String username = session.getAttribute("sessionUsername").toString();
		String numcopies = template.get("numcopies").getAsString();
		String quorum = template.get("quorum").getAsString();
		String read = template.get("read").getAsString();
		String write = template.get("write").getAsString();	
		String clusterid = cluster.get("_id").getAsString();
		
		JsonObject response = new JsonObject();
		
		try {
		CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB, ctx, clusterid);
	//	System.out.println(clusterClient.getAllDbs().toString());
		if (clusterClient != null) {
			    if (!clusterClient.getAllDbs().contains(fullid)){
			    	 clusterClient.createDB(fullid);
			    	 
					 JsonObject members = new JsonObject();	 JsonArray membernames = new JsonArray(); 
					 membernames.add(new JsonPrimitive(username));
					 members.add("names",membernames); members.add("roles", memberRolesElement);
					 JsonObject admins = new JsonObject(); admins.add("names",new JsonArray()); 
					 admins.add("roles", adminRolesElement);
					 JsonObject securityEntry = new JsonObject();		 
			         securityEntry.add("admins", admins); securityEntry.add("members",members);
			      //   System.out.println(securityEntry.toString());
			        Boolean putResult = CloudantSecurityCommon.putCouchdbSecurityDocument (clusterClient, cluster, fullid, securityEntry);
			        
	
			        if (putResult) { 
			        	// add the design documents
			        	for (int i=0; i< designdoclist.getAsJsonArray().size(); i++) {
			        	   DesignDocument thisdoc = registryDB.getDesignDocumentManager().get(designdoclist.getAsJsonArray().get(i).getAsString());
			        	   thisdoc.setRevision(null); // null the revision ready for new addition to the db
			        	   Database thisdb = clusterClient.database(fullid, false);
			        	   thisdb.getDesignDocumentManager().put(thisdoc);
			        	}
			        	// sync the _users with LDAP to allow writing to this new DB
			        	TimeUnit.SECONDS.sleep(1);
			        	JsonObject syncuserResult = clusterServlet.syncClusterUsers(registryDB, ctx, clusterid, "new");
			        	clusterClient.shutdown();
			        	response.addProperty("result","Success");
			        }
					else {
				        clusterClient.shutdown();
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems setting permissions");	
					}
				} else {
					clusterClient.shutdown();
					response.addProperty("result","Failure");
					response.addProperty("reason","Duplicate id");
				}	
             }
             else {
            	 response.addProperty("result","Failure");
            	 response.addProperty("reason","No access to add this Database");
             }
		}
		catch (com.cloudant.client.org.lightcouch.DocumentConflictException e) {
			System.out.println("Reached this error: "+e);
			e.printStackTrace();
			response.addProperty("result","Failure");
			response.addProperty("reason","Duplicate identifier");
		}
		catch (com.cloudant.client.org.lightcouch.CouchDbException e) {
			System.out.println("Reached this error: "+e);
			e.printStackTrace();
			response.addProperty("result","Failure");
			response.addProperty("reason","Illegal identifier or");
		}
		catch (InterruptedException e) {
			System.out.println("Reached this error: "+e);
			e.printStackTrace();
			response.addProperty("result","Failure");
			response.addProperty("reason","Error while sleeping");
		}

			if (!(response.has("result")))  {
				response.addProperty("result","Failure");
				response.addProperty("reason","Indeterminate");
			}
			System.out.println("DB Create Attempt for ["+fullid+"] result="+response);
			return(response);

	}
	
	
	
	private static JsonObject processPolicy(String fullid, HttpServletRequest request, HttpSession session, 
			ServletContext ctx, Database registryDB, JsonObject PolicyDoc) throws IOException, InterruptedException {

		String clusterId = PolicyDoc.get("cluster").getAsString();
		
		JsonObject result = new JsonObject();
		
		// find template and cluster details referenced by this policy
		JsonObject templateDetails = registryDB.find(JsonObject.class,PolicyDoc.get("template").getAsString());
		JsonObject clusterDetails = registryDB.find(JsonObject.class,clusterId);


		if (clusterDetails.has("_id") &&  templateDetails.has("_id")) {
			
			String designlistname = templateDetails.get("designlist").getAsString();
			String designlistid = "designlist."+ designlistname.replaceAll("\\s","").toLowerCase();
			JsonObject designlistDetails = registryDB.find(JsonObject.class,designlistid);

			JsonObject addDBresponse = addDatabaseOnCluster(session,ctx,registryDB,fullid,
					templateDetails,clusterDetails,designlistDetails.get("list"),PolicyDoc.get("adminroles"),PolicyDoc.get("memberroles"));
            if (addDBresponse.get("result").getAsString().equals("Success")) {  
            	JsonObject documentEntry = new JsonObject();
               	JsonObject securityObjectAsJson = new JsonObject();
            	documentEntry.addProperty("_id", clusterId+"."+fullid);
            	documentEntry.addProperty("cluster", clusterId);
            	documentEntry.addProperty("type", "docstore-settings");
            	documentEntry.addProperty("name", request.getParameter("name"));
            	documentEntry.addProperty("dbid", fullid);
            	documentEntry.addProperty("securitytype", clusterDetails.get("securitytype").getAsString());
            	documentEntry.addProperty("scopetype", request.getParameter("appscope"));
            	documentEntry.addProperty("managedstatus", "managed");
            	documentEntry.addProperty("syncmaster", PolicyDoc.get("syncmaster").getAsString());
            	documentEntry.add("creationPolicy", PolicyDoc);
            	documentEntry.add("creationTemplate", templateDetails);
            	documentEntry.add("creationDesignlist", designlistDetails);
            	documentEntry.addProperty("doclimit", "1000");
            	try {
        		CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB, ctx, clusterId);
    			if (clusterClient != null) {
    				Database newDB = clusterClient.database(fullid, false);
    				securityObjectAsJson = newDB.find(JsonObject.class,"_security");
    				clusterClient.shutdown();     
    			}
    			if (securityObjectAsJson != null) {
    				documentEntry.add("securityobject", securityObjectAsJson);
    			} else {
    				documentEntry.add("securityobject", 
    						(JsonObject) new JsonParser().parse("{}"));
    			}
    				Response entryResult = registryDB.post(documentEntry);
    				if (registryDB.contains(documentEntry.get("_id").getAsString())) {
    					result.addProperty("result","Success");
    					return(result);
    				} else {
    					result.addProperty("result","Failure");
    		           	 result.addProperty("reason","Problems Adding Registry Entry for new Document Store");
    					return(result);
    				}
            	} finally {
            		// holding place while detecting catch block exceptions in testing
            	}
            }
            else { // failure on db create so return the reason
            	return(addDBresponse);
            }
		}
		else {
       	 result.addProperty("result","Failure");
       	 result.addProperty("reason","Policy Details problem");
       	 return(result);
		}
	}	
	
	private static String getPrivilegeCouchdb (JsonObject docstoreItem, String sessionUsername, List<String> sessionRoles) {
		
		Boolean adminfound = false; Boolean memberfound = false;
		
			// username in admin names
	    	 JsonArray adminnames = new JsonArray();
	    	 if (docstoreItem.getAsJsonObject("securityobject").getAsJsonObject("admins")!= null) {
	    	 adminnames =  docstoreItem.getAsJsonObject("securityobject").getAsJsonObject("admins").getAsJsonArray("names");
	         int i = 0; 
	    	 while (i<adminnames.size() && !adminfound) {
	           if (adminnames.get(i).getAsString().equals(sessionUsername)) { adminfound = true;} 
	           i++;
	          }	 
	    	 if (adminfound) { return ("admin"); }
	    	 else { // user roles in admin roles
	    	    JsonArray adminroles = new JsonArray();
	    	    adminroles =  docstoreItem.getAsJsonObject("securityobject").getAsJsonObject("admins").getAsJsonArray("roles");
	            i = 0; 
	    	    while (i<adminroles.size() && !adminfound) {
	    	     for (String role : sessionRoles) {
	             if (adminroles.get(i).getAsString().equals(role)) { adminfound = true;} 
	    	     }
	             i++;
	            }
	    	    if (adminfound) { return ("admin"); }
	    	    else { // username in member names
	   	    	 JsonArray membernames = new JsonArray();
	   	    	 if (docstoreItem.getAsJsonObject("securityobject").getAsJsonObject("admins")!= null) {
		    	 membernames =  docstoreItem.getAsJsonObject("securityobject").getAsJsonObject("members").getAsJsonArray("names");
		         i = 0; 
		    	 while (i<membernames.size() && !memberfound) {
		           if (membernames.get(i).getAsString().equals(sessionUsername)) { memberfound = true;} 
		           i++;
		          }	    	
		    	 if (memberfound) { return ("member"); }	
		    	 else {
			    	    JsonArray memberroles = new JsonArray();
			    	    adminroles =  docstoreItem.getAsJsonObject("securityobject").getAsJsonObject("members").getAsJsonArray("roles");
			            i = 0; 
			    	    while (i<memberroles.size() && !memberfound) {
			    	     for (String role : sessionRoles) {
			             if (memberroles.get(i).getAsString().equals(role)) { memberfound = true;} 
			    	     }
			             i++;	    		 
			    	    }
			      if (memberfound) {return ("member"); }
		    	  }
		    	  } 	
	    	     }
	    	    } 
	    	 }
	 return("none"); // default
	}
	
	public static String buildResponseToIdRequest (Database registryDB,  HttpSession session, JsonObject inputs) throws  IOException {
		  if (inputs.has("id")) { 
		   JsonObject docstoreItem = registryDB.find(JsonObject.class,inputs.get("id").getAsString());	
		   if (docstoreItem != null) {
			 if (docstoreItem.has("securitytype")){
			   if (docstoreItem.get("securitytype").getAsString().equals("couchdb")) {
				     String sessionUsername = (String) session.getAttribute("sessionUsername");
				     List<String> sessionRoles = (List<String>) session.getAttribute("sessionRoles");
			         docstoreItem.addProperty("privilege",getPrivilegeCouchdb(docstoreItem,sessionUsername,sessionRoles));
			   }
 			 }
	         return (docstoreItem.toString());
		     }
		     else {return "";}
		  } else {return "";}
	}	
	
	
	
		public static String buildResponseToAppScopeRequest (Database registryDB, HttpSession session, JsonObject inputs) throws  IOException {

		String sessionUsername = (String) session.getAttribute("sessionUsername");
		List<String> sessionRoles = (List<String>) session.getAttribute("sessionRoles");
	    List<JsonObject> docs_all = new ArrayList<JsonObject>();
	    List<String> docs_ids = new ArrayList<String>();
	    String appscope = ""; String securitylevel = "";
	    if (inputs.has("appscope")) { appscope = inputs.get("appscope").getAsString(); }
	    if (inputs.has("securitylevel")) { securitylevel = inputs.get("securitylevel").getAsString(); }
	    else { securitylevel = "all"; }
	    
	    for (String role: sessionRoles) {
	    	List<String> keys = new ArrayList<String>(); keys.add(role);keys.add(appscope);
	    	
	    	if (securitylevel.equals("all") || securitylevel.equals("admin")) {
			List<JsonObject> AdminRoledocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/dbadminroles",keys);
			for (JsonObject thisAdmindoc: AdminRoledocs) {
			 if ((thisAdmindoc.has("_id")) &&  (!(docs_ids.contains(thisAdmindoc.get("_id").getAsString())))) {
				      docs_ids.add(thisAdmindoc.get("_id").getAsString()); docs_all.add(thisAdmindoc);
		            }
		            
			 }
	        }
	    	
	    	if (securitylevel.equals("all") || securitylevel.equals("member")) {
			List<JsonObject> MemberRoledocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/dbmemberroles",keys);
			for (JsonObject thisMemberdoc: MemberRoledocs) { 
			if ((thisMemberdoc.has("_id")) &&  (!(docs_ids.contains(thisMemberdoc.get("_id").getAsString())))) { 
				docs_ids.add(thisMemberdoc.get("_id").getAsString());docs_all.add(thisMemberdoc);
	         }
			}
	    	}
		}
	    
	    List<String> keys = new ArrayList<String>(); keys.add(sessionUsername);keys.add(appscope);
		
    	if (securitylevel.equals("all") || securitylevel.equals("admin")) {
    	List<JsonObject> AdminNamedocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/dbadminnames",keys);
		for (JsonObject thisAdmindoc: AdminNamedocs) {
		 if ((thisAdmindoc.has("_id")) &&  (!(docs_ids.contains(thisAdmindoc.get("_id").getAsString())))) { 
			 docs_ids.add(thisAdmindoc.get("_id").getAsString()); docs_all.add(thisAdmindoc);
		 }
		}
    	}
    	
    	if (securitylevel.equals("all") || securitylevel.equals("member")) {
		List<JsonObject> MemberNamedocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/dbmembernames",keys);
		for (JsonObject thisMemberdoc: MemberNamedocs) {
		 if ((thisMemberdoc.has("_id")) &&  (!(docs_ids.contains(thisMemberdoc.get("_id").getAsString())))) { 
			 docs_ids.add(thisMemberdoc.get("_id").getAsString()); docs_all.add(thisMemberdoc);
		 }
		}
    	}
    	
		if (docs_all.isEmpty()) {
			return("{}");
		} else {
			return(docs_all.toString());
		}
	    
	}

		public static JsonObject addNewDatabase(HttpServletRequest request, HttpSession session, ServletContext ctx, Database registryDB) throws  IOException, InterruptedException {
		
			String account = session.getAttribute("sessionUsername").toString();
			String app=request.getParameter("app");
			String appscope=request.getParameter("appscope");
			String requestedDbId="";
			if (appscope.equals("Personal")) {
			   requestedDbId=request.getParameter("appscope").toLowerCase() + "_" +account.toLowerCase() + "-" + request.getParameter("name").replaceAll("\\s","").toLowerCase();
			}
			if (appscope.equals("Team")) {
				   requestedDbId=request.getParameter("appscope").toLowerCase() +  "_" + request.getParameter("name").replaceAll("\\s","").toLowerCase();
			}
			if (appscope.equals("Enterprise")) {
				   requestedDbId=request.getParameter("appscope").toLowerCase() +  "_" + request.getParameter("name").replaceAll("\\s","").toLowerCase();
			}
			String requestedName=request.getParameter("name");	
			List<String> sessionRoles = (List<String>) session.getAttribute("sessionRoles");
			
            JsonObject latestResult = new JsonObject();
			
		    // where a user has multiple roles, they are tried in list order until one succeeds or all fail
            // 
			// find policy matching (requesting-app,requested-appscope,users-role)
            // policy identifies : cluster to build on, template to set n/q/r/w 
            // default security document uses the adminroles and memberroles from policy
            //
			int index=0; Boolean addSuccess=false;
			while ((index < sessionRoles.size()) && (addSuccess == false)) {
				String processResult = "";
				List<String> keys = new ArrayList<String>(); 
				keys.add(app);keys.add(appscope);keys.add(sessionRoles.get(index).toString());
				List<JsonObject> PolicyDocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/policy",keys);
				// where multiple policies match the compositeKey then use first
				if (PolicyDocs.size() > 0) { 
					latestResult = processPolicy(requestedDbId,request,session, ctx, registryDB,PolicyDocs.get(0));
					if (latestResult.get("result").getAsString().equals("Success")){addSuccess = true;}
				}		
				index++;
			}
		    if (!(latestResult.has("result"))) {
		// no matching policies found for [app,appscope,requestingroles] so look for match with [app,appscope]
	    //
			List<String> keys = new ArrayList<String>(); 
			keys.add(app);keys.add(appscope);
			List<JsonObject> PolicyDocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/policydefaults",keys);
			if (PolicyDocs.size() > 0) { 
				latestResult = processPolicy(requestedDbId,request,session, ctx, registryDB,PolicyDocs.get(0));
		    }
		} 
		return(latestResult);	
		}
		
		
		
		private static String respondRequestDocumentstore  (HttpServletRequest request, ServletContext ctx, Database registryDB) throws  IOException, InterruptedException {
		    
		    HttpSession session = request.getSession(true);
		    List<String> endpointComponents = parseURI(request);
			
			JsonObject inputs = new JsonObject();
			Enumeration<String> parameterNames = request.getParameterNames();
			while (parameterNames.hasMoreElements()) {
				String paramName = parameterNames.nextElement();
				inputs.addProperty(paramName,request.getParameter(paramName));
			}
			
			String response = "";
			List<String> keys = new ArrayList<String>();
			
			
		    if (endpointComponents.get(0).equals("_all_documentstores")){
		    	if (endpointComponents.size() == 1 ) {
		        response = buildResponseToAppScopeRequest (registryDB, session, inputs);
		    	}
		    	if (endpointComponents.size() == 2 ) {
		    		if (endpointComponents.get(1).equals("add")) {
		    			response = addNewDatabase(request, session, ctx, registryDB).toString();
		    		}
		    	}
		    } else {
		    	if (endpointComponents.get(0).equals("documentstore")){	
		    		if (endpointComponents.size() == 1 ) {
		               response = buildResponseToIdRequest (registryDB, session, inputs);
		    		}
		    		 if (endpointComponents.size() == 2 ) {
				    		if (endpointComponents.get(1).equals("modify")) {
				    		     response = modifyDocumentstore(registryDB, ctx, inputs).toString();    					
				    		}
		    	 		if (endpointComponents.get(1).equals("manage")) {
			    			response = manageDatabase(registryDB, ctx, inputs).toString();
			    		}
		    	 		if (endpointComponents.get(1).equals("unmanage")) {
			    			response = unmanageDatabase(registryDB, inputs).toString();
			    		}
			    	 }

				 }
		    }
		    return(response);
		} 
    /**
     * @see HttpServlet#HttpServlet()
     */
    public documentstoreServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    
		HttpSession session = request.getSession(true);
		PrintWriter out = response.getWriter();
		if (session.isNew()) {
			session.invalidate();
			String responseString = "{\"result\" : \"SessionInvalidated\"}";
			response.setContentType("application/json");  
			out.write(responseString);
	    }
		else {
		ServletContext ctx  = request.getServletContext();
		String dbname = ctx.getInitParameter("ClomClumRegistryDB");	
		CloudantClient client = CloudantSecurityCommon.getCloudantClientForRegistry(ctx);
		 if (client != null) {
			Database registryDB = client.database(dbname,true);
			if (!(registryDB.getDBUri().toASCIIString().isEmpty())) {
		            String responseString=null;
					try {
						responseString = respondRequestDocumentstore (request, ctx, registryDB);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				    response.setContentType("application/json");  
				    if (!responseString.isEmpty()) { out.write(responseString);} 
				    client.shutdown();
			   }
		 } else { System.out.println("No Registrydb database found");}	
		}
		out.close();
    }
	
}
    

