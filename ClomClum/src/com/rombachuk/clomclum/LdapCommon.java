package com.rombachuk.clomclum;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletContext;


import com.unboundid.ldap.sdk.BindRequest;
import com.unboundid.ldap.sdk.BindResult;
import com.unboundid.ldap.sdk.LDAPConnection;
import com.unboundid.ldap.sdk.LDAPException;
import com.unboundid.ldap.sdk.LDAPSearchException;
import com.unboundid.ldap.sdk.ResultCode;
import com.unboundid.ldap.sdk.SearchResult;
import com.unboundid.ldap.sdk.SearchResultEntry;
import com.unboundid.ldap.sdk.SearchScope;
import com.unboundid.ldap.sdk.SimpleBindRequest;

public class LdapCommon {
	
	public static LDAPConnection getLdapConnection (ServletContext ctx) {

    String bindDN		=ctx.getInitParameter("LDAPbindDN");
    String bindPassword =ctx.getInitParameter("LDAPbindPassword");
    String hostname		=ctx.getInitParameter("LDAPhostname");
    int    hostport		=Integer.parseInt(ctx.getInitParameter("LDAPhostport"));

    
    try {
    	
   	LDAPConnection ldapConnection = new LDAPConnection(hostname,hostport,bindDN,bindPassword);
   	return ldapConnection;
   	
    } catch(LDAPException e) {
    	System.out.println("getLdapConnection failure");
    	return null;
    }
    	
    }
	
	public static List<SearchResultEntry> searchLDAPResults(LDAPConnection connection, String baseDN, String filter) throws LDAPSearchException {
	    SearchResult searchResult;

	    if (connection.isConnected()) {
	        searchResult = connection.search(baseDN, SearchScope.SUB, filter);

	        return searchResult.getSearchEntries();
	    }
	    else { return null; }
	}
	
	public static List<String> findRoles (LDAPConnection client, ServletContext ctx, String username) {
	    
		String groupbaseDN          = ctx.getInitParameter("LDAPgroupBaseDN");
	    String groupUniqueAttribute = ctx.getInitParameter("LDAPgroupUniqueAttribute");
	    String groupRoleAttribute = ctx.getInitParameter("LDAPgroupRoleIdentifyingAttribute");
		String groupClassFilter     = ctx.getInitParameter("LDAPgroupClassFilter");
		String groupMemberAttribute = ctx.getInitParameter("LDAPgroupMemberattribute");
		
		try {
          	String groupFilter = "(&"+groupClassFilter+"("+groupMemberAttribute+"="+username+"))";
        	List<SearchResultEntry> results = searchLDAPResults(client, groupbaseDN, groupFilter);
        	
        	if (!results.isEmpty()) {
        		Set<String> roles = new HashSet<String>();

        		for(SearchResultEntry entry : results) {
        		  roles.add(entry.getAttributeValue(groupRoleAttribute));
        		}

        		List<String> userRoles = new ArrayList<String>(roles);
        		return userRoles;
        	} else { 
        		System.out.println("Roles not found for :" + username);
        		return null; }
		} catch(LDAPException e) {
	    	System.out.println("findRoles failure:" + e);
	    	return null;
	    }
	}
	
	public static String findUserDN (LDAPConnection connection, ServletContext ctx, String username) {
	    
		String userbaseDN         =ctx.getInitParameter("LDAPuserBaseDN");
	    String userUniqueAttribute=ctx.getInitParameter("LDAPuserUniqueAttribute");
		String userClassFilter    =ctx.getInitParameter("LDAPuserClassFilter");
		
		try {
          	String userFilter = "(&"+userClassFilter+"("+userUniqueAttribute+"="+username+"))";
        	List<SearchResultEntry> results = LdapCommon.searchLDAPResults(connection, userbaseDN, userFilter);
        	
        	if (!results.isEmpty()) {
        		String userDN = results.get(0).getDN();
           		return userDN;
        	} else { 
        		System.out.println("UserDN not found for :" + username);
        		return ""; }
        	
		} catch(LDAPException e) {
	    	System.out.println("findUserDN failure");
	    	return "";
	    }
	}
	
