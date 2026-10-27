Feature: Crud para crear Usuario

  Background:
    * url 'https://gorest.co.in/public/v2'
    * header Accept = 'application/json'
    * header Content-Type = 'application/json'
    * header Authorization = 'Bearer 700d0c7a86eb84028bf5cd204b11587f812f9d7cd880dc4edbdbd1d407ae9954'
    * def req_headers = {Authorization: 'Bearer 700d0c7a86eb84028bf5cd204b11587f812f9d7cd880dc4edbdbd1d407ae9954'}
    * def dataGenerator = Java.type('Utils.DataGenerator') 
    * def payload =
        """
            {
                "gender":"female", 
                "status":"active"
            }
        """    
    * payload.name = dataGenerator.getUserRandom().name
    * payload.email = dataGenerator.getUserRandom().email 

  @Regresion @PostUser @User 
  Scenario: Crear Usuario Nuevo usando FakeData
    * def emailFake = dataGenerator.getEmailRandom()
    * def nameFake = dataGenerator.getRandonName()
    Given path 'users'
    And request {"name":#(nameFake), "gender":"male", "email":#(emailFake), "status":"active"}
    When method Post
    Then status 201
    And match response ==
    """
        {
        "id": "#number",
        "name": "#string",
        "email": "#string",
        "gender": "#string",
        "status": "#string"
        }
    """

  @Regresion @GetListUser @User
  Scenario: Obtener Lista de Usuarios
    Given path 'users'
    When method Get
    Then status 200 

  @Regresion @GetUserById @User
  Scenario: Obtener Datos de un Usuario
    Given path 'users'
    And request payload
    When method Post
    Then status 201
      * def userid = response.id
      * print userid
    Given path 'users/' , userid
    And headers req_headers
    When method Get
    Then status 200
    And match response.email == payload.email

  @Regresion @UpdateUser @User
  Scenario: Actualizar Usuario por ID 
    Given path 'users'
    And request payload
    When method Post
    Then status 201
      * def userid = response.id
      * print userid
    Given path 'users/', userid
    And headers req_headers
    And request {"name":"Usuario Actualizado", "gender":"male" }
    When method Put
    Then status 200
    And match response.name == 'Usuario Actualizado'

  @Regresion @DeleteUser @User
  Scenario: Eliminar Usuario por ID
    Given path 'users'
    And request payload
    When method Post
    Then status 201
      * def userid = response.id
      * print userid
    Given path 'users/', userid
    And headers req_headers
    When method Delete
    Then status 204
    