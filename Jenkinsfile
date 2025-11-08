pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps {
        echo 'Deploy da Vinheria'
        sh 'echo "build ok" > build.txt'
      }
    }
    stage('Publish') {
      steps {
        sh '''
          mkdir -p publish
          cp -r catalog-service orders-service docker-compose.yml .env publish/
          echo "Artefatos copiados para pasta de publicação."
        '''
      }
    }
    
   
