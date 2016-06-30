package com.rombachuk.clomclum;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.util.Arrays;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.ShortBufferException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.xml.bind.DatatypeConverter;

import org.apache.commons.codec.binary.Base64;

import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.http.Http;
import com.cloudant.http.HttpConnection;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class CloudantSecurityCommon {

	
	public static Boolean putCouchdbSecurityDocument (CloudantClient client,  JsonObject cluster, String dbid, JsonObject SecurityEntry) throws IOException {
        
		String url = cluster.get("url").getAsString() + "/" + dbid + "/_security";
		System.out.println("url="+url);
	    	 HttpConnection response = client.executeRequest(Http.PUT(new URL(url), "application/json").setRequestBody(SecurityEntry.toString()));
	         JsonObject result = (JsonObject) new JsonParser().parse(response.responseAsString());
 	     response.disconnect();
	     if (result.get("ok").getAsBoolean()) { return true; }
	     else {return false;}

}
	
	public static CloudantClient getCloudantClientAsUser (String url, HttpSession session) {
		
			String account = session.getAttribute("sessionUsername").toString();
			String credentials = session.getAttribute("sessionUserpassword").toString();
  
			CloudantClient client=null;
			try {
				client = ClientBuilder.url(new URL(url))
				                                .username(account)
				                                .password(credentials)
				                                .build();
			} catch (MalformedURLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			    return(client);
		
	}
	
	public static CloudantClient getCloudantClient (String url, String account, String password, String key, String iv)  {
		
		CloudantClient client=null;
		try {
		        String decrypted_password = decryptCredentials (password,key,iv);
		        
			    client =    ClientBuilder.url(new URL(url))
                                            .username(account)
                                            .password(decrypted_password)
                                            .build();
			    return(client);
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
	
	public static CloudantClient getCloudantClientForRegistry (ServletContext ctx) {
		
		String cluster_url 	 =ctx.getInitParameter("ClomClumClusterURL");
	    String cluster_credentials =ctx.getInitParameter("ClomClumServiceAccountPassword");
	    String cluster_service_account =ctx.getInitParameter("ClomClumServiceAccount");
	    String key = ctx.getInitParameter("ClomClumCredentialsKey");
	    String iv = ctx.getInitParameter("ClomClumCredentialsIV");
	    
	    CloudantClient client = CloudantSecurityCommon.getCloudantClient (cluster_url,
                cluster_service_account,cluster_credentials,key,iv);
	    return(client);
	}
	
	public static CloudantClient getCloudantClientForCluster (Database registryDB, ServletContext ctx,  String clusterid) throws  IOException {
		
	    JsonObject ClusterInfo = registryDB.find(JsonObject.class,clusterid);
	    String cluster_url = ClusterInfo.get("url").getAsString();
	    String cluster_credentials =ctx.getInitParameter(ClusterInfo.get("servicecredentials_ctx_parameter").getAsString());
	    String cluster_service_account =ctx.getInitParameter(ClusterInfo.get("serviceaccount_ctx_parameter").getAsString());
	    String key = ctx.getInitParameter("ClomClumCredentialsKey");
	    String iv = ctx.getInitParameter("ClomClumCredentialsIV");
	    
	    CloudantClient client = CloudantSecurityCommon.getCloudantClient (cluster_url,
                cluster_service_account,cluster_credentials,key,iv);
	    return(client);
	}
	
	public static String encryptCredentials (String password_unencrypted, String key, String iv) throws IOException {

		try {
    
	    ObjectCrypter credentials_crypto = new ObjectCrypter(key.getBytes(),iv.getBytes("UTF-8"));	        
            byte[] password_encrypted_bytes = credentials_crypto.encrypt(password_unencrypted);
         //   String password_encrypted_string = Arrays.toString(password_encrypted_bytes);
            String password_encrypted_string = Base64.encodeBase64String(password_encrypted_bytes);
           return (password_encrypted_string);
		}    
		catch (UnsupportedEncodingException | InvalidKeyException | InvalidAlgorithmParameterException
				| IllegalBlockSizeException | ShortBufferException 
				| BadPaddingException   e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "Cannot encrypt";
		}
		
	}


	public static String decryptCredentials (String encryptedString, String key, String iv) throws IOException {

		try {
		
			// encryptedString is of format [-10,-20,-90....] - Need to strip off [] brackets
			// String insideBracketsString = encryptedString.substring(1,encryptedString.length()-1);
			// String[] components = insideBracketsString.split(",");
			// byte[] password_encrypted = new byte[components.length];
			// for (int i=0; i< components.length; i++) {
			//	password_encrypted[i] = (byte) Integer.parseInt(components[i].trim());
			// }
    
		byte[] password_encrypted2 = Base64.decodeBase64(encryptedString);
 
	    ObjectCrypter credentials_crypto = new ObjectCrypter(key.getBytes(),iv.getBytes("UTF-8"));	        
           Object password_decrypted = credentials_crypto.decrypt(password_encrypted2);
           return (password_decrypted.toString());
		}    
		catch (UnsupportedEncodingException   e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} catch (InvalidKeyException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvalidAlgorithmParameterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalBlockSizeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (BadPaddingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return iv;
	}

}
