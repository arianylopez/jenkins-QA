pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    parameters {
        string(name: 'STARTER_APP_ID', defaultValue: 'bs://95e223c5f8294026cb9b828671ce668d746f3e65', description: 'App de ejemplo ya aceptada: solo inicia la sesion. Las pruebas se ejecutan en Google Clock preinstalado.')
        string(name: 'DEVICE', defaultValue: 'Google Pixel 7', description: 'Dispositivo donde se comprobo Google Clock preinstalado.')
        string(name: 'ANDROID_VERSION', defaultValue: '13.0', description: 'Version Android comprobada para el Google Pixel 7.')
        booleanParam(name: 'RUN_WEB', defaultValue: true, description: 'Ejecutar tambien la pipeline web QA-WDIO-Allure.')
    }

    stages {
        stage('Preparar Workspace') {
            steps { deleteDir() }
        }
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Instalar dependencias') {
            steps {
                bat 'node --version'
                bat 'npm ci'
            }
        }
        stage('Ejecutar WDIO Web') {
            when { expression { params.RUN_WEB } }
            steps {
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    build job: 'QA-WDIO-Allure', wait: true, propagate: true
                }
            }
        }
        stage('Ejecutar Google Clock en BrowserStack') {
            steps {
                script {
                    // Permite la primera ejecucion aunque el item aun muestre los parametros anteriores.
                    def starterApp = params.STARTER_APP_ID?.trim() ?: 'bs://95e223c5f8294026cb9b828671ce668d746f3e65'
                    def device = params.DEVICE?.trim() ?: 'Google Pixel 7'
                    def androidVersion = params.ANDROID_VERSION?.trim() ?: '13.0'
                    if (!starterApp.startsWith('bs://')) {
                        error('STARTER_APP_ID debe contener el identificador bs:// de la app de ejemplo aceptada.')
                    }
                    withCredentials([usernamePassword(
                        credentialsId: 'browserstack',
                        usernameVariable: 'BROWSERSTACK_USER',
                        passwordVariable: 'BROWSERSTACK_KEY'
                    )]) {
                        withEnv([
                            "BROWSERSTACK_STARTER_APP=${starterApp}",
                            "BROWSERSTACK_DEVICE=${device}",
                            "BROWSERSTACK_OS_VERSION=${androidVersion}",
                            "BROWSERSTACK_BUILD_NAME=${env.JOB_NAME} #${env.BUILD_NUMBER}",
                            'MOBILE_TAGS=@addAlarm or @cancelAlarm'
                        ]) {
                            bat '@echo off\nnpm run check:browserstack'
                            bat '@echo off\nnpm run test:browserstack'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-results/browserstack/**,reports/browserstack/**', allowEmptyArchive: true
            script {
                if (fileExists('allure-results/browserstack')) {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        results: [[path: 'allure-results/browserstack']],
                        reportBuildPolicy: 'ALWAYS'
                    ])
                }
            }
            echo 'Revisa los escenarios de crear/cancelar alarmas en Allure y la sesion de Google Clock en App Automate.'
        }
    }
}
