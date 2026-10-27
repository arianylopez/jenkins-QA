// Practico 3 Bloque 2 - Integracion Continua para QA de APIs
// Requiere Pipeline, JUnit y HTML Publisher. Agente Windows.
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    parameters {
        choice(name: 'MODO', choices: ['COMPLETO', 'SOLO_SMOKE'], description: 'Todas las pruebas o verificacion rapida de disponibilidad')
        booleanParam(name: 'PRUEBAS_NEGATIVAS', defaultValue: true, description: 'Incluye HTTP 401, 404 y 422 en el modo completo')
        string(name: 'MAX_PROMEDIO_MS', defaultValue: '3000', description: 'Umbral de latencia promedio para la puerta de calidad')
        string(name: 'MAX_P95_MS', defaultValue: '5000', description: 'Umbral de latencia p95 para la puerta de calidad')
        booleanParam(name: 'SIMULAR_FALLO', defaultValue: false, description: 'Demo: demuestra que la puerta de calidad bloquea una entrega')
    }

    environment {
        // Ruta probada en el Jenkins anterior de esta computadora.
        NEWMAN_CMD = 'C:\\Users\\arian\\AppData\\Roaming\\npm\\newman.cmd'
    }

    stages {
        stage('01 - GitHub / Checkout') {
            steps { checkout scm }
        }
        stage('02 - Preflight y contratos') {
            steps {
                bat '''
@echo off
where node >nul 2>&1 || (echo ERROR: node no esta en PATH & exit /b 1)
if not exist "%NEWMAN_CMD%" (echo ERROR: no se encontro Newman en %NEWMAN_CMD% & exit /b 1)
node tools/preflight.js
'''
            }
        }
        stage('03 - Smoke / Disponibilidad') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat '''
@echo off
call "%NEWMAN_CMD%" run "QA_Smoke.postman_collection.json" -e "PruebaQA1.postman_environment.json" -r cli,json,junit --delay-request 100 --reporter-json-export "reports/raw-smoke.json" --reporter-junit-export "reports/smoke.xml"
exit /b %ERRORLEVEL%
'''
                }
            }
        }
        stage('04 - Regresion / CRUD') {
            when { expression { params.MODO != 'SOLO_SMOKE' } }
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat '''
@echo off
call "%NEWMAN_CMD%" run "PruebaQA1.postman_collection.json" -e "PruebaQA1.postman_environment.json" -r cli,json,junit --delay-request 100 --reporter-json-export "reports/raw-regresion.json" --reporter-junit-export "reports/regresion.xml"
exit /b %ERRORLEVEL%
'''
                }
            }
        }
        stage('05 - Negativas / Seguridad y validacion') {
            when { expression { params.MODO != 'SOLO_SMOKE' && params.PRUEBAS_NEGATIVAS != false } }
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat '''
@echo off
call "%NEWMAN_CMD%" run "QA_Negativas.postman_collection.json" -e "PruebaQA1.postman_environment.json" -r cli,json,junit --delay-request 100 --reporter-json-export "reports/raw-negativas.json" --reporter-junit-export "reports/negativas.xml"
exit /b %ERRORLEVEL%
'''
                }
            }
        }
        stage('06 - Quality Gate / Dashboard') {
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    bat '''
@echo off
node tools/quality-gate.js --modo "%MODO%" --negativas "%PRUEBAS_NEGATIVAS%" --promedio "%MAX_PROMEDIO_MS%" --p95 "%MAX_P95_MS%" --simular "%SIMULAR_FALLO%"
exit /b %ERRORLEVEL%
'''
                }
            }
        }
    }

    post {
        always {
            junit testResults: 'reports/*.xml', allowEmptyResults: true
            publishHTML(target: [
                reportDir: 'reports',
                reportFiles: 'QA_Dashboard.html',
                reportName: 'QA Dashboard',
                reportTitles: 'Calidad de la API',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
            archiveArtifacts artifacts: 'reports/QA_Dashboard.html, reports/QA_Dashboard.css, reports/QA_Resumen.json, reports/*.xml', allowEmptyArchive: true
        }
    }
}
