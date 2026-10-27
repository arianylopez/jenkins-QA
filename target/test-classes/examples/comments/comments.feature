Feature: Crud para crear Comentarios de Posts de Usuarios

  Background:
    * url 'https://gorest.co.in/public/v2'
    * header Accept = 'application/json'
    * header Content-Type = 'application/json'
    * header Authorization = 'Bearer 700d0c7a86eb84028bf5cd204b11587f812f9d7cd880dc4edbdbd1d407ae9954'
    * def req_headers = {Authorization: 'Bearer 700d0c7a86eb84028bf5cd204b11587f812f9d7cd880dc4edbdbd1d407ae9954'}
    * def dataGenerator = Java.type('Utils.DataGenerator') 
    
    * def userPayload =
        """
            {
                "gender":"female", 
                "status":"active"
            }
        """    
    * userPayload.name = dataGenerator.getUserRandom().name
    * userPayload.email = dataGenerator.getUserRandom().email 
    * def postPayload = 
        """
            {
                "title": "Título de prueba",
                "body": "Este es el contenido del post de prueba"
            }
        """

  @Regresion @CreateComment @Comment
  Scenario: Crear un Comentario para un Post 
    Given path 'users'
    And request userPayload
    When method Post
    Then status 201 
      * def userId = response.id
      * def nameFake = response.name
      * def emailFake = response.email
      * print 'Usuario creado con ID:', userId
    Given path 'users', userId, 'posts'
    And headers req_headers
    And request postPayload
    When method Post
    Then status 201
      * def postId = response.id
      * print 'Post creado con ID:', postId
    Given path 'posts', postId, 'comments'
    And headers req_headers 
    And request {"name":'#(nameFake)', "email":'#(emailFake)', "body":"Este es un comentario de prueba para el post"}
    When method Post
    Then status 201
    And match response.post_id == postId
    And match response.body == "Este es un comentario de prueba para el post"

  @Regresion @GetCommentsByPostId @Comment
  Scenario: Obtener Comentarios de un Post
    Given path 'users'
    And request userPayload
    When method Post
    Then status 201 
      * def userId = response.id
      * def nameFake = response.name
      * def emailFake = response.email

    Given path 'users', userId, 'posts'
    And headers req_headers
    And request postPayload
    When method Post
    Then status 201
      * def postId = response.id

    Given path 'posts', postId, 'comments'
    And headers req_headers 
    And request {"name":'#(nameFake)', "email":'#(emailFake)', "body":"Comentario para validar el GET"}
    When method Post
    Then status 201

    Given path 'posts', postId, 'comments'
    And headers req_headers
    When method Get
    Then status 200
    And match response[0].post_id == postId
    And match response[0].body == "Comentario para validar el GET"

  @Regresion @GetListComments @Comment
  Scenario: Obtener Lista de Comentarios
    Given path 'comments'
    When method Get
    Then status 200