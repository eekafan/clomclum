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
 * Servlet implementation class designlistsServlet
 */
@WebServlet({"/designlist","/_all_designlists","/_all_designlists/add","/designlist/remove","/designlist/modify"})
public class designlistServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
private static JsonObject removedesignlist(Database thisDB, JsonObject inputs)  throws IOException{
		
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
					response.addProperty("reason","designlist id is empty");	
				}
				 
		}
		catch (com.cloudant.client.org.lightcouch.DocumentConflictException e) {
			System.out.println("Reached this error: "+e);
			response.addProperty("result","Failure");
			response.addProperty("reason","Duplicate identifier");
		}
		catch (com.cloudant.client.org.lightcouch.CouchDbException e) {
			System.out.println("Reached this error: "+e );
			response.addProperty("result","Failure");
			response.addProperty("reason","Illegal identifier");
		}

			if (!(response.has("result")))  {
				response.addProperty("result","Failure");
				response.addProperty("reason","Indeterminate");
			}
			System.out.println("designlist Remove Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
private static JsonObject modifydesignlist(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("id")) {
				 item = thisDB.find(JsonObject.class,inputs.get("id").getAsString());
				 if (inputs.has("list")) {
		    		 if (item.has("list")) {item.remove("list");}		
		    		 String designdocslist[] = inputs.get("list").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
		    		 JsonArray designdocslistArray = new JsonArray();
		    		 for (int j = 0; j< designdocslist.length; j++) {
	    			 if (!designdocslist[j].isEmpty()) {
	    			 JsonPrimitive element = new JsonPrimitive(designdocslist[j]); designdocslistArray.add(element);}
	    			 }
		         item.add("list",designdocslistArray);
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
					response.addProperty("reason","designlist id is empty");	
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
			System.out.println("designlist Modify Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
	private static JsonObject addNewdesignlist(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("name")) {
				 String idstring = "designlist."+ inputs.get("name").getAsString().replaceAll("\\s","").toLowerCase();
				 item.addProperty("_id", idstring);
				 item.addProperty("name", inputs.get("name").getAsString());
				 if (inputs.has("list")) {
		    		 String designdocslist[] = inputs.get("list").getAsString().replaceAll("\"","").replaceAll("\\[","").replaceAll("\\]","").split(",");
		    		 JsonArray designdocslistArray = new JsonArray();
		    		 for (int j = 0; j< designdocslist.length; j++) {
	    			 if (!designdocslist[j].isEmpty()) {
	    			 JsonPrimitive element = new JsonPrimitive(designdocslist[j]); designdocslistArray.add(element);}
	    			 }
		         item.add("list",designdocslistArray);
				 }
		    	
		    	 item.addProperty("type", "designlist-settings");
		    	 
  	             Response Result = thisDB.save(item);
 		        if (Result.getError() == null) {
 		                   response.addProperty("result","Success");}
					else {
						response.addProperty("result","Failure");
						response.addProperty("reason","Problems Adding this Entry");	
					}
			 } else {
					response.addProperty("result","Failure");
					response.addProperty("reason","Name must be supplied");	
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
	
	private static String buildResponseToScopeAllRequest (Database registryDB, List<String> keys) throws IOException {
        
		List<JsonObject> Docs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/type",keys);
		return (Docs.toString());
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
	
	private static String respondRequestdesignlist (HttpServletRequest request, ServletContext ctx, Database registryDB) throws IOException {
        List<String> endpointComponents = parseURI(request);
		
		JsonObject inputs = new JsonObject();
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			inputs.addProperty(paramName,request.getParameter(paramName));
		}
		
		String response = "";
		List<String> keys = new ArrayList<String>();
		
		
	    if (endpointComponents.get(0).equals("_all_designlists")){
	    	if (endpointComponents.size() == 1 ) {
	            keys.add("designlist-settings");
	            response = buildResponseToScopeAllRequest (registryDB, keys);
	    	}
	    	if (endpointComponents.size() == 2 ) {
	    		if (endpointComponents.get(1).equals("add")) {	    		
   		           response = addNewdesignlist(registryDB, inputs).toString();
	    		}
	    	}
	    } 
	    if (endpointComponents.get(0).equals("designlist")) {
	    	if (endpointComponents.size() == 1 ) {
		 	    if (inputs.has("id")) {
		 	    response = buildResponseToIdRequest(registryDB,inputs); }
	    		}
		    	if (endpointComponents.size() == 2 ) {
		    		if (endpointComponents.get(1).equals("modify")) {
		    		     response = modifydesignlist(registryDB, inputs).toString();  
		    		}
		    		if (endpointComponents.get(1).equals("remove")) {
		    		     response = removedesignlist(registryDB, inputs).toString();    					
		    		}
		    	}
	    }
	    return(response);
	}
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public designlistServlet() {
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
	    response.setContentType("application/json");  
	    response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		if (session.isNew()) {
			session.invalidate();
			String responseString = "{\"result\" : \"SessionInvalidated\"}";
			response.setContentType("application/json");  
			out.write(responseString);
	    }
		else {
		ServletContext ctx  = request.getServletContext();
		request.setCharacterEncoding("UTF-8");
		String dbname = ctx.getInitParameter("ClomClumRegistryDB");	
		CloudantClient client = CloudantSecurityCommon.getCloudantClientForRegistry(ctx);
		 if (client != null) {
			Database registryDB = client.database(dbname,true);
			if (!(registryDB.getDBUri().toASCIIString().isEmpty())) {
		            String responseString = respondRequestdesignlist (request, ctx, registryDB);
				    if (!responseString.isEmpty()) { out.write(responseString);} 
				    client.shutdown();
			   }
		 } else { System.out.println("No Registrydb database found");}	
		}
		// out.close();
	}


}
