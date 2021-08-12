import React, {useEffect,useState} from 'react'
import Web3 from 'web3'
import './App.css';
import electionABI from './contracts/Election.json'

function App() {

 const [Account, setAccount] = useState("");
 const [loading,setLoading]=useState(true);
 const [Election,setElection]=useState();
 const [Candidate1,setCandidate1]=useState();
 const [Candidate2,setCandidate2]=useState();
 const [selectCandidate,setSelectCandidate]=useState("")
 
 // this is for load web3 for us
 const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};


const loadBlockchainData= async()=>{
  setLoading(true)
  if (typeof window.ethereum == "undefined") {
    return;
  }
  const web3 = new Web3(window.ethereum);

  const accounts = await web3.eth.getAccounts();

  if (accounts.length === 0) {
    return;
  }
  console.log(accounts[0])
  setAccount(accounts[0]);

  const networkId = await web3.eth.net.getId();
  console.log(networkId);

  const networkData= electionABI.networks[networkId];
  if(networkData){
     const electionContract=new web3.eth.Contract(electionABI.abi,networkData.address);
     setElection(electionContract);
   //  console.log(electionContract);


     const candidate1= await electionContract.methods.candidates(1).call();
   //  console.log(candidate1)
    
     setCandidate1(candidate1)
     const candidate2= await electionContract.methods.candidates(2).call();
   //  console.log(candidate2)
    
     setCandidate2(candidate2)

     setLoading(false)
  }else{
    window.alert("the smart contract is not deployed current network")
  }


};



useEffect(()=>{
  loadWeb3();
  loadBlockchainData();
},[])


const voteCandidate= async(candidateid)=>{
  setLoading(true)
  await Election.methods.Vote(candidateid).send({ from: Account}).on('transactionhash',()=>{
    console.log("successfully ran")
  })
    setLoading(false)
}

 
const OnSubmit=(e)=>{
         e.preventDefault();
         if(selectCandidate.id !==0 ){
           voteCandidate(Number(selectCandidate))
         }else{
           window.alert("there is error in submission")
         }

}




if(loading){
  return(
    <h1>loading...</h1>
  )

}

  return (
    <div className="App">
       <div className="header">
            <p>Wallet Address</p>
            <ul className=" ">
              <li className="">{Account}</li>
              <tr>
                
              </tr>
            </ul>
          </div>

      <div>
        <h1>ELECTION RESULTS</h1>
        <table style={{width:"100%"}} >
  <tr>
    <th>ID</th>
    <th>Name</th>
    <th>Votes</th>
  </tr>
  <tr>
    <td>{Candidate1.id}</td>
    <td>{Candidate1.name}</td>
    <td>{Candidate1.voteCount}</td>
  
  </tr>
  <tr>
    <td>{Candidate2.id}</td>
    <td>{Candidate2.name}</td>
    <td>{Candidate2.voteCount}</td>
  </tr>
</table>

      </div>

      <div>
        <h5>Cast your vote</h5>
        <form onSubmit={OnSubmit} >
           <select style={{width:"500px"}} onChange={(e)=>setSelectCandidate(e.target.value)}>
             <option defaultValue="">
               Select
             </option>
             <option value="1"> {Candidate1.name}</option>
             <option value="2">{Candidate2.name}</option>
           </select>
           <br/>
           <button >Vote Candidate { selectCandidate}</button>
        </form>
      </div>

    </div>
  );
}

export default App;
