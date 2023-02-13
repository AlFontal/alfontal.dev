# alfontal.dev <img src="site/media/logo_alejandro.png" align="right" width="120" />
[![Netlify Status](https://api.netlify.com/api/v1/badges/ed83a5a9-9ce4-43dc-85b0-6c8779cc67a6/deploy-status)](https://app.netlify.com/sites/alfontal/deploys)


This is the repository with the source code for my personal website [alfontal.dev](https://alfontal.dev), built using Quarto.

I took the development of this site as a chance to improve my web development skills and tinker around with HTML/CSS and a tiny bit of JavaScript (and I've probably overdone it a bit).

A lot of inspiration from other Quarto websites was taken to make this site. Mainly:

+ [Mickael Canouil's personal website](https://mickael.canouil.fr/): I started from 
his SCSS and index files and worked from there.
+ I copied the `article.ejs` script to automatically list publications by [Jeffrey Girard](https://github.com/jmgirard/) in his [AffComLab website](https://affcom.ku.edu/) and 
slightly modified it to suit my needs.

The `main` branch contains the source code (mix of Markdown, Jupyter Notebooks, yaml and other scripts) and the `site-html` branch
contains the HTML which is processed via Quarto and GitHub Actions.

The `site-html` branch is then deployed to Netlify.

