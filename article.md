# Back to the roots

Il modo in cui sviluppiamo applicazioni in javascript è radicalmente cambiato negli ultimi anni. Javascript è recentemente diventato un linguaggio molto diffuso, che ha rotto le pareti dell'ambiente in cui è nato per diventare utilizzato a tutti i livelli nella produzione di software per il web e non.

D'altra parte non si scrive più javascript come una volta. Per esempio se volessimo scrivere un'applicazione in React.js la prima cosa che faremmo, ancora prima di scrivere una linea di codice, sarebbe di configurare webpack per transpilare il nostro codice ES6, per convertire la sintassi di JSX in qualcosa che il browser possa capire, per minimizzare il codice, creare un source map etc. Scrivere javascript vuol dire avere una fase di compilazione.
Nonostante io veda i vantaggi e apprezzi la direzione in cui stiamo andando, mi sono chiesto come sarebbe scribvere applicazioni come fossimo negli anni 90. Sarebbe così pauroso scrivere utilizzando sol un editor e il browser? Il codice diverrebbe illegibile? Ci sono limiti che non posso superare senza un transpilatore o che sarebbe troppo costoso oltrepassare? Questo articolo è una risposta a questa domanda.

## Il progetto

L'idea è quella di prendere del codice già esistente e ridurlo fino ad avere del codice JS che funzioni sulla maggiorparte dei browser. E' un lavoro a estrusione. In ogni passaggio eliminerò una funzionalità non supportata nativamente dal browser e adatterò il codice. Alla fine dovrebbero restare solo dei file di testo e un'applicazione funzionante senza regressioni. Non potendo avere il controllo anche su varie dipendenze ho deciso di rpendere un progetto auto contenuto. Questo è un peccato visto che anche il modo in cui includiamo le dipendenze è cambiato radicalmente, ma vedrò di fare anche un piccolo esperimento su questo aspetto.
Il progetto che ho scelto è l'esempio di un'applicazione di todos scritta in react e redux ([qui](https://github.com/reactjs/redux/tree/4574a8c/examples/todos) il codice originale). L'ho un po' adattata semplificando il sistema di build per averne pieno controllo. 
Il codice iniziale lo trovate allo [step-0](https://github.com/ramiel/naked-modern-js/tree/step-0)
Ah, ecco come appare l'applicazione, dopo il passaggio di webpack e servita da un server di sviluppo:

![todo application](http://res.cloudinary.com/ramiel/image/upload/v1477824533/todo_fj3jwt.gif)

## Goodbye next generation javascript

Let's start giving a look to our `webpack.config.js`

```js
const path = require('path')
const config = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public/'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      include: __dirname,
      query: {
        cacheDirectory: true,
        presets: ['es2015', 'stage-0', 'react']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  cache: true,
  devtool: 'source-map',
  devServer: {
    port: 9000,
    host: '0.0.0.0'
  }
}

module.exports = config
```

As you can notice there are three presetes which let us use modern javascript. Let's start removing `stage-0` which let us use some nice feature not yet implemented in ES6. Naming conventions aka stage-0 can be confusing, @jayphelps explains them very well on [his article](https://medium.com/@jayphelps/please-stop-referring-to-proposed-javascript-features-as-es7-cad29f9dcc4b#.lh0j4t2cv).
Running `npm start` in our application give us some errors, let's see them one by one:

```
  13 | 
  14 |       return {
> 15 |         ...state,
     |         ^
  16 |         completed: !state.completed
  17 |       }
  18 |     default:
```    

Ok, looks like we cannot use anymore the spread-operator to easily build objects. What does it means? To have the same code we must use `Object.assign` instead, so the above code will be:


```js
return Object.assign(
  {},
  state,
  {completed: !state.completed}
)
```

It looks like this was the only place in the code where we used stage-0 features. Easy task. Other feature as `async/await` can have a larger impact after modification (i.e. to promises) but are not difficult.

## Goodbye nowdays javascript

It's time to prevent webpack to transpile ES6 code removing the preset from the configuration

```javascript
module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      include: __dirname,
      query: {
        cacheDirectory: true,
        presets: [/*'es2015', 'stage-0',*/ 'react']
      }
    }]
}
``` 

With es2015, we lost the possibility to import any dependency using `import`. This is the first problem we have to fix. Should be easy enough to replace all the import with a `require` for the moment. At the end, when we will remove webpack, even require will not be available anymore but for the moment let transform any line like this   
`import React from 'react'`    
into    
`const React = require('react')`

I used this regular expression `import\s+(.+)from\s+('.+')` and replaced with `const $1 = require($2)` to do the job. Even the export format has to change. We can rely on `module.exports` instead of `export default`. Here the variations could be a bit more complex but at the end should not be so hard.

Incredibly, just the require system has been a problem after removing es6 transpiler. No other feature was used. Features as `arrow functions` are already well supported from modern browsers. We don't have to worry. Of course, supporting some old browser can be more complicated and would need polyfills. We won't dive in that scenario for now. 

I noticed that all the react components were written as function. Just for test I tried to rewrite the App.js as a class, to see what happen. I changed the code from

```js
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
```
to
```js
class App extends React.Component {
  render () {
    return (<div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>)
  }
}
```

everything went fine. Using `classes` is fine.

So, after removing the support for es6 we lost the ability to require modules through `import`. In a more complex application I fear the migration wouldn't be so easy. You can find the code from this iteration [here]()


