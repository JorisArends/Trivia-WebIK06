# Trivia-WebIK06

# Projectvoorstel groep IK06
## Samenvatting
Gebruikers kunnen hun naam invoeren en een categorie kiezen en daarna start de quiz. De vragen lopen op in moeilijkheid. Het is ook mogelijk om alle categorieën te kiezen voor een extra uitdaging. Indien er een vraag fout is dan zal de quiz stoppen en wordt het aantal goede vragen en de tijd op het scorebord van de desbetreffende categorie gezet. Er zit een tijdslimiet per vraag aan verbonden. De tijd wordt als tiebreaker gebruikt.

## Prototype (22-01-2020)
Gebruiker kan een categorie kiezen en zijn naam invullen, deze worden meegestuurd naar de quizpagina, waarna de quizvragen worden opgehaald. Het is nog niet gelukt om de tijd bij te houden en de vragen in moeilijkheid op te laten lopen. Dit waren geen MVP's maar zouden we graag nog willen implementeren. Wel hebben we de categorieen kiezen en het tonen van een nieuwe vraag zonder refresh weten te implementeren. Ook de scoreboarden per categorie zijn werkend, en zodra iemand zijn score verbeterd dan wordt de oude entry in de database geupdate, hierdoor blijf het aantal dubbele namen beperkt. De shortcut optie voor een play again in dezelfde categorie moet nog worden gemaakt en de username popup form heeft nog wat kleine bugs, net als de klikbare antwoorden. 
![alt tekst](/doc/index.png "Index page")
![alt tekst](/doc/quiz.png "Quiz page")

## Schetsen

![alt tekst](/doc/WebsiteDesign.png "Schetsen")

## Features
### De gebruiker kan:
1. **een naam invullen;**
2. een van de categorieën kiezen;
3. **vragen beantwoorden totdat een fout antwoord wordt gegeven;**
4. **de scoreborden per categorie bekijken;**
5. meer informatie over de website lezen.

### Overig
1. Vragen lopen op in moeilijkheid;
2. **Vragen komen uit een online database met goed gereviewde multiple-choice vragen;**
3. **De website moet er netjes uitzien en goed werken op kleine schermen (met name smartphones);**
4. Na een correcte vraag wordt de nieuwe vraag getoond zonder de pagina te refreshen;
5. Er worden geluidseffecten of muziek afgespeeld tijdens het spel.

De onderdelen die bij het minimum viable product horen zijn **dikgedrukt**.

## Afhankelijkheden
### Databronnen
- Trivia database met categorieën: https://opentdb.com/;
- Categorieën gekozen met > 15 vragen:

### Externe componenten
- Bootstrap 4;
- Flask;
- SQLAlchemy;
- JQuery.

### Concurrerende website
- https://www.sporcle.com/ (Redelijk onoverzichtelijk);
- https://www.triviaplaza.com/ (categorieindeling zoals wij die ook willen doen in grid vorm, niet voor mobiel);
- https://www.jetpunk.com/ (Groot aanbod aan quizzes).

### Moeilijkste delen
- Timing;
- Oplopende moeilijkheid van vragen;
- Live updaten.



