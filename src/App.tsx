import { useEffect, useState } from 'react'

import { withAuthenticator } from '@aws-amplify/ui-react'
import { generateClient } from 'aws-amplify/api';
import { pets } from './Types/data';

import {createPet,deletePet} from './graphql/mutations';
import {listPets} from './graphql/queries';


function App() {

  const client = generateClient();


const [petsData, setPetData]= useState([])
const [petadded,setPetAdded]= useState(true)
useEffect(()=>{
  const fetchPets = async() =>{
   const res= await client.graphql(
    {
      query:listPets
    }
   )
   return res.data.listPets.items
 
  }
fetchPets().then(pets=>setPetData(pets))

},[petadded]

)

  const [formData, setFormData] = useState({
    petname: '',
    description: '',
    petType: 'none',
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit=async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { petname, description, petType } = formData;
    console.log(petType)


try {
  const result=  await client.graphql(
    {
      query: createPet,
      variables: {
        input: {
          nanme: petname,
          description:description,
          petType:petType
        }
      }
  
    }
  )
  setPetAdded(result)
} catch (error) {
  console.log(error)
}





  }
  const handleDelete=async(petid:string)=>{
    const result=await client.graphql({
      query:deletePet,
      variables:{
        input:{
          id:petid
        }
      }
      
    })
    setPetAdded(result)
  }
  return (
    <>
    <div>
      <ul>
      {petsData.map((pet:pets)=>(
  <li key={pet.id}>
    <h2 >{pet.nanme}</h2>
    <h3>{pet.description}</h3>
    <h3>{pet.petType}</h3>
    <button onClick={()=>handleDelete(pet.id)}>Delete</button>
  </li>
))}
      </ul>



      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='enter the name'  name="petname" onChange={handleChange}/>
        <br />
        <input placeholder='enter the description' name="description" type="text" onChange={handleChange} />
        <br />
        <select name="petType" id="" onChange={handleChange}>
          <option value="none">please select a pet</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="turtle">Turtle</option>
          

        </select>
        <br />
        <button>Create pet</button>
      </form>
    </div>
    </>
  )
}

export default withAuthenticator(App);
