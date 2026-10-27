Feature: Inicio de sesión

@inciso1
Scenario: El usuario accede al sistema con credenciales válidas
    Given que el usuario ingresa a la página del hotel
    When inicia sesión con credenciales válidas
    Then debe visualizar correctamente la página principal
