package Utils;

import com.github.javafaker.Faker;

import net.minidev.json.JSONObject;

public class DataGenerator {
      public static String getEmailRandom(){
        Faker faker = new Faker();
        String email = faker.name().firstName().toLowerCase() + faker.random().nextInt(0,100) + "@test.com";
        return email;
    }

    public static String getRandomUsername(){
        Faker faker = new Faker();
        String username = faker.name().username();
        return username;

    }

      public static String getRandonName(){
        Faker faker = new Faker();
        String name = faker.name().firstName() + " " + faker.name().lastName();
        return name;

    }

      public static JSONObject getUserRandom(){
        Faker faker = new Faker();
        String name = faker.name().firstName() + " " + faker.name().lastName();
        String gender = "male";
        String email = faker.name().firstName().toLowerCase() + faker.random().nextInt(0,100) + "@test.com";
        String status = "active";
        JSONObject json = new JSONObject();
        json.put("name", name);
        json.put("gender", gender);
        json.put("email", email);
        json.put("status", status);
        return json;
    }  
}
