'use client'
import Image from "next/image";
import Link from "next/link";
import { getScoreArrayAfterRoundTwo, getActualNewRound } from "../Round2/page";
import { getMaxRound } from "../page";
import { useState } from "react";


let tabReadyToDisplay : any;
let tournamentTab : { id: number; name: string; Points: number; nbVictory: number, nbNul: number, nbLose: number, opponents: Array<string>}[] = [
  
];

let myRandomNumber: number;
let matchRoundThree: string[] = [];

let tabNamesWinner2Time:any;
let tabNamesWinner1TimeNul:any;
let tabNamesWinner1Time:any;
let tabNamesTwoNul:any;
let tabNamesOneNul:any;
let tabNamesLooser:any;

let save = false;

let nbMaxRound:number;
let actualRound:number;

export function getScoreArrayAfterRoundThree()
{
  return tournamentTab;
}

export default function Tournament()
{
    
    tournamentTab = getScoreArrayAfterRoundTwo();
    nbMaxRound = getMaxRound();
    actualRound = getActualNewRound() + 1;

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

    function PullRoundThree()
    {
        let winner2TimeTabFilter = tournamentTab.filter(function(score) {return score.Points == 6}); // 2 Victoire

        let winner1TimeNulTabFilter = tournamentTab.filter(function(score) {return score.Points == 4}); // 1 Victoire, 1 Nul

        let winner1TimeTabFilter = tournamentTab.filter(function(score) {return score.Points == 3}); // 1 Victoire, 1 Défaite

        let winnerTabFilter = tournamentTab.filter(function(score) {return score.Points == 2}); // 2 Nul

        let matchNulTabFilter = tournamentTab.filter(function(score) {return score.Points == 1}) // 1 Nul, 1 Défaite

        let looserTabFilter = tournamentTab.filter(function(score) {return score.Points == 0}); // 2 défaite

        tabNamesWinner2Time = winner2TimeTabFilter.map((element) => element.name);

        tabNamesWinner1TimeNul = winner1TimeNulTabFilter.map((element) => element.name);

        tabNamesWinner1Time = winner1TimeTabFilter.map((element) => element.name);

        tabNamesTwoNul = winnerTabFilter.map((element) => element.name);

        tabNamesOneNul = matchNulTabFilter.map((element) => element.name);

        tabNamesLooser = looserTabFilter.map((element) => element.name);

        //Penser a faire une condition pour ceux s'étant déjà rencontré lors des rounds précédentes
        let totalTwoWins = tabNamesWinner2Time.length;

        let totalOneWinsOneNul = totalTwoWins + tabNamesWinner1TimeNul.length;
        let totalOneWin = totalOneWinsOneNul + tabNamesWinner1Time.length;
        let totalTwoNul = totalOneWin + tabNamesTwoNul.length;
        let totalOneNul = tabNamesOneNul.length + totalTwoNul;
        let totalLooser = tabNamesLooser.length + totalOneNul;


        //On tire d'abord les matchs des gagnants
        for(let i = 0; i < totalTwoWins; i++)
        {
                myRandomNumber = getRandomInt(tabNamesWinner2Time.length);
                matchRoundThree[i] = tabNamesWinner2Time[myRandomNumber];
                tabNamesWinner2Time.splice(myRandomNumber, 1);
        }

        for(let i = totalTwoWins; i < totalOneWinsOneNul; i++)
        {
                myRandomNumber = getRandomInt(tabNamesWinner1TimeNul.length);
                matchRoundThree[i] = tabNamesWinner1TimeNul[myRandomNumber];
                tabNamesWinner1TimeNul.splice(myRandomNumber, 1);
        }

        for(let i = totalOneWinsOneNul; i < totalOneWin; i++)
        {
                myRandomNumber = getRandomInt(tabNamesWinner1Time.length);
                matchRoundThree[i] = tabNamesWinner1Time[myRandomNumber];
                tabNamesWinner1Time.splice(myRandomNumber, 1);
        }

        for(let i = totalOneWin; i < totalTwoNul; i++)
        {
                myRandomNumber = getRandomInt(tabNamesTwoNul.length);
                matchRoundThree[i] = tabNamesTwoNul[myRandomNumber];
                tabNamesTwoNul.splice(myRandomNumber, 1);
        }

        for(let i = totalTwoNul; i < totalOneNul; i++)
            {
                    myRandomNumber = getRandomInt(tabNamesOneNul.length);
                    matchRoundThree[i] = tabNamesOneNul[myRandomNumber];
                    tabNamesOneNul.splice(myRandomNumber, 1);
            }
    

        for(let i = totalOneNul; i < totalLooser; i++)
        {
            if(totalLooser%2 == 1 && i == totalLooser-1)
            {
                matchRoundThree[i+1] = "bye";
                myRandomNumber = getRandomInt(tabNamesLooser.length);
                matchRoundThree[i] = tabNamesLooser[myRandomNumber];
                tabNamesLooser.splice(myRandomNumber, 1);
            }
            else
            {
                myRandomNumber = getRandomInt(tabNamesLooser.length);
                matchRoundThree[i] = tabNamesLooser[myRandomNumber];
                tabNamesLooser.splice(myRandomNumber, 1);
            }
        }
    }


    PullRoundThree();

    function saveResult()
    {
        save = true;
        console.log("coucou, je fais une save");
        for(let i = 0; i < matchRoundThree.length; i+=2)
        {
            let checkName = "resultRound" + i;
            let resultMatch = document.getElementsByName(checkName);
            resultMatch.forEach(elem => {
                if(elem.id=="matchNul" && elem.checked)
                {
                    //On traite un match null
                    tournamentTab.map(element => {
                        if(element.name == matchRoundThree[i])
                        {
                            element.Points+=1;
                            element.nbNul+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                        if(element.name == matchRoundThree[i+1])
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
                        if(element.name == matchRoundThree[i])
                        {
                            element.Points+=3;
                            element.nbVictory+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                        if(element.name == matchRoundThree[i+1])
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
                        if(element.name == matchRoundThree[i+1])
                        {
                            element.Points+=3;
                            element.nbVictory+=1;
                            console.log(element);
                            elem.checked = false;
                        }
                        if(element.name == matchRoundThree[i])
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
        for(let i = 0; i < matchRoundThree.length; i+=2)
        {
            let nameButton = "resultRound" + i;
            tirage.push(<tr key={i}>
                        <td className="border-solid border-black border">{matchRoundThree[i]}</td>
                        <td className="border-solid border-black border flex flex-raw">
                                <input type="radio" id="victoireGauche" name={nameButton} /> <Image src="/trophee.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                                <input type="radio" id="matchNul" name={nameButton} /> <Image src="/egalite.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                                <input type="radio" id="victoireDroite" name={nameButton} /> <Image src="/trophee.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                            </td>
                        <td className="border-solid border-black border">{matchRoundThree[i+1]}</td>
                    </tr>);
            console.log(save);
            if(!save)
            {
                console.log("Je suis encore revenu");
                for(let j = 0; j < tournamentTab.length; j++)
                {
                    if(tournamentTab[j].name == matchRoundThree[i])
                    {
                        tournamentTab[j].opponents[2] = matchRoundThree[i+1];
                    }
                    else if(tournamentTab[j].name == matchRoundThree[i+1])
                    {
                        tournamentTab[j].opponents[2] = matchRoundThree[i];
                    }
                    console.log("tab général after round 2 : \n" + tournamentTab.map((element) => " Player : " + element.name + " adversaire : " + element.opponents + "\n "));
                }
            }
        }
        return tirage;
    }

    function checkNbRound()
    {
        if(actualRound = nbMaxRound)
        {
            return <Link href='./FinTournoi'>Finaliser le tournoi</Link>
        }
        else
        {
            return <Link href='./Round4'>Lancer le prochain round</Link>
        }
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
            <div>
                {checkNbRound()}
            </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                Mon super pied de page
            </footer>
        </div>
    )
    
}