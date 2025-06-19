'use client'
import Image from "next/image";
import Link from "next/link";
import { getScoreArrayAfterRoundThree } from "../Round3/page";
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
/*export function getScoreArrayAfterRoundTwo()
{
  return tournamentTab;
}*/

export default function Finish()
{
    console.log("coucou");
    tournamentTab = getScoreArrayAfterRoundThree();
    console.log(tournamentTab);
    return
    (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header>Système de MatchMaking</header>
            <main>
                <div>
                    <p>Ceci est la page de fin de tournoi, merci d'avoir participer</p>
                    <p>PS : Cette page est en construction</p>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
            Mon super pied de page
            </footer>
        </div>
    )
}