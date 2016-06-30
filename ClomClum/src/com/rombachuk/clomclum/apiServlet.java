package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
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

import org.apache.commons.codec.binary.Base64;

import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.google.gson.JsonObject;
import com.unboundid.ldap.sdk.LDAPConnection;

/**
 * Servlet implementation class apiServlet
 */
@WebServlet({ "/api", "/api/_login", "/api/_all_documentstores", "/api/_all_documentstores/add", "/api/_access_validation" })
public class apiServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
	
	private static Boolean validateRequest(HttpServletRequest request) {
		
		String username = ""; String userpassword = "";
		String authorization = request.getHeader("Authorization");
	    if (authorization != null && authorization.startsWith("Basic")) {
	        // Authorization: Basic base64credentials
	        String base64Credentials = authorization.substring("Basic".length()).trim();
	        Base64 b = new Base64();
	        String credentials = new String(b.decode(base64Credentials), Charset.forName("UTF-8"));
	        // credentials = username:password
	        String[] values = credentials.split(":",2);
	        username = values[0]; userpassword = values[1];
	        }
	    ServletContext ctx  = request.getServletContext();

	  	LDAPConnection ldapConnection = LdapCommon.getLdapConnection(ctx);
    	if (ldapConnection != null) {
   		String userDN = LdapCommon.findUserDN(ldapConnection, ctx, username);
   		   if (!userDN.isEmpty()) {
    	      if (LdapCommon.authenticationAttempt(ldapConnection,userDN,userpassword)) {
    	    	  List<String> sessionRoles = LdapCommon.findRoles(ldapConnection,ctx,username);
    	    	  List<String> sessionAdminCaches = new ArrayList<String>();
      	    	  List<String> sessionMemberCaches = new ArrayList<String>();
    	    	  HttpSession session = request.getSession();
    	    	  session.setAttribute("sessionRoles", sessionRoles);
    	    	  session.setAttribute("sessionAdminCaches", sessionAdminCaches);
    	    	  session.setAttribute("sessionMemberCaches", sessionMemberCaches);
    	    	  session.setAttribute("sessionUsername",username);
    	    	  session.setAttribute("sessionUserpassword",userpassword);
    	  	      String superUserRole = ctx.getInitParameter("ClomClumSuperUserRole");
    	  	      Boolean superUserStatus = false;
    		      for (String role: sessionRoles) {
    		    	if (role.equals(superUserRole.toString())) { 
    		    		superUserStatus = true; 
    		    		session.setAttribute("sessionSuperUserStatus", true);
    		    	}
    		      }
    	    	  return(true);
    	      }
	       }
    	}
    	return(false); //default
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
	
	private static String respondAPI  (HttpServletRequest request, ServletContext ctx, Database registryDB) throws  IOException, InterruptedException {
	    
	    HttpSession session = request.getSession(true);
	    	    
	    List<String> endpointComponents = parseURI(request);
	    System.out.println("URI="+endpointComponents.toString());
		
		JsonObject inputs = new JsonObject();
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			inputs.addProperty(paramName,request.getParameter(paramName));
		}
		 System.out.println("Inputs="+inputs.toString());
		
		String response = "";
		List<String> keys = new ArrayList<String>();
		
	    if (endpointComponents.get(1).equals("_all_documentstores")){
	    	if (endpointComponents.size() == 2 ) {
	        response = documentstoreServlet.buildResponseToAppScopeRequest (registryDB, session, inputs);}
	    	if (endpointComponents.size() == 3 ) {
	    		try {
					if (endpointComponents.get(2).equals("add")) {
						response = documentstoreServlet.addNewDatabase(request, session, ctx, registryDB).toString();}
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}}
	    } 
	    if (endpointComponents.get(1).equals("documentstore")){	
			    if (inputs.has("id")) {
	            response = documentstoreServlet.buildResponseToIdRequest (registryDB, session, inputs);}
	    }
 		if (endpointComponents.get(1).equals("_access_validation")){
	    			response = "{\"result\" : \"Success\"}";}
	    return(response);
	}

    public apiServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

   
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		doPost(request, response);
		
	   
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		 if (validateRequest(request)) {
			    
				PrintWriter out = response.getWriter();
				ServletContext ctx  = request.getServletContext();
		    	String dbname = ctx.getInitParameter("ClomClumRegistryDB");
			
				CloudantClient client = CloudantSecurityCommon.getCloudantClientForRegistry(ctx);
				if (client != null) {
					Database registryDB = client.database(dbname,true);
					if (!(registryDB.getDBUri().toASCIIString().isEmpty())) {
						    String responseString=null;
							try {
								responseString = respondAPI (request, ctx, registryDB);
							} catch (InterruptedException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
						    response.setContentType("application/json");  
						    if (!responseString.isEmpty()) { 
						    	System.out.println("Response=["+responseString+"]");
						    	out.write(responseString); } 
						    } 		  
					}
					else {
						System.out.println("No Registrydb database found");
					}
					client.shutdown();
					out.close();
			    }
			    else {
			    	HttpSession session = request.getSession(true);
			    	PrintWriter out = response.getWriter();
			    	response.setContentType("application/json");  
			    	out.write("{\"result\" : \"Failed\", \"error\" : \"invalid credentials\"}");
			    	out.close();
			    	session.invalidate();
			    }
	}

}
