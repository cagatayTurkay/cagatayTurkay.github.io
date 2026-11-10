---
layout: default
title: About
hide_title: true
load_publications: true
---

<section class="intro">
  <img class="portrait" src="{{ site.author.photo | relative_url }}" alt="Portrait of {{ site.author.name }}" width="180" height="180">
  <div>
    <h1 class="name">{{ site.author.name }}</h1>
    <p class="role">{{ site.author.role }}<br>{{ site.author.affiliation }}</p>
    <p class="links">
      <a href="mailto:{{ site.author.email }}">Email</a>
      {% for l in site.links %}<a href="{{ l.url }}" target="_blank">{{ l.name }}</a>{% endfor %}
    </p>
  </div>
</section>

I work in human-computer and human-AI interaction, with a particular focus on **data visualisation**. I try to understand how people make decisions together with algorithms, investigate the role of interactive visual computing in this process, and design and build techniques and systems grounded in that understanding. More recently, I have been looking at how interactive visualisation and generative AI can be combined into systems that understand and adapt to their users — towards explainable and accountable decision-making wherever people work alongside algorithms.

I have been at Warwick's [Centre for Interdisciplinary Methodologies](https://warwick.ac.uk/fac/cross_fac/cim/) since 2019, as Associate Professor and, since 2022, Professor. Before that I was a Lecturer and Senior Lecturer in Computer Science at City, University of London (2014–2019), working with the [giCentre](http://www.gicentre.net/). I received my PhD in Visualisation from the [University of Bergen](https://vis.uib.no/) in 2014, was a visiting research fellow at Harvard University in 2013, and hold an MSc and BSc in Computer Science from Sabanci University and Middle East Technical University.

I am currently the Director for CIM (2025 - 2027) and I co-direct, and lead at Warwick, the EPSRC Centre for Doctoral Training in Diverse Data Visualisation ([DIVERSE CDT](https://diverse-cdt.ac.uk/)).

I received the EuroVis Young Researcher Award and was named a Eurographics Junior Fellow in 2019, and was a Turing Fellow at the [Alan Turing Institute](https://www.turing.ac.uk/) (2021–2024). 



<aside class="callout">
  <strong>PhD opportunities.</strong> Fully-funded data visualisation PhD scholarships are available through the DIVERSE CDT. <a href="{{ '/people/#supervision' | relative_url }}">See topics I supervise</a>.
</aside>

## News

<ul class="news">
{% for item in site.data.news limit: 6 %}
  <li><time datetime="{{ item.date }}">{{ item.date | date: "%b %Y" }}</time> <span>{{ item.text | markdownify | remove: '<p>' | remove: '</p>' }}</span></li>
{% endfor %}
</ul>

## Selected publications

<div class="publications" data-mode="selected">
  <p class="muted">Loading publications…</p>
</div>

<p><a href="{{ '/publications/' | relative_url }}">All publications →</a></p>
