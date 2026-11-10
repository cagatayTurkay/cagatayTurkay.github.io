---
layout: default
title: Research
permalink: /research/
---

I work within the broad area of human-computer and human-AI interaction, with a specific interest in data visualisation. I am increasingly interested in how data- and model-intensive systems are used in everyday decision-making, and how interactive and visual methods can support people in those moments.

I have a special interest in problems where high-dimensional, spatio-temporal, heterogeneous and large datasets are used to answer questions with data. I take a human-centred approach throughout, which has given me the chance to work with researchers in biomedicine, bioinformatics, geography, social science, epidemiology and cyber security, among others.

<!-- Optional: add 3–4 themes with a short paragraph each and links to key papers.
### Theme title
One or two sentences. Key papers: [Paper](/publications/#key2024).
-->

## Current projects

<ul class="projects">
{% for p in site.data.projects %}{% if p.current %}
  <li>
    <div class="p-title">{% if p.url %}<a href="{{ p.url }}">{{ p.title }}</a>{% else %}{{ p.title }}{% endif %}</div>
    <div class="p-meta">{{ p.period }} · {{ p.funder }} · {{ p.role }}</div>
    {% if p.summary %}<p>{{ p.summary }}</p>{% endif %}
  </li>
{% endif %}{% endfor %}
</ul>

## Past projects

<ul class="projects">
{% for p in site.data.projects %}{% unless p.current %}
  <li>
    <div class="p-title">{% if p.url %}<a href="{{ p.url }}">{{ p.title }}</a>{% else %}{{ p.title }}{% endif %}</div>
    <div class="p-meta">{{ p.period }} · {{ p.funder }} · {{ p.role }}</div>
  </li>
{% endunless %}{% endfor %}
</ul>

## Service

I serve on the organising and programme committees of conferences including IEEE VIS, EuroVis, BioVis and EuroVA, on the editorial boards of *Computers & Graphics* and *Machine Learning and Knowledge Extraction*, and have been guest editor for *ACM TiiS* and *IEEE CG&A*.
