---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
# use UnoCSS
css: unocss
---

# Marcelle

ELEMENT Workshop - October 21st, 2022

Jules Françoise, Baptiste Caramiaux

---

# Structure of the workshop

- 10h00: Introduction
- 10h15: Playing with a simple demo
- 10h30: Getting your hands dirty 🧑‍💻
- 11h15: Break
- 11h30: Introducing advanced features 🛠
- 12h30: Discussion in the context of participants' projects

---

# Marcelle - *what is it?*

<br />
<div style="font-size:30px">Toolkit for Composing Interactive Machine Learning Workflows and Interfaces </div>


---
layout: image-right
image: /image_code.png
---

# ML Programming

<!-- <img src="/image_code.png" width='650'>  -->
- **Monitoring**
  - *Tensorboard*
  - *ML flow*

- **Deployment**

<!-- <arrow x1="630" y1="300" x2="800" y2="220" color="#564" width="3" arrowSize="2" />
<arrow x1="630" y1="320" x2="800" y2="400" color="#564" width="3" arrowSize="2" /> -->

---
layout: image-right
image:
---

# Architecture Model


```js
input = webcam();

clf = BigDNNModel();

viz = datasetVisualizer();

```

---
layout: image-right
image: /architecture_model_img.png
---

# Architecture Model


```js
input = webcam();

clf = BigDNNModel();

viz = datasetVisualizer();

```

---
layout: image-right
image: /architecture_model_img.png
---

# Architecture Model


```js
input = webcam();

clf = BigDNNModel();

viz = datasetVisualizer();

```

<arrow x1="230" y1="115" x2="500" y2="80" color="#864" width="3" arrowSize="2" />
<arrow x1="230" y1="150" x2="500" y2="320" color="#864" width="3" arrowSize="2" />


---

# How to use it? https://marcelle.dev

<img src="/marcelle_website.png" width='750'>

---

# What else? Anything, it’s JavaScript

<img src="/teach_tok.png" width='750'>


---

# Demo

https://element-days-demo.netlify.app/

---
src: ./tuto-part1.md
---

---
src: ./tuto-part2.md
---

---
src: ./advanced.md
---
