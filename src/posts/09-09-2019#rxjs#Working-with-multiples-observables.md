<p align="middle">
<img src="https://rxjs-dev.firebaseapp.com/assets/images/favicons/favicon-192x192.png" align="middle" title="rxJS" alt="Logo rxJs">
</p>
Working with reactive programming, sometimes we need more than one service, to perform a certain function or render something on the screen.

When we call a service that returns an observable, we can treat it individually the way we want it. In situations where more than one observable treatment is required we can use forkJoin.

## forkJoin(...sources: any[]):  Observable<any>

The method [forkJoin](https://rxjs-dev.firebaseapp.com/api/index/function/forkJoin) of rxJS library allows you to send N observables and return them as an array - or object - when they are all completed.

Seems like ```Promise.all``` 🧐, but it is different.
<hr>

In this example we have some fetchs for a public api that returns dog images.
   

    forkJoin(
      this.http.get('https://dog.ceo/api/breeds/image/random'),
      this.http.get('https://dog.ceo/api/breeds/image/random'),
      this.http.get('https://dog.ceo/api/breeds/image/random')
    )
    .subscribe(result => console.log(result));

In the code above we pass requests directly as arguments of **forkJoin**, so the response will be an array, where position 0 is the response of the first request and so on.

    [
      {
       "message":"https://images.dog.ceo/breeds/appenzeller/n02107908_4142.jpg",
       "status":"success"
      },
      {
       "message":"https://images.dog.ceo/breeds/kuvasz/n02104029_4450.jpg",
       "status":"success"
      }
    ]

We can also pass an object containing our requests and service calls, having their return as the keys themselves passed in the object. For example :

    forkJoin(
      {
        imagem1:  this.http.get('https://dog.ceo/api/breeds/image/random'),
        imagem2:  this.http.get('https://dog.ceo/api/breeds/image/random'
      }
    ).subscribe(console.log);

Passing as object, the response will be like :

    [
      imagem1: {
       "message":"https://images.dog.ceo/breeds/appenzeller/n02107908_4142.jpg",
       "status":"success"
      },
      imagem2: {
       "message":"https://images.dog.ceo/breeds/kuvasz/n02104029_4450.jpg",
       "status":"success"
      }
    ]
