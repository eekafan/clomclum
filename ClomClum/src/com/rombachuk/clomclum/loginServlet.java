package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.ShortBufferException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.unboundid.ldap.sdk.LDAPConnection;

/**
 * Servlet implementation class Login
 */
@WebServlet("/login")
public class loginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	

	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public loginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	}
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		    
		    response.setContentType("text/html");  
		    PrintWriter out = response.getWriter();  
		          
		    String username=request.getParameter("username");  
		    String userpassword=request.getParameter("userpass"); 
	    
		    ServletContext ctx  = request.getServletContext();
	        String destination = "login.html";

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
            		      
            		      if (superUserStatus == true) { destination = "pdashboard.html#"; }
            			     else { destination = "dashboard.html#"; } 
            		   } 
            	       else {
            		   destination = "relogin.html";
            		   }
		    	 ldapConnection.close();
            	} else {destination = "relogin.html";}
           		if (destination == "relogin.html") { 
           			HttpSession session = request.getSession();
           			session.invalidate();
           		}
           		response.sendRedirect(destination);
		    	out.close();  
            	}
	    }

}