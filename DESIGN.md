# Technisch ontwerp

## Controllers
### application.py
Alle routes die onze applicatie nodig heeft komen hier in.
#### Routes
- Sessions bijhouden om dubbele namen in scoreboard te voorkomen bij 2e poging.
- Quiz; om de volgende vragen door te sturen naar het javascript op de Quizpagina [POST?, GET]
- Leaderboards; het leaderboard doorsturen naar de html pagina, nadat er een categorie is gekozen [POST, GET]
- Game Over; Score moet in de database komen, en als de persoon een vorige slechtere score heeft, moet die eruit. [POST, GET]



## Models/Helpers
### helpers.py
Hierin komen de technische hulpfuncties die voor de controller nodig zijn.
Zoals een functie;
- Om nieuwe quizvragen op te halen via de API, vragen format geven voor Quizpagina. [GET]
- Om het scoreboard bij een bepaalde categorie te krijgen uit de database. [GET]

## Views
### HTML Pages
- **Layout** (Voor de standaard layout en design)
- **Index** (Keuzemenu in een grid-vorm met de categorieën die men kan kiezen, zodra men kiest pop-up met username die mee wordt gestuurd naar Quiz)
- **Leaderboards** (Pagina waarin gebruiker categorie kan kiezen en het leaderboard word getoond)
- **Quiz** (De pagina waarop de quiz is gestart, bij foutief antwoord naar Game Over pagina, bij goed antwoord nieuwe vraag, timer die afloopt per vraag en timer die gespeelde tijd bijhoud)
- **Game Over** (Pagina met statistieken en een play again optie. Ook het scoreboard met de positie van de persoon die heeft gespeeld)
- **About** (Klein stukje text over project & studenten)

## Plugins en frameworks
- Bootstrap
- SQL
- Flask
- Jinja
- API *(https://opentdb.com/)*
