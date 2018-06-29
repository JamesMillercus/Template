job('Boilerplate-seed') {
    // software configuration management
    scm {
        // jenkins will clone below repo
        git('https://github.com/JamesMillercus/Template.git') {  node -> // is hudson.plugins.git.GitSCM
            node / gitConfigName('DSL User')
            node / gitConfigEmail('hi@jamesmiller.design')
        }
    }
    // how we build the repo
    triggers {
        // poll scm every 5 mins, if there is a change then rebuild
        scm('H/5 * * * *')
    }
    // define the env inside of the scm
    wrappers {
        // use the nodejs env
        nodejs('nodejs') // this is the name of the NodeJS installation in 
                         // Manage Jenkins -> Configure Tools -> NodeJS Installations -> Name
    }
    // define steps that need to be actioned by jenkins
    steps {
        dockerBuildAndPublish {
            repositoryName('simuha999/boilerplate')
            tag('${GIT_REVISION,length=9}')
            registryCredentials('dockerhub')
            forcePull(false)
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
            buildContext(String 'web/nodejs')
            dockerfilePath(String 'web/nodejs/jenkins/Dockerfile')
        }
    }
}