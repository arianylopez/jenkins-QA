Feature: Funcionalidades extra del Reloj

  @startTimer
  Scenario: Iniciar un temporizador de 1 minuto
    Given Estoy en la pestaña "Timer"
    When Escribo "1" para los minutos
    And Presiono el botón de iniciar temporizador
    Then El temporizador debería comenzar

  @addCity
  Scenario: Agregar una ciudad al reloj mundial
    Given Estoy en la pestaña "Clock"
    When Presiono el botón agregar ciudad
    And Busco la ciudad "Madrid"
    Then La ciudad "Madrid" debería agregarse

  @startStopwatch
  Scenario: Iniciar el cronómetro
    Given Estoy en la pestaña "Stopwatch"
    When Presiono el botón de iniciar cronómetro
    Then El tiempo del cronómetro debería avanzar

  @pauseStopwatch
  Scenario: Pausar el cronómetro
    Given Estoy en la pestaña "Stopwatch"
    When Presiono el botón de pausar cronómetro
    Then El tiempo del cronómetro debería detenerse

  @lapStopwatch
  Scenario: Marcar una vuelta en el cronómetro
    Given Estoy en la pestaña "Stopwatch"
    And Presiono el botón de iniciar cronómetro
    When Presiono el botón de vuelta
    Then Debería registrarse una nueva vuelta
