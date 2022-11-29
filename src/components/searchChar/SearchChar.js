import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup'
import {Link} from 'react-router-dom';
//import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './searchChar.scss'

function SearchChar() {

    const [char, setChar] = useState(null)
    const {loading, error, getCharacterByName, clearError} = useMarvelService()
    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

    function updateChar(searchString) {
        clearError()
        getCharacterByName(searchString).then(onCharLoaded)
    }

    function onCharLoaded(char) {
        setChar(char)
    }
    console.log(char)
    let result = '';

    if (char != null && char.length > 0) {
        result =<div className="char__search-wrapper">
                    <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                            <div className="inner">To page</div>
                        </Link>
                </div>
    }
    else if (char != null && char.length === 0 ) {
        result =    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>;
    }

    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{
                    searchString:'',
                }}
                validationSchema = {Yup.object({
                    searchString: Yup.string()
                                .min(2, 'Минимум два символа')
                                .required('Обязательное поле')
                })}
                onSubmit = { ({searchString}) => {updateChar(searchString)} }
            >
                <Form>
                    <label className="char__search-label" htmlFor="searchString">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field
                            id="searchString"
                            name="searchString"
                            type="searchString"
                            placeholder="Enter name"
                        />
                        <button type="submit" className='button button__main'>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage className='char__search-error' component="div" name="searchString"/>
                </Form>
            </Formik>
            {result}
            {errorMessage}
        </div>
    )

}

export default SearchChar





// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup' 

// const CustomForm = () => {

//     return (
//         <Formik
//             initialValues = {{
//                 name:'',
//                 email:'',
//                 amount: 0,
//                 currency:'',
//                 text:'',
//                 terms: ''
//             }}
//             validationSchema = {Yup.object({
//                 name: Yup.string()
//                             .min(2, 'Минимум два символа')
//                             .required('Обязательное поле'),
//                 email: Yup.string()
//                             .email('Неправильный email')
//                             .required('Обязательное поле'),
//                 amount:Yup.number()
//                             .min(5,'Не менее 5')
//                             .required('Обязательное поле'),
//                 currency: Yup.string().required('Выбирете валюту'),
//                 text: Yup.string().min(10,'Не менее 10'),
//                 terms: Yup.boolean().required('Необходимо согласие').oneOf([true], 'Необходимо согласие')
//             })}
//             onSubmit = {values => console.log(JSON.stringify(values, null, 2))}
//         >
//             <Form className="form">
//                 <h2>Отправить пожертвование</h2>
//                 <label htmlFor="name">Ваше имя</label>
//                 <Field
//                     id="name"
//                     name="name"
//                     type="text"
//                 />
//                 <ErrorMessage className='error' component="div" name="name"/>
//                 <label htmlFor="email">Ваша почта</label>
//                 <Field
//                     id="email"
//                     name="email"
//                     type="email"
//                 />
//                 <ErrorMessage className='error' component="div" name="email"/>
//                 <label htmlFor="amount">Количество</label>
//                 <Field
//                     id="amount"
//                     name="amount"
//                     type="number"
//                 />
//                 <ErrorMessage className='error' component="div" name="amount"/>
//                 <label htmlFor="currency">Валюта</label>
//                 <Field
//                     as="select"
//                     id="currency"
//                     name="currency">
//                         <option value="">Выберите валюту</option>
//                         <option value="USD">USD</option>
//                         <option value="UAH">UAH</option>
//                         <option value="RUB">RUB</option>
//                 </Field>
//                 <ErrorMessage className='error' component="div" name="currency"/>
//                 <label htmlFor="text">Ваше сообщение</label>
//                 <Field
//                     as="textarea" 
//                     id="text"
//                     name="text"
//                 />
//                 <ErrorMessage className='error' component="div" name="text"/>
//                 <label className="checkbox">
//                     <Field
//                         name="terms" 
//                         type="checkbox"
//                     />
//                     Соглашаетесь с политикой конфиденциальности?
//                 </label>
//                 <ErrorMessage className='error' component="div" name="terms"/>
//                 <button type="submit">Отправить</button>
//             </Form>
//         </Formik>
//     )
// }

// export default CustomForm;