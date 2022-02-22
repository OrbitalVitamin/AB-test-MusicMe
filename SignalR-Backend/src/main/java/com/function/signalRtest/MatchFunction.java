package com.function.signalRtest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;
import com.microsoft.azure.functions.signalr.*;
import com.microsoft.azure.functions.signalr.annotation.*;

import java.util.List;

public class MatchFunction {

    ObjectMapper mapper = new ObjectMapper();

    //Parts of the code are used under Creative Commons License from https://github.com/MicrosoftDocs/azure-docs


    @FunctionName("search")
    @SignalROutput(name = "$return", hubName = "chat")
    public SignalRMessage searchForMatch(
            @HttpTrigger(
                name = "req", 
                methods = { HttpMethod.POST },
                authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req) {
                    String id = req.getBody().toString();
                    if(Matchmaking.getInstance().availableMatch(id)){
                        String gameId = Matchmaking.getInstance().createMatch(id);
                        List<QuestionAttributes> attributes = Utils.getQuestions();
                        ObjectMapper mapper = new ObjectMapper();
                        try {
                            String message =  mapper.writeValueAsString(attributes);
                            return new SignalRMessage("game",message);
                        } catch (JsonProcessingException e) {
                            return new SignalRMessage("search", false);
                        } 

                    } else {
                        return new SignalRMessage("initSignal", false);
                    }
    }

    @FunctionName("answer")
    @SignalROutput(name = "$return", hubName = "chat")
    public SignalRMessage sendMessage(
            @HttpTrigger(
                name = "req", 
                methods = { HttpMethod.POST },
                authLevel = AuthorizationLevel.ANONYMOUS) HttpRequestMessage<Object> req) {

                return new SignalRMessage("answer", req.getBody());
    }
}
