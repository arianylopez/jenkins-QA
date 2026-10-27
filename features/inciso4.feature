Feature: Modificación y cancelación de reserva

@inciso4
Scenario: El usuario modifica una reserva existente y la cancela
    Given que el usuario ingresa a la página del hotel
    And inicia sesión con credenciales válidas
    When accede a la sección Mis reservas y selecciona una reserva existente
    And modifica la reserva para que dure 14 noches
    Then debe visualizar la modificación guardada correctamente
    When cancela la reserva seleccionada
    Then debe visualizar la cancelación realizada correctamente
