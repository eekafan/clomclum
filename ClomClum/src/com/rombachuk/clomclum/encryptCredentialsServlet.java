package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

/**
 * Servlet implementation class encryptCredentials
 */
@WebServlet("/encryptCredentials")
public class encryptCredentialsServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public encryptCredentialsServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    String credentials=request.getParameter("credentials");
	    ServletContext ctx  = request.getServletContext();
	    
		String key 	 =ctx.getInitParameter("ClomClumCredentialsKey");
	    String iv    =ctx.getInitParameter("ClomClumCredentialsIV");
	    
	    PrintWriter out = response.getWriter();
	    
	    String encrypted_string = CloudantSecurityCommon.encryptCredentials(credentials, key, iv);
	    
	    response.setContentType("application/txt");
//	    System.out.println("Encrypted String ="+encrypted_string);
	    JsonElement element = new JsonPrimitive(encrypted_string);
	    JsonObject item = new JsonObject();
	    item.add("encrypted", element);
	    
	    out.write(item.toString());
	    
	}

}
