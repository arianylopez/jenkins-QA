Feature: Gestión de alarmas
Background:
    Given Estoy en la pestaña de alarmas

  @addAlarm
  Scenario: Crear una nueva alarma
    When Creo una alarma a las "11" horas y "30" minutos
    Then La alarma a las "11":"30" debería estar visible
  @cancelAlarm  
  Scenario: Cancelar la creación de una alarma
    When Cancelo la creación de una alarma a las "10" horas y "30" minutos
    Then La alarma a las "10":"30" no debería existir
  @deleteAlarm
  Scenario: Eliminar una alarma existente
    When Creo una alarma a las "11" horas y "30" minutos
    Then La alarma a las "11":"30" debería estar visible
    When Elimino la alarma a las "11":"30"
    Then La alarma a las "11":"30" no debería existir  