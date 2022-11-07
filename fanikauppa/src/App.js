import './App.css';
import {Tuotteet, Ostoskori,Lomake,Receipt} from './components/Ostokset'
import {React, useState} from 'react';
import {tuotteet} from './data/TuoteData'



function App() {
  const [tuotelista, lisaatuote] = useState(tuotteet)
  const [lomake, naytalomake] = useState(false)
  const [receipt, showreceipt] = useState(false)
  const [ostoskorituote, piilotaostoskorituote] = useState(true)
  const [customer, setCustomer] = useState({nimi:"",email:"",puh:"",KT:"",PN:"",PT:""})

  return (
    <div className="App">
      <header className="App-header">
        Mitjan Projekti Fanikauppa
      </header>
      
      {ostoskorituote &&
      <div>
      <Tuotteet tuotteet={tuotteet} lisaatuote={lisaatuote} tuotelista={tuotelista}/>
      
      <Ostoskori tuotelista={tuotelista} lisaatuote={lisaatuote} lomake={lomake} naytalomake={naytalomake} />
      </div>
      }{lomake && 
      <div className="darken-screen"></div>
      }
      {lomake && 
      <Lomake lomake={lomake} piilota={piilotaostoskorituote}naytalomake={naytalomake} setCustomer={setCustomer} showreceipt={showreceipt}/>
      }
      { receipt &&
      <Receipt customer={customer} tuotelista={tuotelista}/>
      }
      


      </div>
    

  );
}

export default App;
