import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


const CharList = (props) => {

    const [chars, setChars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charEnded,setCharEnded] = useState(false)

    const marvelService = new MarvelService()

    const onRequest = (offset) => {
        onCharsListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    }

    console.log('render')
    useEffect(() => {
        console.log('useEffect');
        onRequest();
    }, [])

    const onCharsListLoading = () => {
        setNewItemLoading(true)
    }

    const onCharListLoaded = (newChars) => {

        let ended = false
        if(newChars.length < 9) {
            ended = true
        }

        setChars( chars => [...chars, ...newChars])
        setLoading(false)
        setNewItemLoading(false)
        setOffset(offset => offset + 9)
        setCharEnded(ended)
    }

    const onError = () => {
        setError(true)
        setLoading(false)
    }

    const itemRefs = useRef([]);
    
    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    console.log(chars.length)
    let charLst = chars.map((item, i) => {
        let imgFit = {}
        if (item.thumbnail.indexOf('image_not_available') >= 0) {
            imgFit = {objectFit: 'fill'}
        }
        return (
            <li className="char__item" 
                key={i}
                tabIndex={0}
                ref={el => itemRefs.current[i] = el}
                // el -  это ссылка на текущий ДОМ элемент, и его добавляем в массив 
                // с индексом i
                onClick={() => {
                                props.onCharSelected(item.id)
                                focusOnItem(i)
                            } 
                }
                onKeyPress={(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }
                }}
                >
                <img src={item.thumbnail} alt={item.name} style={imgFit}/>
                <div className="char__name">{item.name}</div>
            </li>)
    })

    const spinner = loading ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            <ul className="char__grid">
                {charLst}
            </ul>
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={()=> onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;