	public static String findUserCredentials (LDAPConnection connection, ServletContext ctx, String username) {
	    
		String userbaseDN         =ctx.getInitParameter("LDAPuserBaseDN");
	    String userUniqueAttribute=ctx.getInitParameter("LDAPuserUniqueAttribute");
		String userClassFilter    =ctx.getInitParameter("LDAPuserClassFilter");
		String userCredentials    = "userPassword";
		
		try {
          	String userFilter = "(&"+userClassFilter+"("+userUniqueAttribute+"="+username+"))";
        	List<SearchResultEntry> results = LdapCommon.searchLDAPResults(connection, userbaseDN, userFilter);
        	
        	if (!results.isEmpty()) {
        		String thisPassword = results.get(0).getAttributeValue(userCredentials);
           		return thisPassword;
        	} else { 
        		System.out.println("User Credentials not found for :" + username);
        		return ""; }
        	
		} catch(LDAPException e) {
	    	System.out.println("findUserPassword failure");
	    	return "";
	    }
	}
	
	public static List<String> findRoleMembers (LDAPConnection connection, ServletContext ctx, String teamrole) {
	    
		String groupbaseDN          = ctx.getInitParameter("LDAPgroupBaseDN");
	    String groupRoleAttribute = ctx.getInitParameter("LDAPgroupRoleIdentifyingAttribute");
		String groupClassFilter     = ctx.getInitParameter("LDAPgroupClassFilter");
		String groupMemberAttribute = ctx.getInitParameter("LDAPgroupMemberattribute");
		
		try {
          	String userFilter = "(&"+groupClassFilter+"("+groupRoleAttribute+"="+teamrole+"))";
        	List<SearchResultEntry> results = LdapCommon.searchLDAPResults(connection, groupbaseDN, userFilter);
        	
        	if (!results.isEmpty()) {
        		Set<String> members = new HashSet<String>();

        		for(SearchResultEntry entry : results) {
        		String[] memberUsers = entry.getAttributeValues(groupMemberAttribute);
        		 for (int i=0; i<memberUsers.length; i++)  {
              		  members.add(memberUsers[i]);
        		 }
        		}

        		List<String>roleMembers = new ArrayList<String>(members);
        		return roleMembers;
        	} else { 
        		System.out.println("Members not found for :" + teamrole);
        		return null; }
        	
		} catch(LDAPException e) {
	    	System.out.println("findUserDN failure");
	    	return null;
	    }
	}
	
	public static String findUserTeam (LDAPConnection connection, ServletContext ctx, String username) {
	    
		String userbaseDN         =ctx.getInitParameter("LDAPuserBaseDN");
	    String userUniqueAttribute=ctx.getInitParameter("LDAPuserUniqueAttribute");
		String userClassFilter    =ctx.getInitParameter("LDAPuserClassFilter");
		String teamUniqueAttribute=ctx.getInitParameter("LDAPteamIdentifyingAttribute");
		
		try {
          	String userFilter = "(&"+userClassFilter+"("+userUniqueAttribute+"="+username+"))";
        	List<SearchResultEntry> results = LdapCommon.searchLDAPResults(connection, userbaseDN, userFilter);
        	
        	if (!results.isEmpty()) {
        		String teamId = results.get(0).getAttributeValue(teamUniqueAttribute);
           		return teamId;
        	} else { 
        		System.out.println("UserDN not found for :" + username);
        		return ""; }
        	
		} catch(LDAPException e) {
	    	System.out.println("findUserDN failure");
	    	return "";
	    }
	}
	

	
	public static Boolean authenticationAttempt (LDAPConnection connection, String userDN, String credentials) {
		
		try {
		BindRequest bindRequest = new SimpleBindRequest(userDN,credentials);
    	BindResult bindResult = connection.bind(bindRequest);
    	if(bindResult.getResultCode().equals(ResultCode.SUCCESS)) return true;
    	else return false;
		} catch(LDAPException e) {
	    	System.out.println("authentication bind failure");
	    	return false;
	    }
	}
	
	
}

