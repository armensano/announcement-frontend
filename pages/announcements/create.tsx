import axios, { AxiosError } from "axios";
import Router from "next/router";
import React, { useEffect } from "react";
import styles from '../../styles/Home.module.css'

const URL = process.env.SERVER_URL;

const CreateAnnouncement = () => {
  const [errorMessage, setErrorMessage] = React.useState('')
  const [categories, setCategories] = React.useState([])
  const [category, setCategory] = React.useState(0)

  useEffect(() => {
    if(!localStorage.getItem('Authorization')) {
      Router.push('/auth/login')
    }
    getCategories()
  } , [])

  const getCategories = async () => {
    try {
      const response = await axios.get(`${URL}/category`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createAnnouncement = async (formData: FormData) => {
    try {
      const url = `${URL}/announcements`
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization'),
          'Content-type': 'multipart/form-data'
        },
      })
      Router.push('/')
      
      setErrorMessage(response.data.value)
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          setErrorMessage(axiosError.response?.data?.value)
        }
      } 
    }
  }

  const handleClick = async (e: any) => {
    e.preventDefault();
    const form = e.target.form;
    const description = form.elements.description.value;
    if (description.length < 1) {
      setErrorMessage('Please enter a description');
      return;
    }
    const price = form.elements.price.value;
    if (!price || isNaN(Number(price))  || price < 0 || price > 99999) {
      setErrorMessage('Please enter valid price');
      return;
    }
    const tags = form.elements.tags.value?.split(',');
    
    if (tags.length < 1 && typeof Array.isArray(tags) == 'string') {
      setErrorMessage('Please enter tags');
      return;
    }
    
    const region = form.elements.region.value;
    if (region.length < 1) {
      setErrorMessage('Please enter a region');
      return;
    }
    const city = form.elements.city.value;
    
    if (city.length < 1) {
      setErrorMessage('Please enter a city');
      return;
    }
    
    const formData = new FormData();
    const files = document.getElementById('images');
    formData.append('description', description);
    formData.append('price', price);
    formData.append('tags', JSON.stringify(tags));
    formData.append('images', files?.files[0]);
    formData.append('region', region);
    formData.append('city', city);
    formData.append('categoryId', category + '');
    await createAnnouncement(formData);
  }

  const handleBack = async (e: any) => {
    Router.push('/')
  }

  const handleRadio = async (e: any) => {
    setCategory(e.target.value)
  }

  return (
    <div className={styles.cardBox}>
      <button onClick={handleBack}>Back</button>
      <h1>Create Announcement</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <div className={styles.cardBox}>
    <div className={styles.card}>
      <form method="post" action={`${URL}/announcements`}>
        <div>
          <p>category</p>
          {
            categories.map((cat: any) => (
              <div key={cat.id}><input type="radio" checked={category == cat.id} style={{display: 'inline', width: 'fit-content'}} value={cat.id} onClick={handleRadio}/> {cat.name}</div>
            ))
          }
        </div>
        <input type="text" placeholder="Description" name="description"/>
        <input type="number" placeholder="Price" name="price"/>
        <input type="text" placeholder="Tags" name="tags"/>
        <input type="text" placeholder="City" name="city"/>
        <input type="text" placeholder="Region" name="region"/>
        <input id='images' className={styles.image} type="file" placeholder="Images" name="images"/>
        <button type="submit" onClick={handleClick}>Create</button>
      </form>
    </div>
    </div>
    </div>
  );
}

export default CreateAnnouncement;