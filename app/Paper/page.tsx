'use client' // Check this link to understand how it's ok : https://nextjs.org/docs/app/api-reference/directives/use-client
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import { text } from "stream/consumers";

let playTab = ["Ciseau", "Pierre", "Feuille"]; // Pour les autres mods, un autre tableau à chaque fois, différents, pour l'ordi

let ordiTab = ["Ciseau", "Pierre", "Feuille", "Feuille", "Feuille", "Feuille", "Feuille", "Feuille", "Feuille", "Feuille"];

let nbVictory:any = 0;
let nbNul:any = 0;
let nbLose:any = 0;

let id:number = 0;
let tabResult:{id:number, choixPlayer:string, choixOrdi:string, resultat:string}[] = [];

/*let textNbVictoire = "Nombre de Victoire = " + nbVictory;
let textNbNul = "Nombre de Nul = " + nbNul;
let textNbLose = "Nombre de Défaite = " + nbLose;*/

let choixPlayer: any;
let choixOrdi;

let stringResult:string;

export default function Home() {

  let [stat, changeStat] = useState(false);
  let [history, displayHistory] = useState(false);

  let textButtonHistory = "Afficher l'historique"


  if(history)
  {
    document.getElementById("historique")?.classList.remove("hidden");

    textButtonHistory = "Cacher l'historique";
  }
  else
  {
    document.getElementById("historique")?.classList.add("hidden");
    textButtonHistory = "Afficher l'historique";
  }

  //On tire un nombre aléatoire pour l'ordinateur
  function getRandomInt(max: number)
  {
      return Math.floor(Math.random()*max);
  }

  function getChoicePlayer(formData : any)
  {
    document.getElementById("pasBon")?.classList.add("hidden");
    //On récupère le choix du joueur
    formData.forEach((element: string | null) => {
      if(element != null && (element == "0" || element == "1" || element == "2"))
      {
        choixPlayer = element
      }
      else
      {
        document.getElementById("pasBon")?.classList.remove("hidden");
      }
    });
  }

  function checkResult(playerChoice: number, ordiChoice: number)
  {
    switch(playTab[playerChoice])
    {
      case "Ciseau":
        switch(ordiTab[ordiChoice])
        {
          case "Ciseau": 
          {
            document.getElementById("victory")?.classList.add("hidden");
            document.getElementById("nul")?.classList.remove("hidden");
            document.getElementById("lose")?.classList.add("hidden");
            nbNul += 1;
            stringResult = " Match Nul ";
            break;
          }
          case "Pierre": 
          {
            document.getElementById("victory")?.classList.add("hidden");
            document.getElementById("nul")?.classList.add("hidden");
            document.getElementById("lose")?.classList.remove("hidden");
            nbLose+=1;
            stringResult = " Ordi a gagné ";
            break;
          }
          case "Feuille": 
          {
            document.getElementById("victory")?.classList.remove("hidden");
            document.getElementById("nul")?.classList.add("hidden");
            document.getElementById("lose")?.classList.add("hidden");
            nbVictory+=1;
            stringResult = " Vous avez gagné ";
            break;
          }
          default:
            break;
        }
        break;
      case "Pierre":
        switch(ordiTab[ordiChoice])
        {
          case "Ciseau": 
          {
            document.getElementById("victory")?.classList.remove("hidden");
            document.getElementById("nul")?.classList.add("hidden");
            document.getElementById("lose")?.classList.add("hidden");
            nbVictory+=1;
            stringResult = " Vous avez gagné ";
            break;
          }
          case "Pierre": 
          {
            document.getElementById("victory")?.classList.add("hidden");
            document.getElementById("nul")?.classList.remove("hidden");
            document.getElementById("lose")?.classList.add("hidden");
            nbNul+=1;
            stringResult = " Match Nul ";
            break;
          }
          case "Feuille": 
          {
            document.getElementById("victory")?.classList.add("hidden");
            document.getElementById("nul")?.classList.add("hidden");
            document.getElementById("lose")?.classList.remove("hidden");
            nbLose+=1;
            stringResult = " Ordi a gagné ";
            break;
          }
          default:
            break;
        }
        break;
      case "Feuille":
        switch(ordiTab[ordiChoice])
        {
          case "Ciseau": 
          {
            document.getElementById("victory")?.classList.add("hidden");
            document.getElementById("nul")?.classList.add("hidden");
            document.getElementById("lose")?.classList.remove("hidden");
            nbLose+=1;
            stringResult = " Ordi a gagné ";
            break;
          }
          case "Pierre": 
          {
            document.getElementById("victory")?.classList.remove("hidden");
            document.getElementById("nul")?.classList.add("hidden");
            document.getElementById("lose")?.classList.add("hidden");
            nbVictory+=1;
            stringResult = " Vous avez gagné ";
            break;
          }
          case "Feuille": 
          {
            document.getElementById("victory")?.classList.add("hidden");
            document.getElementById("nul")?.classList.remove("hidden");
            document.getElementById("lose")?.classList.add("hidden");
            nbNul+=1;
            stringResult = " Match Nul ";
            break;
          }
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  function saveResult(playerChoice:number, ordiChoice:number)
  {
    tabResult[id] = {id: id, choixPlayer: playTab[playerChoice], choixOrdi: ordiTab[ordiChoice], resultat: stringResult};
    id++;
  }

  function resetHistory()
  {
    tabResult = [];
  }

  function displayResult(formData : any)
  {
    //On récupère le choix du joueur
    getChoicePlayer(formData);

    //On récupère le choix de l'ordinateur
    choixOrdi = getRandomInt(ordiTab.length);

    // On compare les résultats du joueur et de l'Ordi
    checkResult(choixPlayer, choixOrdi);

    // On enregistre dans l'historique
    saveResult(choixPlayer, choixOrdi);
  }

  let tabDisplay = tabResult.map((element:any) => <tr key={element.id}><td className="border-solid border-black border">{element.choixPlayer}</td><td className="border-solid border-black border">{element.choixOrdi}</td><td className="border-solid border-black border">{element.resultat}</td></tr>);

  //let playerName = myTab.map((elem) => <tr key={elem.id}><td key={elem.id}>{elem.name}</td></tr>);
  return (
    
    <div className="flex flex-col items-center justify-items-center pt-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      
      
      <header className="w-full">
        <h1 className="flex flex-col items-center text-4xl font-bold">Shi Fu Mi</h1>
      {/* <div className="flex flex-raw">
        <div className="mr-64">
          <Image  src="/truc6.jpg" alt="Logo du site de la Convserverie" width={234} height={224} priority />
        </div>
        <div className="ml-64">
          <Image  src="/truc2.jpg" alt="Logo du site de la Convserverie" width={234} height={224} priority />
        </div>
      </div> */}
        <nav className="flex flex-row w-full justify-center mt-2">
          <Link href='./Rock' className="flex border-solid border-black border w-1/3 justify-center underline">Autre version de l'IA 1</Link>
          <Link href='./' className="flex border-solid border-black border w-1/3 justify-center underline">Version de Base</Link>
          <Link href='./Scissors' className="flex border-solid border-black border w-1/3 justify-center underline">Autre version de l'IA 3</Link>
        </nav>
      </header>
      
      <main className="flex flex-col gap-8 items-center">
        <div className="flex flex-row">
          <div className="flex flex-col mr-64">
            <h2 className="text-2xl font-medium">Jouez à Pierre-Feuille-Ciseau </h2>
            <p>Veuillez choisir un numéro entre 0, 1 ou 2</p>
            <p> 0 = Ciseau</p>
            <p> 1 = Pierre</p>
            <p> 2 = Feuille</p>
            <form action={displayResult}>
              <div className="flex flex-col">
                <input id="0" name="player1" type="textarea" placeholder="Choisissez un nombre entre 0 et 2" className="border-solid border-black border m-2"></input>
              </div>
              <button type="submit" className="bg-green-400 rounded-2xl mb-4">Shifumi</button>
            </form>


            <p id="victory" className="hidden">Vous avez gagné</p>
            <p id="nul" className="hidden">Vous avez fait match nul</p>
            <p id="lose" className="hidden">Vous avez perdu</p>
            <p id="pasBon" className="text-red-500 hidden">Ce n'est pas le bon numéro</p>
          </div>
          <div className="border-solid border-black border"></div>
          <div className="ml-64">
            <h2 className="text-2xl font-medium"> Résultats et Statistiques </h2>
            

            <p>Nombre de victoire =  {nbVictory}</p>
            <p id="truc">Nombre de match nul = {nbNul}</p>
            <p>Nombre de défaite = {nbLose}</p>

            <button className="bg-green-400 rounded-2xl" id="actualiseResult" onClick={() =>changeStat(!stat)}>Actualiser les statistiques</button>
          </div>

          
        </div>
        <div className="w-full border-solid border-black border-2"></div>
        <div>
            <h2 className="text-2xl font-medium mb-8">Historique</h2>
            <button className="bg-green-400 rounded-2xl mb-4 mr-4" onClick={() =>displayHistory(!history)}>{textButtonHistory}</button>

            <button className="bg-red-400 rounded-2xl mb-4" onClick={() =>resetHistory()}>Reset Historique</button>
            <table id="historique" className="hidden">
              <thead>
                <tr>
                  <th className="border-solid border-black border">Choix du joueur</th>
                  <th className="border-solid border-black border">Choix de l'ordi</th>
                  <th className="border-solid border-black border">Résultat du match</th>
                </tr>
              </thead>
              <tbody>
                {tabDisplay}
              </tbody>
            </table>
          </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Mon super pied de page
      </footer>
    </div>
  );
}

//href="./tournament" 
//className="text-green-500"

