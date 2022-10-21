---
layout: fact
---

# Advanced Notions

---

# Advanced Notions

- App Generator & CLI
- Data Storage and Synchronization
- Custom Components / Custom Applications
- Interating with Python

![Architecture](/marcelle-architecture.png)

---

# App Generator and CLI

https://marcelle.dev/cli.html

<br>

**Generating an app**

```sh
npm init marcelle my-marcelle-app
# or
yarn create marcelle my-marcelle-app
```

<br>

<v-click>

**Dev tools (CLI)**

Local to the project:

```sh
npx marcelle
```

Useful to (1) generate templates for custom components, and (2) manage the backend

</v-click>

---

# Data Stores

...

Up to now, data was stored in the browser's **localStorage**:

```js
const store = dataStore('localStorage');
```

=> Try opening your app with a different browser, or in a private window

<v-click>

<br><br>
<!-- Marcelle also provides a `@marcellejs/backend` package to store data on a web server...<br><br> -->
Let's try changing a line in file `src/data-storage.js`:
<br><br>

```js
export const store = dataStore('https://element-days-backend.herokuapp.com');
```

</v-click>

---

# @marcellejs/backend

Node.js server for Marcelle data storage and synchronization

- Easy setup with the CLI
- Autopilot mode in development (any service, any data type)
- Backed by either MongoDB or NeDb databases
  - NeDb: great for prototyping locally (based on the filesystem)
  - MongoDB: great for real applications
- Real-time updates
- Authentication
- ...

---

# Example

Generating a local backend for our app

From the command line:

```sh
npx marcelle
```

✔ What do you want to do? › Manage the backend<br>
✔ What do you want to do? › Setup a backend for the project<br>
✔ What kind of database do you want to use? › NeDB<br>
✔ Do you want to use authentication? … off / on

```sh
npm i
npm run backend
```

Change in file `src/data-storage.js`:

```js
export const store = dataStore('http://localhost:3030');
```

---

# Custom Components

https://marcelle.dev/guide/creating-components.html

Marcelle components are JS Objects
- that expose reactive streams to the outside world
- that have a `.mount()` method to display their *view* in the DOM
  - In Marcelle we use Svelte for views
  - But it is possible to use other or no frameworks

<v-click>

Check out online demos: https://demos.marcelle.dev/

</v-click>

---

# Custom Components

Taking advantage of Dev Tools

Generating component templates is easy with the CLI:

```sh
npx marcelle
```

✔ What do you want to do? › Create a component<br>
✔ What is the name of your component? … my awesome comp<br>
✔ What type of component to you want?<br>
  - Skeleton component with a Svelte UI [default]<br>
  - Simple Classifier (Tensorflow.js)<br>
  - Custom Model (Tensorflow.js)



---

# Custom Applications

<img src="/teach_tok.png" width='750'>

---

# Integration with Python

https://pypi.org/project/marcelle/

- Experimental package for interaction with Python
- Features
  - Monitor the training of Tensorflow/Keras Models
  - Converts TF/Keras model to TFJS for use in the browser
  - Access data from Marcelle Backend
  - Experimental support for

  <v-click>

  More to come... Stay tuned!

  </v-click>

