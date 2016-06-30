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
import com.google.gson.JsonObject;

/**
 * Servlet implementation class templatesServlet
 */
@WebServlet({"/template","/_all_templates","/_all_templates/add","/template/remove","/template/modify"})
public class templateServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
private static JsonObject removeTemplate(Database thisDB, JsonObject inputs)  throws IOException{
		
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
					response.addProperty("reason","Template id is empty");	
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
			System.out.println("Template Remove Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
private static JsonObject modifyTemplate(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("id")) {
				 item = thisDB.find(JsonObject.class,inputs.get("id").getAsString());
				    if (inputs.has("numcopies")) {
				  		 if (item.has("numcopies")) {item.remove("numcopies");}
			    		 item.addProperty("numcopies",inputs.get("numcopies").getAsString());}
			    	 if (inputs.has("quorum")) {
			    		 if (item.has("quorum")) {item.remove("quorum");}
			    		 item.addProperty("quorum",inputs.get("quorum").getAsString());} 
			    	 if (inputs.has("read")) {
			    		 if (item.has("read")) {item.remove("read");}
			    		 item.addProperty("read",inputs.get("read").getAsString());}
			    	 if (inputs.has("write")) {
			    		 if (item.has("write")) {item.remove("write");}
			    		 item.addProperty("write",inputs.get("write").getAsString());}
			    	 if (inputs.has("designlist")) {
			    		 if (item.has("designlist")) {item.remove("designlist");}
			    		 item.addProperty("designlist",inputs.get("designlist").getAsString());
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
					response.addProperty("reason","Template id is empty");	
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
			System.out.println("Template Modify Attempt for ["+inputs.get("id").getAsString()+"] result="+response);
			return(response);

	}	
	
	private static JsonObject addNewTemplate(Database thisDB, JsonObject inputs)  throws IOException{
		
		JsonObject response = new JsonObject();
		
		try {
			 JsonObject item = new JsonObject();	 
			 if (inputs.has("name")) {
				 String idstring = "template."+ inputs.get("name").getAsString().replaceAll("\\s","").toLowerCase();
				 item.addProperty("_id", idstring);
				 item.addProperty("name", inputs.get("name").getAsString());
				 if (inputs.has("numcopies")) {
		         item.addProperty("numcopies",inputs.get("numcopies").getAsString());}
				 if (inputs.has("quorum")) {
		    	 item.addProperty("quorum",inputs.get("quorum").getAsString());}
		    	  
		    	 if (inputs.has("read")) {
		    		 item.addProperty("read",inputs.get("read").getAsString());
		    		 }
		    	 
		    	 if (inputs.has("write")) {
		    		 item.addProperty("write",inputs.get("write").getAsString());}
		    	 
		     	 if (inputs.has("designlist")) {
		    		 item.addProperty("designlist",inputs.get("designlist").getAsString());}
		    	
		    	 item.addProperty("type", "template-settings");
		    	 
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
	
	private static String buildResponseToScopeAllRequest (Database registryDB, List<String> keys) throws IOException {
        
		List<JsonObject> Docs = CloudantJsonObjectUtils.viewResultDocsAsJSON(registryDB,"views/type",keys);
		return (Docs.toString());
	}
	
	   public static String buildResponseToIdRequest (Database registryDB,   JsonObject inputs ) throws  IOException {
    	   if (inputs.has("id")) {
		   JsonObject Item = registryDB.find(JsonObject.class,inputs.get("id").getAsString());	
	         return (Item.toString());
		     }
		     else {return "";}
	}	
	
	private static String respondRequestTemplate (HttpServletRequest request, ServletContext ctx, Database registryDB) throws IOException {
        List<String> endpointComponents = parseURI(request);
		
		JsonObject inputs = new JsonObject();
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			inputs.addProperty(paramName,request.getParameter(paramName));
		}
		
		String response = "";
		List<String> keys = new ArrayList<String>();
		
		
	    if (endpointComponents.get(0).equals("_all_templates")){
	    	if (endpointComponents.size() == 1 ) {
	            keys.add("template-settings");
	            response = buildResponseToScopeAllRequest (registryDB, keys);
	    	}
	    	if (endpointComponents.size() == 2 ) {
	    		if (endpointComponents.get(1).equals("add")) {	    		
   		           response = addNewTemplate(registryDB, inputs).toString();
	    		}
	    	}
	    } 
	    if (endpointComponents.get(0).equals("template")) {
	    	if (endpointComponents.size() == 1 ) {
		 	    if (inputs.has("id")) {
		 	    response = buildResponseToIdRequest(registryDB,inputs); }
	    		}
		    	if (endpointComponents.size() == 2 ) {
		    		if (endpointComponents.get(1).equals("modify")) {
		    		     response = modifyTemplate(registryDB, inputs).toString();  
		    		}
		    		if (endpointComponents.get(1).equals("remove")) {
		    		     response = removeTemplate(registryDB, inputs).toString();    					
		    		}
		    	}
	    }
	    return(response);
	}
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public templateServlet() {
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
		            String responseString = respondRequestTemplate (request, ctx, registryDB);
				    if (!responseString.isEmpty()) { out.write(responseString);} 
				    client.shutdown();
			   }
		 } else { System.out.println("No Registrydb database found");}	
		}
		// out.close();
	}


}
