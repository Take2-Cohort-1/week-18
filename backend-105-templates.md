---
theme: ../../take2-theme
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Backend 105
  Templates
drawings:
  persist: false
title: Backend 105
---
layout: center
---

# Backend 105

---

## Views

- "Viewing" the data
- Express app outputs HTML for a browser

```html {*|3-6}{lines: true}
<h1>Todo App</h1>
<h2>Todos</h2>
<ul>
  <li>First Todo</li>
  <li>Second Todo</li>
</ul>
```

---

## View Templates

- _template:_ something that is used as a pattern for producing other similar things
- Don't want to put all the HTML into ``res.send(`<h1>Todo App...`)``
- Create a HTML file on disk instead and have express use it: `views/todos.html`?
- Use a _template engine_ to _render_ templates
```js
app.get('/', (req, res) => {
    res.render('todos');
}
```

---

## View Template Syntax

- Templates have their own syntax, to e.g. use variables inside the template

```js
const todos = [
  { title: 'First Todo' }, { title: 'Second Todo' }
];
```

<div class="flex justify-center items-center gap-4">

<div>

`index.html.handlebars`
```hbs
<ul>
  {{#each todos}}
    <li>{{ this.title }}</li>
  {{/each}}
</ul>
```
</div>
<div>
  &rarr;
</div>
<div>
Output:
```html
<ul>
  <li>First Todo</li>
  <li>Second Todo</li>
</ul>
```
</div>
</div>

---

## Template Engines / Handlebars

- Who defines the template syntax?
- Who provides the `render` method in this code:
  ```js
  app.get('/', (req, res) => {
      res.render('todos');
  }
  ```
<v-click>

</v-click>

---

## Composition: Layout & Partial

- Don't want to repeat ourselves, the outermost elements (`<html>`) never change
- Use a **layout**

`layout.handlebars`
```hbs
<html>
  <head> <title>Todos</title> </head>
  <h1>Todo App</h1>
  <body>
    {{{ body }}}
  </body>
</html>
```

---

- Use **layouts** with **partials**
- Layouts are the outside HTML that doesn't change much
- Partials are _partial pages_
- Example how they work together on the next page

---

- In `index.js`:
  ```js
  app.get('/', (req, res) => {
    // Will use `views/todos` + layout
    res.render('todos', { layout: 'app' });
  }
  ```

- In `views/layouts/app.handlebars`:

  ```hbs
  {{{ body }}}
  ```

- In `views/todos.handlebars`:

  ```hbs
  {{{ > todos/todo }}}
  ```

---

## Helpers

> Helper functions, or "helpers" are functions that can be registered with
> Handlebars and can be called within a template

- `#each`
- Conversions: turning `0.23` into `23%` or `4.5` into `NZD 4.50`
- Translations: using the same template for multiple languages (**I18n**)

---

## Reading

- https://handlebarsjs.com/guide
- https://github.com/express-handlebars/express-handlebars

## Todo

- Extend your express todos app to use the `express-handlebars` middleware and:
  - render out a list of todos using templates
  - render a form to add a new todo

- Do not use `fetch`
