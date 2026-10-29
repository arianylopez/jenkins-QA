pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    parameters {
        string(name: 'APP_ID', defaultValue: '', description: 'Identificador bs:// aceptado. Si esta vacio, proporciona APK_URL.')
        string(name: 'APK_URL', defaultValue: '', description: 'URL HTTPS publica de descarga directa del APK; no una pagina de Google Drive.')
        string(name: 'DEVICE', defaultValue: '', description: 'Nombre exacto del dispositivo del catalogo de BrowserStack.')
        string(name: 'ANDROID_VERSION', defaultValue: '', description: 'Version Android compatible con el dispositivo elegido.')
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
        stage('Ejecutar Appium en BrowserStack') {
            steps {
                script {
                    if (!params.DEVICE?.trim() || !params.ANDROID_VERSION?.trim()) {
                        error('Completa DEVICE y ANDROID_VERSION con una combinacion real de BrowserStack.')
                    }
                    if (!params.APP_ID?.trim() && !params.APK_URL?.trim()) {
                        error('Proporciona APP_ID o APK_URL. El APK debe ser aceptado por BrowserStack.')
                    }
                }
                withCredentials([usernamePassword(
                    credentialsId: 'browserstack',
                    usernameVariable: 'BROWSERSTACK_USER',
                    passwordVariable: 'BROWSERSTACK_KEY'
                )]) {
                    withEnv([
                        "BROWSERSTACK_APP=${params.APP_ID.trim()}",
                        "APK_URL=${params.APK_URL.trim()}",
                        "BROWSERSTACK_DEVICE=${params.DEVICE.trim()}",
                        "BROWSERSTACK_OS_VERSION=${params.ANDROID_VERSION.trim()}",
                        "BROWSERSTACK_BUILD_NAME=${env.JOB_NAME} #${env.BUILD_NUMBER}"
                    ]) {
                        bat '@echo off\nnpm run check:browserstack'
                        script {
                            if (!params.APP_ID.trim()) {
                                bat '@echo off\nnpm run upload:browserstack'
                            }
                        }
                        bat '@echo off\nnpm run test:browserstack'
                    }
                }
            }
        }
    }

    post {
        always {
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
            archiveArtifacts artifacts: 'allure-results/browserstack/**,reports/browserstack/app.json', allowEmptyArchive: true
            echo 'Pipeline finalizada. Revisa los resultados y la sesion en App Automate.'
        }
    }
}
