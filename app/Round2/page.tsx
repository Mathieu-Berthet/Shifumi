'use client'
import Image from "next/image";
import Link from "next/link";
import { getScoreArrayAfterRoundOne, getNewRound } from "../tournament/page";
import { getMaxRound } from "../page";

import { useState } from "react";

let tabReadyToDisplay : any;
let tournamentTab : { id: number; name: string; Points: number; nbVictory: number, nbNul: number, nbLose: number, opponents: Array<string>}[] = [
  
];

let myRandomNumber: number;
let matchRoundTwo: string[] = [];

let tabNamesWinner:any;
let tabNamesMatchNul:any;
let tabNamesLooser:any;

let save = false;

let nbMaxRound:number;
let actualRound:number;

export function getScoreArrayAfterRoundTwo()
{
  return tournamentTab;
}


export function getActualNewRound()
{
  return actualRound;
}

export default function Tournament()
{
    
    tournamentTab = getScoreArrayAfterRoundOne();
    nbMaxRound = getMaxRound();
    actualRound = getNewRound() + 1;

    let [classment, ShowClassement] = useState(true);
    let [tri, setTri] = useState(false);

    let textToDisplay:string = "Montrer les rounds";

    if(classment)
    {
        document.getElementById("classement")?.classList.add("block");
        document.getElementById("classement")?.classList.remove("hidden");

        document.getElementById("round")?.classList.add("hidden");
        document.getElementById("round")?.classList.remove("block");

        textToDisplay = "Montrer les rounds";
    }
    else
    {
        document.getElementById("classement")?.classList.remove("block");
        document.getElementById("classement")?.classList.add("hidden");

        document.getElementById("round")?.classList.remove("hidden");
        document.getElementById("round")?.classList.add("block");

        textToDisplay = "Afficher le classement";
    }

    function getRandomInt(max: number)
    {
        return Math.floor(Math.random()*max);
    }

    function PullRoundTwo()
    {
        //Pb dans le filtrage ? Le filtrage ne se fait pas ?? //TODO : Corriger
        let winnerTabFilter = tournamentTab.filter(function(score) {return score.Points == 3});

        let matchNulTabFilter = tournamentTab.filter(function(score) {return score.Points == 1})

        let looserTabFilter = tournamentTab.filter(function(score) {return score.Points == 0});

        tabNamesWinner = winnerTabFilter.map((element) => element.name);

        tabNamesMatchNul = matchNulTabFilter.map((element) => element.name);

        tabNamesLooser = looserTabFilter.map((element) => element.name);

        //Séparer en 2 tableau, ceux à 3 points, ceux à 0
        //Que faire des matchs nuls ? --> Tableau intermédiaire
        // Si nombre impair sur les 2 tableaux, faire correspondre les 2 restants
        // Beaucoup de tableau sur les prochains round (ceux à 9, ceux à 6, ceux à 3 etc ...) ? 


        //Penser a faire une condition pour ceux s'étant déjà rencontré lors des rounds précédentes
        let totalWinner = tabNamesWinner.length;
        let totalMatchNul = tabNamesMatchNul.length + totalWinner;
        let totalLooser = tabNamesLooser.length + totalMatchNul;


        //On tire d'abord les matchs des gagnants
        for(let i = 0; i < totalWinner; i++)
        {
                myRandomNumber = getRandomInt(tabNamesWinner.length);
                matchRoundTwo[i] = tabNamesWinner[myRandomNumber];
                tabNamesWinner.splice(myRandomNumber, 1);
        }

        for(let i = totalWinner; i < totalMatchNul; i++)
            {
                    myRandomNumber = getRandomInt(tabNamesMatchNul.length);
                    matchRoundTwo[i] = tabNamesMatchNul[myRandomNumber];
                    tabNamesMatchNul.splice(myRandomNumber, 1);
            }
    

        for(let i = totalMatchNul; i < totalLooser; i++)
        {
            if(totalLooser%2 == 1 && i == totalLooser-1)
            {
                matchRoundTwo[i+1] = "bye";
                myRandomNumber = getRandomInt(tabNamesLooser.length);
                matchRoundTwo[i] = tabNamesLooser[myRandomNumber];
                tabNamesLooser.splice(myRandomNumber, 1);
            }
            else
            {
                myRandomNumber = getRandomInt(tabNamesLooser.length);
                matchRoundTwo[i] = tabNamesLooser[myRandomNumber];
                tabNamesLooser.splice(myRandomNumber, 1);
            }
        }
    }

    PullRoundTwo();

    function saveResult()
    {
        save = true;
        console.log("coucou, je fais une save");
        for(let i = 0; i < matchRoundTwo.length; i+=2)
        {
            let checkName = "resultRound" + i;
            let resultMatch = document.getElementsByName(checkName);
            resultMatch.forEach(elem => {
                if(elem.id=="matchNul" && elem.checked)
                {
                    //On traite un match null
                    tournamentTab.map(element => {
                        if(element.name == matchRoundTwo[i])
                        {
                            element.Points+=1;
                            element.nbNul+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                        if(element.name == matchRoundTwo[i+1])
                        {
                            element.Points+=1;
                            element.nbNul+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                    })
                }
                else if (elem.id =="victoireGauche" && elem.checked)
                {
                    //On traite la victoire du joueur gauche
                    tournamentTab.map(element => {
                        if(element.name == matchRoundTwo[i])
                        {
                            element.Points+=3;
                            element.nbVictory+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                        if(element.name == matchRoundTwo[i+1])
                        {
                            element.nbLose+=1;
                            console.log(element);
                        }
                    })
                }
                else if (elem.id =="victoireDroite" && elem.checked)
                {
                    //On traite la victoire du joueur droite
                    tournamentTab.map(element => {
                        if(element.name == matchRoundTwo[i+1])
                        {
                            element.Points+=3;
                            element.nbVictory+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                        if(element.name == matchRoundTwo[i])
                        {
                            element.nbLose+=1;
                            console.log(element);
                        }
                    })
                }
            });
        }
        setTri(true);
    }

    if(tri)
    {
        console.log("on entre ici");
        /* tournamentTab =  */tournamentTab.sort((a, b) => {return b.Points - a.Points});
        setTri(false);
    }

    tabReadyToDisplay = tournamentTab.map((elem : any) => <tr key={elem.id}><td className="border-solid border-black border">{elem.name}</td><td className="border-solid border-black border">{elem.Points}</td><td className="border-solid border-black border">{elem.nbVictory}</td><td className="border-solid border-black border">{elem.nbNul}</td><td className="border-solid border-black border">{elem.nbLose}</td></tr>)
    
    function displayTab()
    {
        let tirage = [];
        for(let i = 0; i < matchRoundTwo.length; i+=2)
        {
            let nameButton = "resultRound" + i;
            tirage.push(<tr key={i}>
                        <td className="border-solid border-black border">{matchRoundTwo[i]}</td>
                        <td className="border-solid border-black border flex flex-raw">
                                <input type="radio" id="victoireGauche" name={nameButton} /> <Image src="/trophee.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                                <input type="radio" id="matchNul" name={nameButton} /> <Image src="/egalite.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                                <input type="radio" id="victoireDroite" name={nameButton} /> <Image src="/trophee.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                            </td>
                        <td className="border-solid border-black border">{matchRoundTwo[i+1]}</td>
                    </tr>);
            console.log(save);
            if(!save)
            {
                console.log("Je suis encore revenu");
                for(let j = 0; j < tournamentTab.length; j++)
                {
                    if(tournamentTab[j].name == matchRoundTwo[i])
                    {
                        tournamentTab[j].opponents[1] = matchRoundTwo[i+1];
                    }
                    else if(tournamentTab[j].name == matchRoundTwo[i+1])
                    {
                        tournamentTab[j].opponents[1] = matchRoundTwo[i];
                    }
                    console.log("tab général after round 2 : \n" + tournamentTab.map((element) => " Player : " + element.name + " adversaire : " + element.opponents + "\n "));
                }
            }
        }
        return tirage;
    }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header>Système de MatchMaking</header>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <div className="flex flex-raw">
                <div id="classement"className="flex flex-col p-8 items-center">
                    <table> 
                        <thead>
                            <tr>
                            <th className="border-solid border-black border">Nom des joueurs</th>
                            <th className="border-solid border-black border">Points</th>
                            <th className="border-solid border-black border">Nombre de Victoire</th>
                            <th className="border-solid border-black border">Nombre de Match Nul</th>
                            <th className="border-solid border-black border">Nombre de défaites</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabReadyToDisplay}
                        </tbody>
                    </table>
                </div>

                <div id="round" className="hidden ">
                    <table> 
                        <thead>
                            <tr>
                            <th className="border-solid border-black border">Colonne de gauche</th>
                            <th className="border-solid border-black border">Résultats</th>
                            <th className="border-solid border-black border">Colonne de droite</th>
                            </tr>
                        </thead>
                        <tbody id="corps">
                            {displayTab()}
                        </tbody>
                    </table>
                </div>
            </div>
            <button id="saveResult" onClick={() => saveResult()}>Valider les résultats </button>
            <br />
            <button id="changeTabDisplay" onClick={() => ShowClassement(!classment)}>{textToDisplay}</button>
            <br />
            <br />
            <Link href='./Round3'>Lancer le prochain round</Link>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                Mon super pied de page
            </footer>
        </div>
    )
    
}





/******
 * 
 * 
 * 
 * 
 * /*tabNamesLooser = tournamentTab.map((element) => {
            console.log(element);
            if(element.Points == 0)
            {
                element.name;
                console.log(tabNamesLooser);
            }
        })
 * 
 * 
 * 
 * 
 * //////// Pour les TB plus tard
 * Dans un tableau de classement d'un tournoi de cartes (par exemple Magic: The Gathering, Yu-Gi-Oh!, Pokémon, etc.), les mentions TB1, TB2, TB3, etc., désignent souvent les critères de départage utilisés pour départager les joueurs ayant le même score ou le même nombre de victoires. Voici ce que ces termes signifient généralement :

1. TB1 (Tie-Breaker 1) :

C'est le premier critère de départage, souvent le pourcentage de victoires (ou Win Percentage).

Cela prend en compte le ratio de victoires du joueur par rapport au nombre total de parties jouées. Plus un joueur a remporté de parties, plus son TB1 sera élevé.


2. TB2 (Tie-Breaker 2) :

Le deuxième critère de départage est souvent le Strength of Schedule (SoS) ou Pourcentage de victoires des adversaires.

Ce critère évalue la difficulté des adversaires affrontés. Si un joueur a affronté des adversaires qui ont eux-mêmes un taux de victoires élevé, son TB2 sera meilleur. Cela vise à récompenser les joueurs ayant joué contre des adversaires plus forts.


3. TB3 (Tie-Breaker 3) :

Ce critère peut correspondre au Pourcentage de victoires des adversaires des adversaires (ou une autre mesure de la solidité du champ global).

C'est une couche supplémentaire pour départager les joueurs de manière encore plus fine.


Exemple d'application :

Si deux joueurs ont le même score global, le classement final les départagera en examinant :

1. Leur TB1 (leur pourcentage de victoires).


2. Si TB1 est également identique, on passe à TB2 (la difficulté de leurs adversaires).


3. Si TB2 est encore identique, on utilise TB3, et ainsi de suite.



Ces critères permettent de départager les joueurs de manière objective et cohérente, surtout dans des tournois où tous les participants n'ont pas affronté les
 * 
 * 
 */