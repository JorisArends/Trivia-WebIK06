# Trivia quiz Webprogrammeren & Databases 2020

## Team IK06
* Joris Arends 12658650
* Maarten Blom 12877034
* Shilpa Kedar 12393053

## Samenvatting
Gebruikers kunnen hun naam invoeren en een categorie kiezen en daarna start de quiz. De vragen lopen op in moeilijkheid. Indien er een vraag fout is dan zal de quiz stoppen en wordt het aantal goede vragen en de tijd op het scorebord van de desbetreffende categorie gezet. Er zit een tijdslimiet per vraag aan verbonden. De tijd wordt als tiebreaker gebruikt.

## Applicatie screenshots

<img src="/doc/index.png" alt= "Index page"  style= "float: left; margin-right: 10px; width="200" /> <img src="/doc/quiz.png" alt= "Quiz page"  style= "float: left; margin-right: 10px; width="200" />


<!--![alt tekst](/doc/game_over.png "Quiz page") ![alt tekst](/doc/leaderboards.png "Leaderboards page")-->

## Features
### De gebruiker kan:
1. **een naam invullen;**
2. **vragen beantwoorden totdat een fout antwoord wordt gegeven;**
3. **de scoreborden per categorie bekijken;**
4. **Vragen komen uit een online database met goed gereviewde multiple-choice vragen;**
5. **De website moet er netjes uitzien en goed werken op kleine schermen (met name smartphones);**
7. Vragen lopen op in moeilijkheid;
    - De vragen nemen toe in moelijkeid (easy, medium en hard). De gebruiker ziet dit niet, maar de vragen worden wel lastiger, naarmate er meer correcte vragen worden gegeven.
8. Na een correcte vraag wordt de nieuwe vraag getoond zonder de pagina te refreshen;

De onderdelen die bij het minimum viable product horen zijn **dikgedrukt**.

## Repository
### Mapjes
* Doc
    * De schetsen en screenshots van de website
* Static
    * Images van de categorieën voor index.html
    * Quiz.js
        * Timer
        * Score
        * Quizvragen halen uit API
    * style.css
        * Stijl voor alle pagina's
* Templates
    * Alle html pagina's
* Application.py
    * Routes voor alle pagina's
* helpers.py
    * Categorieën id van API halen
    * DB execute functies

## Afhankelijkheden
### Databronnen
- Trivia database met categorieën: https://opentdb.com/;

### Externe componenten
- Bootstrap 4;
- Flask;
- SQL;
- JQuery.

### Concurrerende website
- https://www.sporcle.com/ (Redelijk onoverzichtelijk);
- https://www.triviaplaza.com/ (categorieindeling zoals wij die ook willen doen in grid vorm, niet voor mobiel);
- https://www.jetpunk.com/ (Groot aanbod aan quizzes).




