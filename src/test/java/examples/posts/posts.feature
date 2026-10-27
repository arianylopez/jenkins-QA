Feature: Crud para crear Posts de Usuarios

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

  @Regresion @CreatePost @Post 
  Scenario: Crear un Post para un Usuario Nuevo
    Given path 'users'
    And request userPayload
    When method Post
    Then status 201
      * def userId = response.id
      * print 'Usuario creado con ID:', userId
    Given path 'users', userId, 'posts'
    And headers req_headers
    And request {"title": "Título de prueba", "body": "Este es el contenido del post de prueba"}
    When method Post
    Then status 201
    And match response ==
    """
        {
        "id": "#number",
        "user_id": "#(userId)",
        "title": "#string",
        "body": "#string"
        }
    """
    And match response.title == 'Título de prueba'
    And match response.body == 'Este es el contenido del post de prueba'

  @Regresion @GetPostsByUserId @Post
  Scenario: Obtener Posts de un Usuario 
    Given path 'users'
    And request userPayload
    When method Post
    Then status 201 
        * def userId = response.id
    Given path 'users', userId, 'posts'
    When method Get
    Then status 200

  @Regresion @GetListPosts @Post
    Scenario: Obtener Lista de Posts
        Given path 'posts'
        When method Get
        Then status 200