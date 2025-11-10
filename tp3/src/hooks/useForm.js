import { useState } from 'react';

export const useForm = (initialValue = {}) => {
    //gestionar el estado del formulario 
  const [formValues, setFormValues] = useState(initialValue);

  //manejo de cambios de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  //funcion para resetear elform
  const handleReset = () => {
    setFormValues(initialValue);
  };

  //return de los valores y funciones
  return {
    formValues,
    handleChange,
    handleReset,
    // handleSubmit
  };
};