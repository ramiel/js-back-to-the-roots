# Back to the roots of javascript

The way we develop javascript applications has radically changed during the last years. Javascript has become a widely used language and it broke the walls of the environment in which it was born, to be used at every level in software production, for the web and more.

In any case we do not write javascript as we were used to do. For example if we are going to write a React.js application, the first thing, even before writing a single js line, we configure webpack to transpile our ES6 code, to convert JSX in a language spoken by the broswer, to minify the code, to create a source map etc. Writing javascript means having a compilation phase.
This is well explained in the article [How it feels to learn JavaScript in 2016](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f) by @jjperezaguinaga
Despite I see the advantages and I appreciate the direction we took, I was always wondering how it would be to write application like in the '90. Would it be so scary to write an application just using an editor and a browser? Would the code be unreadable? Are there limits we cannot trespass without a transpiler?
This article is an answer to these questions...and a little time travel back in time.

## The project

The idea is to take some existing code and to reduce it to have some JS which works on every modern browser. It's an extrusion work. On every step I'm going to remove a functionality not supported directly by the browser and I'm going to adapt the code. At the end we will have a bunch of text files and a working application without regressions. I decided to take a simple project and then I chose an example "todo app" written in react/redux ([here](https://github.com/reactjs/redux/tree/4574a8c/examples/todos) the original code). I adapted it simplifing the build system to have more control.
The initial code is available on the github repository at [step-0](https://github.com/ramiel/js-back-to-the-roots/tree/step-0).
Ah, the application looks like this after webpack passage and served from a development server:

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

As you can notice there are three presets which let us use modern javascript. Let's start removing `stage-0` which let us use some nice feature not yet implemented in ES6. Naming conventions aka stage-0 can be confusing, @jayphelps explains them very well on [his article](https://medium.com/@jayphelps/please-stop-referring-to-proposed-javascript-features-as-es7-cad29f9dcc4b#.lh0j4t2cv).
Running `npm start` in our application give us some errors, let's see them one by one:

```bash
  13 | 
  14 |       return {
> 15 |         ...state,
     |         ^
  16 |         completed: !state.completed
  17 |       }
  18 |     default:
```

Ok, looks like we cannot use anymore the spread operator to easily build objects. What does it means? To obtain the same code with ES6 only javascript, we must use `Object.assign` instead, so the above code will be:


```js
return Object.assign(
  {},
  state,
  {completed: !state.completed}
)
```

It looks like this was the only place in the code where we were using stage-0 features. Easy task. Other feature as `async/await` can have a larger impact after modification (i.e. to promises) but are not so difficult to do.

The modified code can be found at [step-1](https://github.com/ramiel/js-back-to-the-roots/tree/step-1)

## Goodbye modern javascript

It's time to prevent webpack to transpile ES6 code removing the preset from the configuration

```js
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

With es2015, we lost the possibility to import any dependency using `import`. This is the first problem we have to fix. Should be easy enough to replace all the import with a `require` for the moment. At the end, when we will remove webpack, even require will not be available but for the moment let's transform any line like this   
`import React from 'react'`    
into    
`const React = require('react')`

I used this regular expression `import\s+(.+)from\s+('.+')` and replaced with `const $1 = require($2)` to do the job. Even the export format has to change. We can rely on `module.exports` instead of `export default`. Here the variations could be a bit more complex but at the end should not be so hard.

Incredibly, just the require system has been a problem after removing es6 transpiler. No other feature was used. Features as `arrow functions` are already well supported from modern browsers. We don't have to worry. Of course, supporting some old browser can be more complicated and would need polyfills. We won't dive in that scenario for now. 

I noticed that all the react components were written as function. Just for test, I tried to rewrite the App.js as a class, to see what happen. I changed the code from

```jsx
const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
```

to

```jsx
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

So, after removing the support for es6 we lost the ability to require modules through `import`. In a more complex application I fear the migration wouldn't be so easy. You can find the code from this iteration on [step-2](https://github.com/ramiel/js-back-to-the-roots/tree/step-2)

## The art of removing a react transpiler

React offers a great tool to interact with its virtual DOM, `JSX`. With JSX you can disguise javascript code as html-like elements.     
So you can write

```jsx
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

instead of

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

Let's see how difficult is to remove react support on our webpack configuration. As expected, webpack is complaining for not understanding JSX

```bash
   9 | 
  10 | render(
> 11 |   <Provider store={store}>
     |   ^
  12 |     <App />
  13 |   </Provider>,
  14 |   document.getElementById('root')
```

 We have to change all the JSX. For example this simple code

```jsx
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

became this

```js
const element = React.createElement(
  Provider,
  {store},
  React.createElement(App, null)
)
render(
  element,
  document.getElementById('root')
)
```

which is not complex. But can became a nightmare. To mitigate this task you can use [the online Babel compiler](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-0&code=function%20hello()%20%7B%0A%20%20return%20%3Cdiv%3EHello%20world!%3C%2Fdiv%3E%3B%0A%7D) which will translate for you any JSX into the relative clean JS code.
You cannot let the compiler do everything for you or you'll end with complex function like this

```js
React.createElement(
  'a',
  { href: '#',
    onClick: (function (_onClick) {
      function onClick (_x) {
        return _onClick.apply(this, arguments)
      }

      onClick.toString = function () {
        return _onClick.toString()
      }

      return onClick
    }(function (e) {
      e.preventDefault()
      onClick()
    }))
  },
  children
)
```

which can be written

```js
React.createElement(
  'a',
  { href: '#',
    onClick: e => {
      e.preventDefault()
      onClick()
    }
  },
  children
)
```

Maybe it's easier to write code from scratch than adapting existing JSX code. It's hard in any case. On the opposite, maybe this will enforce you to write simpler components and to separate more, in order to have cleaner code.

You can find the new code on [step-3](https://github.com/ramiel/js-back-to-the-roots/tree/step-3)

## Thank you babel, I'll include modules by myself

We are almost up. We just need to remove babel (and then webpack, which became useless). Removing babel and its loaders means we cannot use anymore require to include code and manage dependencies. We'll need to include all the external libraries through `script` tags and the same for all of our scripts.
Ok, let's remove `webpack.config.js` and `package.json`. We won't need them anymore.
We need to include our script directly in the html page (like at my grandma's times) but we have no bundle anymore. Let's include index.js and let see what happens. I moved it under `public/js` folder, just to follow an ancient convention ;)

`<script type="text/javascript" src="js/index.js"></script>`

I will continue to serve the page through a web server to avoid browser complaining. For this I'll use `http-server`, a static file server written in node. You can use nginx or what you prefer.

```bash
npm install http-server -g
http-server public
```

If you open your devtools you'll notice that the browser is complaining about the `require` function which is not defined in the environment. As we said, we need to import our libraries differently.

Our project depends on a bunch of libraries:
- react
- react-dom
- redux
- react-redux

we can download them and include in our project but we're lucky enough and all are served by a [CDN](https://cdnjs.com/libraries/react/#).

So now this is our index.html

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.6.0/redux.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/4.4.5/react-redux.min.js"></script>
```

and this the index.js

```js
const React = window.React
const { render } = window.ReactDOM
const { createStore } = window.Redux
const { Provider } = window.ReactRedux
...
```

We need to include our javascript files too. The first required is App.js. Here the boring work of transforming all the require as we did in `index.js` and to include the file as a script in the html page. I already miss webpack which did all of this job for me. Another thing you should do is to wrap every module in an autocalling function. This is, for example, `App.js` after the restiling.

```js
;(function (window) {
  const React = window.React
  const Footer = window.Footer
  const AddTodo = window.AddTodo
  const VisibleTodoList = window.VisibleTodoList

  class App extends React.Component {
    render () {
      return React.createElement(
            'div',
            null,
            React.createElement(AddTodo, null),
            React.createElement(VisibleTodoList, null),
            React.createElement(Footer, null)
        )
    }
    }

  window.App = App
})(window)
```

Here the inclusion order is important. At the end of the operation this is my body

```html
<body>
    <div id="root"></div>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.6.0/redux.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/4.4.5/react-redux.js"></script>

    <script type="text/javascript" src="js/actions/index.js"></script>
    <script type="text/javascript" src="js/components/Link.js"></script>
    <script type="text/javascript" src="js/containers/FilterLink.js"></script>
    <script type="text/javascript" src="js/components/Footer.js"></script>
    <script type="text/javascript" src="js/containers/AddTodo.js"></script>
    <script type="text/javascript" src="js/components/Todo.js"></script>
    <script type="text/javascript" src="js/components/TodoList.js"></script>
    <script type="text/javascript" src="js/containers/VisibleTodoList.js"></script>
    <script type="text/javascript" src="js/reducers/todos.js"></script>
    <script type="text/javascript" src="js/reducers/visibilityFilter.js"></script>
    <script type="text/javascript" src="js/reducers/index.js"></script>

    <script type="text/javascript" src="js/components/App.js"></script>
    <script type="text/javascript" src="js/index.js"></script>
</body>
```
scary eh?!

Give a look at the complete code on [step-4](https://github.com/ramiel/js-back-to-the-roots/tree/step-4)

What you loose here is the ability to handle namespace collision. Is up to you to be sure no module collides, on declaring a name, with another.

## Conclusion

It has been a long trip. I'm happy, at the end I've been able to re-write the todo application as in the '90! It's a bit strange, especially to see all the list of scripts inclusion. Luckily we don't have to do it anymore! It would be amazing if the browsers could [handle this natively](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)!
Probably, coding this way, force us to put more code in the same file. Maybe a single file to handle the entire application. On the opposite, having the modularity part of javascript, let us write more ordered code, to think more schematically and to better organize our ideas.
Another thing which appears clear (and believe me, is not evident), is that, if we end up with those strange build system, there is a reason. It's the result of a need.
What looks less true instead, is the belief that we need a transpiler to play with all the modern javascript: it's not true, modern browsers can handle the majority of the code. The inclusion of the stage-0 module then, looks a bit overestimated. Probably we can remain with ES6 code without loosing so much expressivity without ES7. If you need to support (not too) old browsers, you cannot avoid to use babel to transpile your code. For example it is absolute mandatory in order to support IE11. Remember, this article don't want to demonstrate that webpack/babel are useless because, at the end, they are your best friends in the jungle that the browser's javascript implementation has always been.



*Many thanks to Jozsef for helping me to write this little story*
