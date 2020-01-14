
  
  

<img  width="100%"  src="https://cdn-images-1.medium.com/max/2000/0*zrP9gwl9luDtD3Ru.png">

  

Developed by Facebook at 2012, [*GraphQL](https://graphql.org/)* is a language to - in a very fast and simple way - manipulate and request data for the client side of your application.

  

With a very simple syntax and increasing popularity, used by leading developers and large companies as Github, Coursera, Pinterest, GraphQL is already a reality in many projects, including  at my work.

  

<img  title="Google Trends graph shows the ‘GraphQL’ searches popularity at the last 4 years."  width="100%"  src="https://cdn-images-1.medium.com/max/2266/0*dNcvXTh9yRpTM6jl.png">

  

Google Trends graph shows the 'GraphQL' searches popularity at the last 4 years.
In this article, we will see how this technologies work together in a practical way. You can check the sample project in this [repository](https://github.com/vitorpiovezam/nerdzao-graphql). Just remember to add your endpoint and your configure your squema !

  

## Data manipulation with GraphQL

  

**Types** are how GraphQL define the data, your squema and definition.
  

  

In this sample we have the type **Project**, who have a string Name, string Tagline and multiple users, of type **User** !

```
    type Project {
      name: String
      tagline: String
      contributors: [User]
    }

    type User {
      name: String
    }
```

  
Request your data, sending queries to GraphQL server.

```
    {
	  project(name: "GraphQL") {
	    tagline
	  }
	}
```
  
  

And be happy with your response :)

  
```
    {
	  "project": {
	    "tagline": "A query language for APIs"
	  }
	}	
```
  
  
  

## Graphcool

  

Graphcool is a open-source framework and platform, to create BaaS, developing serverless GraphQL web-services. We will know in the hands-on development of this small project.

  
  

<img  width="100%"  src="https://cdn-images-1.medium.com/max/2800/0*MFIk5MhGKnas6yYu.png">

  

## Apollo Client

  

[Apollo Client ](https://www.apollographql.com/)is an powerful client to make requests with GraphQL, also open-source, it's perfect for Angular but also runs in others technologies like Vue, Meteor and Ember.

  

The image above shows the schema from our application. We will import Apollo to our project with NPM, and use to send queries for our Graphcool endpoint.

  

<img  width="100%"  title="Como o apollo funciona"  src="https://cdn-images-1.medium.com/max/2800/0*1NOvTnlH_Jra6GuK.png">

  

## Hands on, lets make all this stuff.

  
  
  

#### You must have

  

* Some knowledge in [ES6](http://es6-features.org/) Javascript.

  

* Visual Studio Code

  

*  [Node](https://nodejs.org/en/) >v10.X and NPM

  

## 1. Installing Angular, creating project and adding dependencies.

  
  

    ```$ ng new apollo-graphql --skip-tests```

  
  
  

After project creation, add some dependencies. We will know more about each at implementation.

  

    ```$ npm i --save apollo-angular-link-http apollo-angular apollo-cache-inmemory apollo-client graphql graphql-tag```

Now our project is ready to go.
  
  

## 2. Creating squema in Graphcool and get the endpoint.

  
  

Go to [Console](https://console.graph.cool/) and create your account. After login, Graphcool will create an sample project, the plataform is very self explaining, so feel free to explore.
In the sample project, go to squema menu, we will get something like this :
  
```
    type File @model {
      contentType: String!
      createdAt: DateTime! 
      id: ID! @isUnique
      name: String!
      secret: String! @isUnique
      size: Int!
      updatedAt: DateTime!
      url: String! @isUnique
    }
    
    type User @model {
      createdAt: DateTime!
      id: ID! @isUnique
      name: String!
      updatedAt: DateTime!
    }
```
  
  
  

In the sample project, go to bottom-left of the page and click in "endpoint", this link will be used to configure Apollo client.

  

<img  width="100%"  title="Guarda esse cara /o/, mas não o meu, o seu"  src="https://cdn-images-1.medium.com/max/2744/0*Env_6i6yXijdDrdk.png">

  

## 3. Configure ApolloClient on Angular and start sending queries and Mutations.

  
  
  

To configure Apollo client and get read o send queries, is necessary just one file, so grab your endpoint from previous step and create an file in your src/app called *apollo-config.module.ts*.
  
```
    import { NgModule } from '@angular/core';
    import { ApolloModule, Apollo } from 'apollo-angular';
    import { HttpClientModule } from '@angular/common/http';
    import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
    import { InMemoryCache } from 'apollo-cache-inmemory';
    
    @NgModule({
        imports:[
            HttpClientModule,
            ApolloModule,
            HttpLinkModule
        ]
    })
    
    export class ApolloConfigModule {
        constructor(
            private apollo: Apollo,
            private httpLink: HttpLink
        ){
            const uri = 'https://api.graph.cool/simple/v1/cjmi9259f0t5a9c'; // Your endpoint goes here
            const http = httpLink.create({ uri });
    
            apollo.create({
                link: http,
                cache: new InMemoryCache(),
                connectToDevTools: true
            });
        }
    }
```
This class initilize Apollo and HttpLink to we work with HTTP protocol. Importing his class in a Angular module we already able to sending queries. I'ill not enter in line by line details in this article.

Export ApolloConfigModule to app.module.
```
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    
    import { AppComponent } from './app.component';
    import { ApolloModule } from 'apollo-angular';
    import { ApolloConfigModule } from './apollo-config.module';
    
    @NgModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule
      ],
      exports: [
        ApolloConfigModule // Apollo will be injected in all module who import app module
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
```
  

Now we are ready to send queries at app.component.ts
```
    import { Component } from '@angular/core'; 
    import { Apollo } from 'apollo-angular'
    import gql from 'graphql-tag'
    
    /*
      Apollo is needed to bring Apollo class to the constructor
      gql is a lib to create larger strings - our queries - and permit
      vscode syntax-highlight
    */
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.less']
    })
    export class AppComponent {
      title = 'graphcool-chat';
    
      constructor(private apollo: Apollo){
        this.createUser('Vitor','vitorpiovezam@yandex.com','123456789');
        this.allUsers();
      }
    
      allUsers(): void{
        let count = 0;
      }
    
      // Get Users
      allUsers() {
        this.apollo.mutate({
          mutation: gql`
            query allUsers {
              allUsers {
                id
                name
              }
            }
          `
        }).subscribe(res => console.log(res));
      }
    
      // Mutation Sample
      async createUser(name,email,password){
        this.apollo.mutate({
          mutation: gql`
            mutation CreateNewUser($name: String!, $email: String!, $password: String!){
              createUser(name: $name, email: $email, password: $password){
                id,
                name,
                email,
              }
            }
          `,
          variables:{
            name: name,
            email: email,
            password: password
          }
        }).subscribe(res => console.log(res));
      }
    
    }
```
  

And thats it. In this sample, Apollo will create an return an observable with Graphcool return. I recommend you go back to your Graphcool console and see the items created and explore !
  
