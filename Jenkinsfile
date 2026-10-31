pipeline {
    agent any

    environment {
        // Actual directory structure in F:/waste-management-app uses 'server' for backend and 'client' for frontend
        BACKEND_DIR  = 'server'
        FRONTEND_DIR = 'client'
        IMAGE_NAME   = 'waste-management-backend'
        IMAGE_TAG    = "${BUILD_NUMBER}"
    }

    tools {
        maven 'Maven-3.9.16'
        jdk   'JDK-21'
    }

    stages {
        // Stage 1: Checkout - Pull latest source code from SCM repository
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Checking out source code from SCM ==='
                checkout scm
            }
        }

        // Stage 2: Maven Build - Compile the Java Spring Boot backend
        stage('Maven Build') {
            steps {
                script {
                    // Dynamically targets 'backend' or 'server' folder based on actual repo layout
                    def targetDir = fileExists('backend') ? 'backend' : (fileExists('server') ? 'server' : env.BACKEND_DIR)
                    echo "=== Stage 2: Compiling Spring Boot backend in ./${targetDir} ==="
                    dir(targetDir) {
                        if (isUnix()) {
                            sh 'mvn clean compile'
                        } else {
                            bat 'mvn clean compile'
                        }
                    }
                }
            }
        }

        // Stage 3: Maven Test - Run automated test suite
        stage('Maven Test') {
            steps {
                script {
                    def targetDir = fileExists('backend') ? 'backend' : (fileExists('server') ? 'server' : env.BACKEND_DIR)
                    echo "=== Stage 3: Running Maven tests in ./${targetDir} ==="
                    dir(targetDir) {
                        if (isUnix()) {
                            sh 'mvn test'
                        } else {
                            bat 'mvn test'
                        }
                    }
                }
            }
            post {
                always {
                    script {
                        def targetDir = fileExists('backend') ? 'backend' : (fileExists('server') ? 'server' : env.BACKEND_DIR)
                        junit allowEmptyResults: true, testResults: "${targetDir}/target/surefire-reports/*.xml"
                    }
                }
            }
        }

        // Stage 4: Package JAR - Package executable Spring Boot JAR file
        stage('Package JAR') {
            steps {
                script {
                    def targetDir = fileExists('backend') ? 'backend' : (fileExists('server') ? 'server' : env.BACKEND_DIR)
                    echo "=== Stage 4: Packaging Spring Boot JAR in ./${targetDir} ==="
                    dir(targetDir) {
                        if (isUnix()) {
                            sh 'mvn package -DskipTests'
                        } else {
                            bat 'mvn package -DskipTests'
                        }
                    }
                }
            }
            post {
                success {
                    script {
                        def targetDir = fileExists('backend') ? 'backend' : (fileExists('server') ? 'server' : env.BACKEND_DIR)
                        archiveArtifacts allowEmptyArchive: true, artifacts: "${targetDir}/target/*.jar", fingerprint: true
                    }
                }
            }
        }

        // Stage 5: Docker Build - Build the Docker container image for the backend
        stage('Docker Build') {
            steps {
                script {
                    def targetDir = fileExists('backend') ? 'backend' : (fileExists('server') ? 'server' : env.BACKEND_DIR)
                    echo "=== Stage 5: Building backend Docker image from context: ./${targetDir} ==="
                    def dockerCmd = "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} -t ${env.IMAGE_NAME}:latest ./${targetDir}"
                    if (isUnix()) {
                        sh dockerCmd
                    } else {
                        bat dockerCmd
                    }
                }
            }
        }
    }

    post {
        success {
            echo '======================================================='
            echo '  Pipeline Completed Successfully! JAR & Docker Ready  '
            echo '======================================================='
        }
        failure {
            echo '======================================================='
            echo '  Pipeline Failed! Please inspect stage execution logs '
            echo '======================================================='
        }
    }
}
