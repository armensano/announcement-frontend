import axios, { AxiosError } from 'axios'
import Router, { useRouter } from 'next/router'
import React from 'react'
import Image from 'next/image'
import { IAnnouncement } from '../../shared/interfaces/announcement.interface'
import styles from '../../styles/Home.module.css'

const URL = process.env.SERVER_URL || 'http://localhost:8080'

const Announcement = () => {
  const router = useRouter()
  // can't use router.query since it's empty object because of Automatic Static Optimization
  
  const [axiosErrorMessage, setAxiosErrorMessage] = React.useState<AxiosError | Error | undefined>(undefined)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [announcement, setAnnouncement] = React.useState<IAnnouncement | undefined>(undefined)

  React.useEffect(() => {
    if(!localStorage.getItem('Authorization')) {
      router.push('/auth/login')
    }
    
    getAnnouncement()
  } , [])

  const getAnnouncement = async () => {
    try {
      const id = window.location.href.split('/').pop() 
      
      const response = await axios.get(`${URL}/announcements/${id}`,{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      
      setAnnouncement(response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          setAxiosErrorMessage(axiosError.response.data.value)
        }
      }
    }
  }
  const updateAnnouncement = async (formData: FormData) => {
    try {
      const id = window.location.href.split('/').pop() 
      const url = `${URL}/announcements/${id}`
      const response = await axios.patch(url, formData, {
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
    const city = form.elements.city.value;
    
    const formData = new FormData();
    const files:any = document.getElementById('images');
    formData.append('description', description);
    formData.append('price', price);
    formData.append('tags', JSON.stringify(tags));
    formData.append('images', files?.files[0]);
    formData.append('region', region);
    formData.append('city', city);
    await updateAnnouncement(formData);
  }

  const handleChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    setAnnouncement({...announcement, [name]: value})
  }
  const handleBack = (e: any) => {
    Router.push('/')
  }
  const handleDelete = async (e: any) => {
    try {
      const id = window.location.href.split('/').pop()
      const url = `${URL}/announcements/${id}`
      const response = await axios.delete(url, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('Authorization')
        }
      })
      Router.push('/')
    } catch (error) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          setErrorMessage(axiosError.response?.data?.value)
        }
      }
    }
  }

  return (
    <div className={styles.cardBox}>
      <button onClick={handleBack}>Back</button>
      <h1>Update Announcement</h1>
      {errorMessage && <p>{errorMessage}</p>}
      {axiosErrorMessage && <p>{axiosErrorMessage.message}</p>}
      <div className={styles.cardBox}>
    <div className={styles.card}>
      <form method="post" action={`${URL}/announcements`}>
        <input type="text" placeholder="Description" value={announcement?.description} name="description" onChange={handleChange}/>
        <input type="text" placeholder="Price" value={announcement?.price} name="price" onChange={handleChange}/>
        <input type="text" placeholder="Tags" value={announcement?.tags} name="tags" onChange={handleChange}/>
        <input type="text" placeholder="City" value={announcement?.city} name="city" onChange={handleChange}/>
        <input type="text" placeholder="Region" name="region" value={announcement?.region} onChange={handleChange}/>
        <input id='images' className={styles.image} type="file" placeholder="Images" name="images"/>
        {announcement?.images.map((image: string) => {
                const src=`${URL}/uploads/${announcement?.images[0]}`
                return (
                  <Image loader={() => src} src={src} alt='no image' key={src} width="100%" height="100%"	/>
                )
              })}
        <button type="submit" onClick={handleClick}>Update</button>
      </form>
      <button onClick={handleDelete}>Delete</button>
    </div>
    </div>
    </div>
  )
}
  
export default Announcement

