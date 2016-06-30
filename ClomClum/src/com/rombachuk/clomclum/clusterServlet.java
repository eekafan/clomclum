package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.api.model.Response;
import com.cloudant.client.api.views.Key;
import com.cloudant.client.api.views.ViewRequest;
import com.cloudant.client.api.views.ViewRequestBuilder;
import com.cloudant.client.api.views.ViewResponse;
import com.cloudant.http.Http;
import com.cloudant.http.HttpConnection;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.unboundid.ldap.sdk.LDAPConnection;

/**
 * Servlet implementation class clustersServlet
 */
@WebServlet({"/cluster","/_all_clusters","/_all_clusters/add","/cluster/documentstores","/cluster/syncsecurity","/cluster/syncdesign","/cluster/modify","/cluster/remove"})
public class clusterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
private static JsonObject removeCluster(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		
		try {
			 JsonObject item = new JsonObject();	  
			 
			 if (inputs.has("id")) {	
				 item = thisDB.find(JsonObject.class,inputs.get("id").getAsString());
				 Response Result = thisDB.remove(item);
 		        if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Modifying this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Animal id is empty");	
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
			System.out.println("Cluster Remove Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
private static JsonObject modifyCluster(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("id")) {
				 item = thisDB.find(JsonObject.class,inputs.get("id").getAsString());
				    if (inputs.has("url")) {
				  		 if (item.has("url")) {item.remove("url");}
			    		 item.addProperty("url",inputs.get("url").getAsString());}
			    	 if (inputs.has("clustertype")) {
			    		 if (item.has("clustertype")) {item.remove("clustertype");}
			    		 item.addProperty("clustertype",inputs.get("clustertype").getAsString());} 
			    	 if (inputs.has("securitytype")) {
			    		 if (item.has("securitytype")) {item.remove("securitytype");}
			    		 item.addProperty("securitytype",inputs.get("securitytype").getAsString());}
			    	 if (inputs.has("version")) {
			    		 if (item.has("version")) {item.remove("version");}
			    		 item.addProperty("version",inputs.get("version").getAsString());} 
			    	 
  	            Response Result = thisDB.update(item);
 		        if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Modifying this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Animal id is empty");	
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
			System.out.println("Cluster Modify Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
	private static JsonObject addNewCluster(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("id")) {
				 item.addProperty("_id", inputs.get("id").getAsString());
			  	 if (inputs.has("url")) {
		    		 item.addProperty("url",inputs.get("url").getAsString());}
		    	 
		    	 if (inputs.has("clustertype")) {
		    		 item.addProperty("clustertype",inputs.get("clustertype").getAsString());}
		    	  
		    	 if (inputs.has("securitytype")) {
		    		 item.addProperty("securitytype",inputs.get("securitytype").getAsString());}
		    	 
		    	 if (inputs.has("version")) {
		    		 item.addProperty("version",inputs.get("version").getAsString());}
		    	
		    	 item.addProperty("type", "cluster-settings");
		    	 item.addProperty("serviceaccount_ctx_parameter",inputs.get("id").getAsString()+"_serviceaccount");
		    	 item.addProperty("servicecredentials_ctx_parameter",inputs.get("id").getAsString()+"_servicecredentials");
		    	 
  	             Response Result = thisDB.save(item);
 		        if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Adding this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Cluster id is empty");	
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
		return(response);
	}
	
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
	
	public static JsonObject syncClusterUsers (Database registryDB, ServletContext ctx, String clusterId, String mode) throws IOException {
		JsonObject result = new JsonObject();
		List<String> users = new ArrayList<String>();
		int errorcount = 0;
		
			List<String> keys = new ArrayList<String>();
			keys.add(clusterId); 
			
			// find all the roles in documentstores managed through the registry for this cluster
			// and then find all the users belonging to groups with those roles present
			//
    		ViewRequestBuilder viewRequestBuilder = registryDB.getViewRequestBuilder("views", "clusteruserroles");
    		ViewRequest<String,String> rolesRequest =  viewRequestBuilder.newRequest(Key.Type.STRING, String.class)
    		                                        .keys(keys.get(0))
    		                                        .includeDocs(false)
    		                                        .build();
    		ViewResponse<String,String> rolesResponse   = rolesRequest.getResponse();     	
     		List<String> rolesResult = rolesResponse.getValues();
     		LDAPConnection ldapConnection = LdapCommon.getLdapConnection(ctx);
     		if (ldapConnection != null) {
     		 for (String role : rolesResult) {
     			List<String> roleMembers = LdapCommon.findRoleMembers(ldapConnection, ctx, role);
                 if (roleMembers != null){
     			   for (String rolemember : roleMembers) {
                	 if (!(users.contains(rolemember))) {users.add(rolemember);}
                   }
                 } else {errorcount++;}
             }
     		 
     		// find all the users named in securityobjects in managed documentstores for this cluster
        	viewRequestBuilder = registryDB.getViewRequestBuilder("views", "clusterusernames");
        	ViewRequest<String,String> namesRequest =  viewRequestBuilder.newRequest(Key.Type.STRING, String.class)
        		                                        .keys(keys.get(0))
        		                                        .includeDocs(false)
        		                                        .build();
        	ViewResponse<String,String> namesResponse   = namesRequest.getResponse(); 
        	List<String> namesResult = namesResponse.getValues();
        	 for (String name : namesResult) {
        		 if (!(users.contains(name))) {users.add(name);}
        	 }
     		 
        	// for each of the distinct list of users from the above searches
        	// update the _users database entry for this cluster
        	//
 			CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,clusterId);	
 			
     		if (clusterClient.getAllDbs().contains("_users")) {
     	    Database usersDB = clusterClient.database("_users", false);
        	for (String user : users) {
        		String userPassword = LdapCommon.findUserCredentials(ldapConnection, ctx, user);
 
        		JsonObject userEntry = new JsonObject();
        		List<String> userRolesAsString = LdapCommon.findRoles(ldapConnection, ctx, user);
        		JsonArray userRoles = new JsonArray();
        		   for (int i=0; i<userRolesAsString.size();i++){
        			userRoles.add(new JsonPrimitive(userRolesAsString.get(i)));
        		   }
         			
         			if ((usersDB.contains("org.couchdb.user:"+user)) && (mode.equals("update") || mode.equals("all"))){ // Update
         		    userEntry = usersDB.find(JsonObject.class,"org.couchdb.user:"+user);
                 	System.out.println("Syncing Cluster [" + clusterId + "] Updating User Entry [" +user + "] on _users database with password " );
     	      		userEntry.remove("password"); userEntry.remove("password_scheme"); userEntry.remove("salt"); 
     	      		userEntry.remove("derived_key"); userEntry.remove("roles");
            		userEntry.addProperty("password",userPassword);
              		userEntry.add("roles",userRoles);
             		    try {
             		      Response updateResponse = usersDB.update(userEntry);
             		    } catch (com.cloudant.client.org.lightcouch.DocumentConflictException e)  {
             			System.out.println("Conflict for user "+user);
             		    	errorcount++;
             		    } 
         			} else { // new Entry
         				if ((!usersDB.contains("org.couchdb.user:"+user)) && (mode.equals("new") || mode.equals("all"))){
                		System.out.println("Syncing Cluster [" + clusterId + "] Adding User Entry [" +user + "] to _users database with password " );
         				userEntry.addProperty("_id","org.couchdb.user:"+user);
         	      		userEntry.addProperty("name",user);
                		userEntry.addProperty("password",userPassword);
                  		userEntry.add("roles",userRoles);
               		    userEntry.addProperty("type", "user");
	              		 try {
	              			Response saveResponse = usersDB.save(userEntry);
	              		 } catch (com.cloudant.client.org.lightcouch.NoDocumentException e)  {
	              			errorcount++;
         			     }
         				}
         			}
         			
        	  }
     		}
        	 
        	ldapConnection.close();
        	clusterClient.shutdown();
        	 if (errorcount == 0) { result.addProperty("result", "Success"); }
        	 else { 
        		result.addProperty("result", "Failure");
        		result.addProperty("reason", "Problems synchronising users");
        	 }
     		} 
     		else { 
        		result.addProperty("result", "Failure");
        		result.addProperty("reason", "Ldap access issues");
        	}

        	return(result);
   }
	
	private static JsonObject syncClusterDocumentstores (Database registryDB, ServletContext ctx, String clusterId) throws IOException {
		JsonObject result = new JsonObject();
		int errorcount = 0;
        try {
		JsonObject clusterDetails = registryDB.find(JsonObject.class,clusterId);
		CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,clusterId);
		
		List<String> managedkeys = new ArrayList<String>();
		managedkeys.add(clusterId); managedkeys.add("managed");
		List<JsonObject> ManagedDbs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/managedstatus",managedkeys);
        for (JsonObject db : ManagedDbs) {
        	if (db.has("syncmaster")) {
        		System.out.println("Syncing Cluster ["+clusterId+"] Db ["+db.get("dbid").getAsString() +
        				"] RegistryRecord ["+db.get("_id").getAsString()+"]");
        		if (db.get("syncmaster").getAsString().equals("registry")) {
     		      Boolean putResult = CloudantSecurityCommon.putCouchdbSecurityDocument (clusterClient, clusterDetails, 
     		    		  db.get("dbid").getAsString(), (JsonObject) db.get("securityobject"));
                  if (putResult == false) {errorcount++;}
        		}
           		if (db.get("syncmaster").getAsString().equals("database")) {
           			Database newDB = clusterClient.database(db.get("dbid").getAsString(), false);
           			try {
    				JsonObject documentStoreSecurityObject = newDB.find(JsonObject.class,"_security");
    				db.remove("securityobject");
    				db.add("securityobject", documentStoreSecurityObject);
    				Response responseupdate = registryDB.update(db);
    				if (!responseupdate.getError().isEmpty()) {errorcount++;}
    				}
           			catch (com.cloudant.client.org.lightcouch.CouchDbException e) {
           				System.out.println(e);
           				errorcount++;
           			}
          		}
        	}
        }
        }
        finally {
        	
        }		    			
    	
         if (errorcount == 0) {
        	 result.addProperty("result","Success"); 
         } else {
    	 result.addProperty("result","Failure");
       	 result.addProperty("reason","Sync error detected for "+errorcount+" Documentstores");
         }
       	 return(result);
	}
	
     
	
	private static String buildResponseToScopeAllRequest (Database registryDB, List<String> keys) throws  IOException {
	          
		List<JsonObject> ClusterDocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/type",keys);
		return (ClusterDocs.toString());
	}
	
    public static String buildResponseToIdRequest (Database registryDB,   JsonObject inputs ) throws  IOException {
    	   if (inputs.has("id")) {
		   JsonObject Item = registryDB.find(JsonObject.class,inputs.get("id").getAsString());	
		   if (Item != null) {	
	         return (Item.toString());
		     }
		     else {return "";}
    	   } else {return "";}
	}	
	
	private static String buildResponseToIdmanagedRequest (Database registryDB, List<String> keys) throws  IOException {
	      
		List<JsonObject> ClusterDocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/managedstatus",keys);
		return (ClusterDocs.toString());
	}
	
	private static String buildResponseToIdunmanagedRequest (Database registryDB, ServletContext ctx, String clusterid) throws  IOException {
		
		try {
		CloudantClient clusterClient = CloudantSecurityCommon.getCloudantClientForCluster (registryDB,ctx,clusterid);
 
		if (clusterClient != null) {
			List<String> AllDbs = clusterClient.getAllDbs();
			List<String> managedkeys = new ArrayList<String>();
			managedkeys.add(clusterid); managedkeys.add("managed");
			List<JsonObject> ManagedDbs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/managedstatus",managedkeys);
		
			for (int i=0; i<ManagedDbs.size(); i++) {
			 int index=0; Boolean dbFound=false;
			 while (index < AllDbs.size() && !dbFound ) {
				if (ManagedDbs.get(i).get("dbid").getAsString().equals(AllDbs.get(index))) { dbFound = true; }
				index++;	
				}
			 if (dbFound ) { AllDbs.remove(index-1);} 
			 }
			
			List<JsonObject> UnManagedDbs = new ArrayList<JsonObject>();
			for (int i=0; i<AllDbs.size(); i++) {
				JsonObject thisDB = new JsonObject(); thisDB.addProperty("dbid", AllDbs.get(i));
				thisDB.addProperty("cluster", clusterid);
				UnManagedDbs.add(i, thisDB);
			}
			
			String response = UnManagedDbs.toString();
			clusterClient.shutdown();
			return(response);
			}
		else { return ""; }
	
		}
		catch (com.cloudant.client.org.lightcouch.CouchDbException   e) {
			// TODO Auto-generated catch block
			 e.printStackTrace();
			return("");
			
		} 
	}
	

	
	private static String respondRequestCluster (HttpServletRequest request, ServletContext ctx, Database registryDB) throws  IOException {
		
		List<String> endpointComponents = parseURI(request);
		
		
		JsonObject inputs = new JsonObject();
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			inputs.addProperty(paramName,request.getParameter(paramName));
		}
		
		String response = "";
		List<String> keys = new ArrayList<String>();
		
	    if (endpointComponents.get(0).equals("_all_clusters")){
	    	if (endpointComponents.size() == 1 ) {
	            keys.add("cluster-settings");
	            response = buildResponseToScopeAllRequest (registryDB, keys);
	    	}
	    	if (endpointComponents.size() == 2 ) {
	    		if (endpointComponents.get(1).equals("add")) {
	    		 response = addNewCluster(registryDB, inputs).toString();
	    		}
	    	}
	    } 
	    if (endpointComponents.get(0).equals("cluster")) {
	    	if (endpointComponents.size() == 1 ) {
		 	    response = buildResponseToIdRequest(registryDB,inputs);
	    		}
		    	if (endpointComponents.size() == 2 ) {
		    		if (endpointComponents.get(1).equals("documentstores")) {
			    		if (inputs.has("id") && inputs.has("managedstatus")) {
			    		       if (inputs.get("managedstatus").getAsString().equals("managed")) {		    
			    		         keys.add(inputs.get("id").getAsString()); keys.add(inputs.get("managedstatus").getAsString());
			    		         response = buildResponseToIdmanagedRequest (registryDB, keys);
			    		       }
			    		       if (inputs.get("managedstatus").getAsString().equals("unmanaged")) {			      
			    		    	   response = buildResponseToIdunmanagedRequest (registryDB, ctx, inputs.get("id").getAsString());
			    		       }
			    		     }
		    		}
		    		if (endpointComponents.get(1).equals("syncsecurity")) {
		    			JsonObject syncDocsResult = syncClusterDocumentstores(registryDB, ctx, inputs.get("id").getAsString());
		    			if (syncDocsResult.has("result")) {
		    				if (syncDocsResult.get("result").getAsString().equals("Success")) {
		    					JsonObject syncUsersResult = syncClusterUsers(registryDB,ctx, inputs.get("id").getAsString(), "all");
		    					response = syncUsersResult.toString();
		    				} else {
		    					response = syncDocsResult.toString();
		    				}	    					
		    			}
		    		}
		    		if (endpointComponents.get(1).equals("modify")) {
		    		     response = modifyCluster(registryDB, inputs).toString();    					
		    		}
		    		if (endpointComponents.get(1).equals("remove")) {
		    		     response = removeCluster(registryDB, inputs).toString();    					
		    		}
		    	}
	    }
	    return(response);
	}
    /**
     * @see HttpServlet#HttpServlet()
     */
    public clusterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
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
		            String responseString = respondRequestCluster (request, ctx, registryDB);
				    response.setContentType("application/json");  
				    if (!responseString.isEmpty()) { out.write(responseString);} 
				    client.shutdown();
			   }
		 } else { System.out.println("No Registrydb database found");}	
		}
		out.close();
	}

}
