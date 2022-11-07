import {React, useState} from 'react';
import { tuotteet } from '../data/TuoteData';


const Tuote =({tiedot,lisaatuote,tuotelista}) =>{
    
    const [counter, setCounter] = useState(0);
    const id =tiedot.id
    
    
    const handlesubmit =(e,id,counter)=>{
        e.preventDefault();
        lisaatuote(tuotelista.map(tuote =>{
             if(id === tuote.id){
                 const tempLink = {...tuote, amount: tuote.amount + counter}
                 
                 return tempLink} 
             else {
                 return tuote
            
            
            }
 
        }))

     }    

    return(
        
        
        <div className="tuote">
            <img className="tuotekuva" src={tiedot.img}></img>
            <div className="flextest">
            <h2 className="tuoteotsikko">{tiedot.name}</h2>
            <form onSubmit={e=>handlesubmit(e,id,counter)}>
            <div className="flex-row"><input type="button" value="+"onClick={()=> {setCounter(counter+1)}}></input><input value={counter} type="number" id={tiedot.id} onChange={e=>setCounter(Number(e.target.value)) }></input></div>
            
            <p className="tuotehinta">{tiedot.hinta}€</p>
            <p className="lisatiedot">{tiedot.desc}</p>
            <button type="submit">Lisää koriin</button>
            </form>
            </div>
        </div>
    )

}
const Tuotteet =({lisaatuote,tuotelista}) => {
    return (
           <div className="tuotelaatikko">
               <h2>Tuotteet!</h2>
            { tuotteet.map((product) => <Tuote tiedot={product} key={product.id} lisaatuote={lisaatuote} tuotelista={tuotelista}/>)}
            </div>
    )
}

const Ostos =({lisaatuote,tuotelista,tuotetiedot}) => { 
    
    
    
    const handlesubmit =(e,id)=>{
    e.preventDefault();
    lisaatuote(tuotelista.map(tuote =>{
         if(id === tuote.id){
             const tempLink = {...tuote, amount:0}
             
             return tempLink} 
         else {
             return tuote
        
        
        }

    }))
}
    return (
        <div className="Ostos">
        <img className="Ostoskuva" src={tuotetiedot.img}></img>
        <div className="Ostosinfo">
        <h2>{tuotetiedot.name}</h2>
        <p>Määrä: {tuotetiedot.amount}</p>
        <p>Hinta: {tuotetiedot.hinta * tuotetiedot.amount}€</p>
        <form onSubmit={e=>handlesubmit(e,tuotetiedot.id)}>
        <button type="submit" className="poistatilaus">Poista tilaus</button>
        </form>
        </div>
        </div>
    )
}
const Ostoskori =({lisaatuote,tuotelista,naytalomake,lomake}) => {
   
    return (
        <div className="Ostoskori">
            <h1>Ostoskori!</h1>
        { tuotelista.map((product) => {
        if(product.amount>0){
            return <Ostos key={product.id} tuotetiedot={product} tuotelista={tuotelista} lisaatuote={lisaatuote}/>
            
            }
        
        }
    
    )
}
<button className="maksamaan-nappi" onClick={()=>naytalomake(!lomake)}>Maksamaan</button></div>
        )
    }

const Lomake =({naytalomake,lomake,piilota,setCustomer,showreceipt}) => {
    const [nimi, setNimi] = useState("")
    const [email, setEmail] = useState("")
    const [puh, setPuh] = useState("")
    const [KT, setKT] = useState("")
    const [PN, setPN] = useState("")
    const [PT, setPT] = useState("")

    const handlesubmit =(e,nimi,email,puh,KT,PN,PT)=>{
        e.preventDefault();
        const tiedot ={nimi:nimi,email:email,puh:puh,KT:KT,PN:PN,PT:PT}
        setCustomer(tiedot)
        piilota(false)
        naytalomake(false)
        showreceipt(true)
        setNimi("")
        setEmail("")
        setPuh("")
        setKT("")
        setPN("")
        setPT("")


        
    }
    return(
        
        <div className="maksulomake-container">
            <div className="flex-row2">
            <h2>Maksulomake</h2>
            <button  className="takaisin-nappi"onClick={()=>naytalomake(!lomake)}>Takaisin</button>
            </div>
            <form className="maksulomake" onSubmit={(e)=>handlesubmit(e,nimi,email,puh,KT,PN,PT)}>
                <div className="maksulomake-inputs">
                    <div className="input">
                        <label htmlFor="name">Nimi</label>
                        <input onChange={e=>setNimi(e.target.value)} value={nimi} id="name"></input>
                    </div>
                    <div className="input">
                        <label type="email"htmlFor="email">Sähköposti</label>
                        <input onChange={e=>setEmail(e.target.value)} value={email} id="email"></input>
                    </div>
                    <div className="input">
                        <label htmlFor="puh">Puhelinnumero</label>
                        <input onChange={e=>setPuh(e.target.value)} value={puh} id="puh"></input>
                    </div>
                    <div className="input">
                        <label htmlFor="KT">Katuosoite</label>
                        <input onChange={e=>setKT(e.target.value)} value={KT} id="KT"></input>
                    </div>
                    <div className="input">
                        <label htmlFor="PN">Postinumero</label>
                        <input onChange={e=>setPN(e.target.value)} value={PN} id="PN"></input>
                    </div>
                    <div className="input">
                        <label htmlFor="PT">Postitoimipaikka</label>
                        <input onChange={e=>setPT(e.target.value)} value={PT} id="PT"></input>
                    </div>

                    <button className="maksa-submit"type="submit">Vahvista ostos!</button>
                </div>

            </form>
            
        </div>
        



    )
 }
 const Receipt =({tuotelista,customer}) => {


    return(
        <div>
            <h2>Thank you for you purchase!</h2>
            <h3>Personal information:</h3>
            <h4>Tilaajan nimi: {customer.nimi}</h4>
            <h4>Sähköposti: {customer.email}</h4>
            <h4>Puhelinnumero: {customer.puh}</h4>
            <h4>Katuosoite: {customer.KT}</h4>
            <h4>Postinumero: {customer.PN}</h4>
            <h4>Postitoimipaikka: {customer.PT}</h4><br></br>
            <h3>Tilatut asiat:</h3>
            {tuotelista.map((product) => {
                if(product.amount>0){
                return <p>{product.name}: {product.amount}kpl/{product.hinta}€</p>;
                } 
            })}
    
        
        </div>)
 }

export {Tuote,Tuotteet,Ostoskori,Lomake,Receipt}