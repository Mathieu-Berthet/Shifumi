'use client'
import Image from "next/image";
import Link from "next/link";
import { getScoreArray, getMaxRound, getActualRound } from "../page";
import { useState } from "react";



let tabReadyToDisplay : any;
let tournamentTab : { id: number; name: string; Points: number; nbVictory: number, nbNul: number, nbLose: number, opponents: Array<string>}[] = [
  
];

let myRandomNumber: number;
let matchRoundOne: string[] = [];

let save = false;

let nbMaxRound:number;
let actualRound:number;


export function getScoreArrayAfterRoundOne()
{
  return tournamentTab;
}


export function getNewRound()
{
  return actualRound;
}

export default function Tournament()
{
    
    tournamentTab = getScoreArray();
    nbMaxRound = getMaxRound();
    actualRound = getActualRound() + 1;

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

    function PullRoundOne()
    {
        let tabNames = tournamentTab.map((element) => element.name);
        let total = tabNames.length;
        for(let i = 0; i < total; i++)
        {
            if(total%2 == 1 && i == total-1)
            {
                matchRoundOne[i+1] = "bye";
                myRandomNumber = getRandomInt(tabNames.length);
                matchRoundOne[i] = tabNames[myRandomNumber];
                tabNames.splice(myRandomNumber, 1);
            }
            else
            {
                myRandomNumber = getRandomInt(tabNames.length);
                matchRoundOne[i] = tabNames[myRandomNumber];
                tabNames.splice(myRandomNumber, 1);
            }
        }
    }

    PullRoundOne();

    function saveResult()
    {
        save = true;
        console.log(save);
        console.log("coucou, je fais une save");
        for(let i = 0; i < matchRoundOne.length; i+=2)
        {
            let checkName = "resultRound" + i;
            let resultMatch = document.getElementsByName(checkName);
            resultMatch.forEach(elem => {
                if(elem.id=="matchNul" && elem.checked)
                {
                    //On traite un match null
                    tournamentTab.map(element => {
                        if(element.name == matchRoundOne[i])
                        {
                            element.Points+=1;
                            element.nbNul+=1;
                            
                            elem.checked = false;
                            console.log(element);
                        }
                        if(element.name == matchRoundOne[i+1])
                        {
                            element.Points+=1;
                            element.nbNul+=1;
                            elem.checked = false;
                            console.log(element);
                        }
                    })
                }
                else if (elem.id =="victoireGauche" && elem.checked)
                {
                    //On traite la victoire du joueur gauche
                    tournamentTab.map(element => {
                        if(element.name == matchRoundOne[i])
                        {
                            element.Points+=3;
                            element.nbVictory+=1;
                            elem.checked = false;
                            console.log(element);
                        }
                        if(element.name == matchRoundOne[i+1])
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
                        if(element.name == matchRoundOne[i+1])
                        {
                            element.Points+=3;
                            element.nbVictory+=1;
                            elem.checked = false;
                            console.log(element);
                        }
                        if(element.name == matchRoundOne[i])
                        {
                            element.nbLose+=1;
                            console.log(element);
                        }
                    })
                }
                console.log(elem.checked);
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
        for(let i = 0; i < matchRoundOne.length; i+=2)
        {
            let nameButton = "resultRound" + i;
            tirage.push(<tr key={i}>
                        <td className="border-solid border-black border">{matchRoundOne[i]}</td>
                        <td className="border-solid border-black border flex flex-raw">
                                <input type="radio" id="victoireGauche" name={nameButton} /> <Image src="/trophee.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                                <input type="radio" id="matchNul" name={nameButton} /> <Image src="/egalite.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                                <input type="radio" id="victoireDroite" name={nameButton} /> <Image src="/trophee.png" alt="Logo du site de la Convserverie" width={50} height={50} priority />
                            </td>
                        <td className="border-solid border-black border">{matchRoundOne[i+1]}</td>
                    </tr>);
            console.log(save);
            if(!save)
            {
                console.log("Je suis revenu");
                for(let j = 0; j < tournamentTab.length; j++)
                {
                    if(tournamentTab[j].name == matchRoundOne[i])
                    {
                        tournamentTab[j].opponents[0] = matchRoundOne[i+1];
                    }
                    else if(tournamentTab[j].name == matchRoundOne[i+1])
                    {
                        tournamentTab[j].opponents[0] = matchRoundOne[i];
                    }
                    console.log("tab général : \n" + tournamentTab.map((element) => " Player : " + element.name + " adversaire : " + element.opponents + "\n "));
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
            <Link href='./Round2'>Lancer le prochain round</Link>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                Mon super pied de page
            </footer>
        </div>
    )
    
}