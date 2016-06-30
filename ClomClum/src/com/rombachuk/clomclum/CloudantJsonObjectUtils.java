package com.rombachuk.clomclum;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


import com.cloudant.client.api.Database;
import com.cloudant.client.api.views.Key;
import com.cloudant.client.api.views.Key.ComplexKey;
import com.cloudant.client.api.views.ViewRequest;
import com.cloudant.client.api.views.ViewRequestBuilder;
import com.cloudant.client.api.views.ViewResponse;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class CloudantJsonObjectUtils {
	
	 public static List<JsonObject> viewResultDocsAsJSON (Database dbname, String viewFilter, List<String> providedKeys) throws  IOException {
		
	    List<JsonObject> responseDocsAsJson = new ArrayList<JsonObject>();
			 
		String[] viewFilterParts = viewFilter.split("/");
		String designDoc = ""; String filter = "";
		if (viewFilterParts.length == 2){
			designDoc = viewFilterParts[0];
			filter    = viewFilterParts[1];
		}
		
		ComplexKey thisComplexKey = Key.complex((String)providedKeys.get(0));
     	for (int i=1;i<providedKeys.size();i++) {
    		thisComplexKey.add((String)providedKeys.get(i));
    	}
   
     	if (providedKeys.size() == 1) {
    		ViewRequestBuilder viewRequestBuilder = dbname.getViewRequestBuilder(designDoc, filter);
    		ViewRequest<String,String> result =  viewRequestBuilder.newRequest(Key.Type.STRING, String.class)
    		                                        .keys(providedKeys.get(0))
    		                                        .includeDocs(true)
    		                                        .build();
    		ViewResponse<String,String> response   = result.getResponse();     	
     		responseDocsAsJson = response.getDocsAs(JsonObject.class);	
            
         	} 
     	    else { 
         		if (providedKeys.size() > 0) { 
         	         ViewRequestBuilder viewRequestBuilder = dbname.getViewRequestBuilder(designDoc, filter);
		             ViewRequest<ComplexKey,String> result =  viewRequestBuilder.newRequest(Key.Type.COMPLEX, String.class)
		                                        .keys(thisComplexKey)
		                                        .includeDocs(true)
		                                        .build();
		             ViewResponse<ComplexKey,String> response   = result.getResponse();     	
		             responseDocsAsJson = response.getDocsAs(JsonObject.class);	
     	          }
         		else { responseDocsAsJson.add((JsonObject)new JsonParser().parse("{}")); }
         	 } 
     	return(responseDocsAsJson);
    }

}
