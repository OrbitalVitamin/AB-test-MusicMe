package com.function.signalRtest;

public class QuestionAttributes {
    private int correctIndex;
    private Song song1;
    private Song song2;
    private Song song3;
    private Song song4;

    public QuestionAttributes(int correctIndex, Song song1, Song song2, Song song3, Song song4) {
        this.correctIndex = correctIndex;
        this.song1 = song1;
        this.song2 = song2;
        this.song3 = song3;
        this.song4 = song4;
    }

    public int getCorrectIndex() {
        return this.correctIndex;
    }

    public void setCorrectIndex(int correctIndex) {
        this.correctIndex = correctIndex;
    }

    public Song getSong1() {
        return this.song1;
    }

    public void setSong1(Song song1) {
        this.song1 = song1;
    }

    public Song getSong2() {
        return this.song2;
    }

    public void setSong(Song song2) {
        this.song2 = song2;
    }

    public Song getSong3() {
        return song3;
    }

    public void setSong3(Song song3) {
        this.song3 = song3;
    }

    public Song getSong4() {
        return this.song4;
    }

    public void setSong4(Song song4) {
        this.song4 = song4;
    }
}
