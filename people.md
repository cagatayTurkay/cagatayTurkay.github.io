---
layout: default
title: People
permalink: /people/
---

## PhD supervision {#supervision}

I'm happy to talk to prospective PhD candidates interested in topics including, but not limited to:

- **Data visualisation** — understood as a method, an artefact and a practice: how visualisations can enable richer dialogues in applied practice and in society at large, and empirical work on the limits and capabilities of human reasoning and decision-making.
- **Human-centred AI and data science** — new computational methods and tools designed in dialogue with people, society and the more-than-human; how experts (data scientists, researchers, modellers) work with AI and data science methods; and how interactive methods and visualisation can transform these practices (visual data science, visual analytics).
- **The intersections of data, algorithms, people and society** — how data and algorithmic results are understood by individuals and publics, and new computational methods for "better" interactions, with "better" understood critically and broadly.

When you get in touch, please include a few details about your background (a CV is ideal) and a short note on the topics you'd like to research. Funding routes include [CIM's PhD programmes](https://warwick.ac.uk/fac/cross_fac/cim/apply-to-study/phd-programmes/) and the [DIVERSE CDT](https://warwick.ac.uk/fac/cross_fac/cim/apply-to-study/diverse-cdt/), which offers fully-funded data visualisation scholarships each year across City St George's and Warwick.

## Current and Past Postdocs and PhD students

I have been so lucky to work with a great group of PhD students and researchers. 

{% assign groups = "current:PhD students|postdocs:Researchers|alumni:Alumni" | split: "|" %}
{% for g in groups %}
{% assign parts = g | split: ":" %}
{% assign list = site.data.people[parts[0]] %}
{% if list and list.size > 0 %}
## {{ parts[1] }}

<ul class="people">
{% for person in list %}
  <li>
    {% if person.photo %}<img src="{{ person.photo | relative_url }}" alt="" width="64" height="64">{% else %}<span class="avatar" aria-hidden="true">{{ person.name | slice: 0 }}</span>{% endif %}
    <div>
      <div class="p-title">{% if person.url %}<a href="{{ person.url }}">{{ person.name }}</a>{% else %}{{ person.name }}{% endif %}</div>
      <div class="p-meta">{{ person.role }}{% if person.years %} · {{ person.years }}{% endif %}</div>
      {% if person.topic %}<div>{{ person.topic }}</div>{% endif %}
      {% if person.now %}<div class="p-meta">Now: {{ person.now }}</div>{% endif %}
    </div>
  </li>
{% endfor %}
</ul>
{% endif %}
{% endfor %}
