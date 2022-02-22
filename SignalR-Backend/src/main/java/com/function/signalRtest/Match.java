package com.function.signalRtest;

import java.util.HashMap;

public class Match {
    private String gameId;
    private HashMap<String, Integer> scores = new HashMap<>();
    private String user1Id;
    private String user2Id;

    public Match(String gameId,String user1Id,String user2Id){
        this.gameId = gameId;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.scores.put(user1Id, 0);
        this.scores.put(user2Id, 0);
    }


    public String getGameId(){
        return this.gameId;
    }

    public Integer getScore(String userId){
        return this.scores.get(userId);
    }

    public String getUser1Id(){
        return this.user1Id;
    }

    public String getUser2Id(){
        return this.user2Id;
    }

    public void updateScore(String id){
        scores.put(id, scores.get(id)+1);
    }
}  
