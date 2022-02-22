package com.function.signalRtest;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Queue;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

public final class Matchmaking {
    private static volatile Matchmaking INSTANCE = null;

    private Queue<String> userQueue;
    private Queue<String> randomQueue;
    private HashMap<String, String> games;
    private HashMap<String, Match> matches;
    private  Matchmaking(){}

    public static Matchmaking getInstance(){ 
        if (INSTANCE  == null){
            synchronized (Matchmaking.class){
                if (INSTANCE == null){
                    System.out.println("Creating!");
                    INSTANCE = new Matchmaking();
                    INSTANCE.games = new HashMap<>();
                    INSTANCE.matches = new HashMap<>();
                    INSTANCE.userQueue = new ArrayDeque<String>();
                    INSTANCE.randomQueue = new ArrayDeque<>();
                }
            }
        }
        return INSTANCE;  
    }
    public boolean availableMatch(String id){

        boolean available = !userQueue.isEmpty();

        if(!available){
            this.userQueue.add(id);
        }
        return available;
    }

    public String createMatch(String userId){
        String gameId = UUID.randomUUID().toString(); 
        String userId2 = userQueue.remove();
        System.out.println("Id1 " + userId );
        System.out.println("Id2 " + userId2);
        this.randomQueue.add("RANDOM!");
        this.games.put(userId, gameId);
        this.games.put(userId2, gameId);
        this.matches.put(gameId, new Match(gameId, userId, userId2));
        return gameId;
    }

    public void endMatch(String gameId){
        this.games.remove(matches.get(gameId).getUser1Id());
        this.games.remove(matches.get(gameId).getUser2Id());
        this.matches.remove(gameId);
    }

    public String getMatchId(String userId){
        return this.games.get(userId);
    }

    public void updateScore(String id, boolean answer){
        this.matches.get(this.games.get(id)).updateScore(id);
    }

}