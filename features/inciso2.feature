Feature: Reserva con usuario existente

@inciso2
Scenario: El usuario realiza una reserva de seis noches
    Given que el usuario ingresa a la página del hotel
    And inicia sesión con credenciales válidas
    When visualiza el detalle de una habitación y la selecciona
    And realiza una reserva de 6 noches
    Then debe visualizar la reserva realizada correctamente
