Feature: Registro y reserva

@inciso3
Scenario: Un usuario nuevo realiza una reserva de dos noches
    Given que el usuario ingresa a la página del hotel
    When registra un usuario nuevo
    And inicia sesión con el usuario registrado cuando corresponde
    And visualiza el detalle de una habitación y la selecciona
    And realiza una reserva de 11 noches
    Then debe visualizar la reserva realizada correctamente
