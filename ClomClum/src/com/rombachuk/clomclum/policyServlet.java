package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.PrintWriter;
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
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

/**
 * Servlet implementation class policyServlet
 */
@WebServlet({ "/policy", "/_all_policies","/_all_policies/add","/policy/modify","/policy/remove" })
public class policyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
private static JsonObject removePolicy(Database thisDB, JsonObject inputs)  throws IOException{
		
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
					response.addProperty("reason","Policy id is empty");	
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
			System.out.println("Policy Remove Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
private static JsonObject modifyPolicy(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("id")) {
				 item = thisDB.find(JsonObject.class,inputs.get("id").getAsString());
				    if (inputs.has("templatename")) {
				  		 if (item.has("templatename")) {item.remove("templatename");}
				  		  item.addProperty("templatename",inputs.get("templatename").getAsString());
				          List<String> keys = new ArrayList<String>(); keys.add(inputs.get("templatename").getAsString());
					      List<JsonObject> templates = CloudantJsonObjectUtils.viewResultDocsAsJSON(thisDB,"views/name",keys);
					      if (templates.size()>0) {
					    	  if (item.has("template")) {item.remove("template");}
					    	  item.addProperty("template",templates.get(0).get("_id").getAsString());} //find first template with the name
		             }
			    	 if (inputs.has("syncmaster")) {
			    		 if (item.has("syncmaster")) {item.remove("syncmaster");}
			    		 item.addProperty("syncmaster",inputs.get("syncmaster").getAsString());} 
			    	 if (inputs.has("cluster")) {
			    		 if (item.has("cluster")) {item.remove("cluster");}
			    		 item.addProperty("cluster",inputs.get("cluster").getAsString());}
			    	 
			    	 if (inputs.has("requestingroles")) {
			    		 if (item.has("requestingroles")) {item.remove("requestingroles");}		
			    		 String roles[] = inputs.get("requestingroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
			    		 JsonArray rolesArray = new JsonArray();
			    		 for (int j = 0; j< roles.length; j++) {
		    			 if (!roles[j].isEmpty()) {
		    			 JsonPrimitive element = new JsonPrimitive(roles[j]); rolesArray.add(element);}
		    			 }
			    		 item.add("requestingroles", rolesArray);
			    	 }
			    	 if (inputs.has("adminroles")) {
			    		 if (item.has("adminroles")) {item.remove("adminroles");}
			    		 String roles[] = inputs.get("adminroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
			    		 JsonArray rolesArray = new JsonArray();
			    		 for (int j = 0; j< roles.length; j++) {
		    			 if (!roles[j].isEmpty()) {
		    			 JsonPrimitive element = new JsonPrimitive(roles[j]); rolesArray.add(element);}
		    			 }
			    		 item.add("adminroles", rolesArray);
		    		 }
			    	 if (inputs.has("memberroles")) {
			    		 if (item.has("memberroles")) {item.remove("memberroles");}
			    		 String roles[] = inputs.get("memberroles").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
			    		 JsonArray rolesArray = new JsonArray();   		 
			    		 for (int j = 0; j< roles.length; j++) {
			    			 if (!roles[j].isEmpty()) {
			    			 JsonPrimitive element = new JsonPrimitive(roles[j]); rolesArray.add(element);}
			    			 }
			    		 item.add("memberroles", rolesArray);
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
					response.addProperty("reason","Policy id is empty");	
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
			System.out.println("Policy Modify Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
	private static JsonObject addNewPolicy(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("name") && inputs.has("application") && inputs.has("appscope")) {
				 String idstring = "policy."+ inputs.get("application").getAsString().replaceAll("\\s","").toLowerCase() + "."
				                   + inputs.get("appscope").getAsString().replaceAll("\\s","").toLowerCase() + "." +
				                   inputs.get("name").getAsString().replaceAll("\\s","").toLowerCase();
				 item.addProperty("_id", idstring);
				 item.addProperty("name", inputs.get("name").getAsString());
		         item.addProperty("application",inputs.get("application").getAsString());
		    	 item.addProperty("appscope",inputs.get("appscope").getAsString());
		    	  
		    	 if (inputs.has("templatename")) {
		    		 item.addProperty("templatename",inputs.get("templatename").getAsString());
		    		 String templateid = "template."+ inputs.get("templatename").getAsString().replaceAll("\\s","").toLowerCase();
		    		 item.addProperty("template",templateid);	
		    	 }
		    	 
		    	 if (inputs.has("syncmaster")) {
		    		 item.addProperty("syncmaster",inputs.get("syncmaster").getAsString());}
		    	 
		     	 if (inputs.has("cluster")) {
		    		 item.addProperty("cluster",inputs.get("cluster").getAsString());}
		    	
		    	 item.addProperty("type", "policy-settings");
		    	 
  	             Response Result = thisDB.save(item);
 		        if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Adding this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Name, Application & AppScope are required");	
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
	
	private static String buildResponseToScopeAllRequest (Database registryDB, List<String> keys) throws  IOException {  
		List<JsonObject> PolicyDocs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/type",keys);
		return (PolicyDocs.toString());
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
	
	
	private static String respondRequestPolicy (HttpServletRequest request, ServletContext ctx, Database registryDB) throws  IOException {
		
		List<String> endpointComponents = parseURI(request);
		
		JsonObject inputs = new JsonObject();
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			inputs.addProperty(paramName,request.getParameter(paramName));
		}
		
		String response = "";
		List<String> keys = new ArrayList<String>();
		
		
	    if (endpointComponents.get(0).equals("_all_policies")){
	    	if (endpointComponents.size() == 1 ) {
	            keys.add("policy-settings");
	            response = buildResponseToScopeAllRequest (registryDB, keys);
	    	}
	    	if (endpointComponents.size() == 2 ) {
	    		if (endpointComponents.get(1).equals("add")) {	    		
   		           response = addNewPolicy(registryDB, inputs).toString();
	    		}
	    	}
	    } 
	    if (endpointComponents.get(0).equals("policy")) {
	    	if (endpointComponents.size() == 1 ) {
		 	    if (inputs.has("id")) {
		 	    response = buildResponseToIdRequest(registryDB,inputs); }
	    		}
		    	if (endpointComponents.size() == 2 ) {
		    		if (endpointComponents.get(1).equals("modify")) {
		    		     response = modifyPolicy(registryDB, inputs).toString();    					
		    		}
		    		if (endpointComponents.get(1).equals("remove")) {
		    		     response = removePolicy(registryDB, inputs).toString();    					
		    		}
		    	}
	    }
	    return(response);
	}
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public policyServlet() {
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
		            String responseString = respondRequestPolicy (request, ctx, registryDB);
				    response.setContentType("application/json");  
				    if (!responseString.isEmpty()) { out.write(responseString);} 
				    client.shutdown();
			   }
		 } else { System.out.println("No Registrydb database found");}	
		}
		out.close();
	}

}
