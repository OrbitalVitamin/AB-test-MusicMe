package com.function.signalRtest;
import com.fasterxml.jackson.core.*;
import com.fasterxml.jackson.databind.*;


import java.net.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.io.*;
import java.util.Random;

public class Utils {
    public static int count = 0;
    public static List<QuestionAttributes> getQuestions(){
        try {
            String rawSongs = getRawSongs();
            JsonNode songNode = convertStringToJsonNode(rawSongs);
            List<Song> songs = processJsonSongs(songNode);
            List<QuestionAttributes> questionAttributes = new ArrayList<>();
            for(int i = 0; i < songs.size(); i++){
                questionAttributes.add(createQuestion(new ArrayList<Song>(songs), i));
            }
            Collections.shuffle(questionAttributes);
            return questionAttributes;
        } catch (Exception e) {
            return null;
        }
    }

    public static String getRawSongs() throws MalformedURLException, IOException{
        URL url = new URL("https://musicmeapi-apim.azure-api.net/songs/?genre=Pop");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");    


        if(con.getResponseCode() == 200){
            BufferedReader in = new BufferedReader(
            new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer content = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            con.disconnect();
            
            return content.toString();
        } else {
            return "sad";
        }
    }

    public static JsonNode convertStringToJsonNode(String jsonString) throws JsonParseException, IOException{

        ObjectMapper mapper = new ObjectMapper();
        JsonFactory factory = mapper.getFactory();
        JsonParser parser = factory.createParser(jsonString);
        JsonNode node = mapper.readTree(parser);
        return node;
    }

    public static List<Song> processJsonSongs(JsonNode arrNode){
        ArrayList<Song> songs = new ArrayList();
        for(JsonNode node : arrNode){
            JsonNode object = node.get("song");
            String name = object.get("name").asText();
            String artist = object.get("artist").asText();
            songs.add(new Song(name, artist));
        }
        return songs;
    }
    public static List<Song> selectRandomSongs(List<Song> songs){
        List<Song> newSongs = new ArrayList<>();
        Random ran = new Random();

        for(int i = 0; i< 4; i++){
            int index = ran.nextInt(songs.size());
            newSongs.add(songs.get(i));
            songs.remove(i);

        }
        return newSongs;
    }

    public static QuestionAttributes createQuestion(List<Song> songs, int j){
        List<Song> qSongs = new ArrayList<>();
        qSongs.add(songs.get(j));
        songs.remove(j);
        Random ran = new Random();
        for(int i = 0; i < 3; i++){
            int r = ran.nextInt(songs.size());
            qSongs.add(songs.get(r));
            songs.remove(r);
        }
        int r2 = ran.nextInt(qSongs.size());
        Song temp = qSongs.get(0);
        qSongs.set(0, qSongs.get(r2));
        qSongs.set(r2, temp);

        return new QuestionAttributes(r2, qSongs.get(0), qSongs.get(1), qSongs.get(2),qSongs.get(3));
    }
    
}
