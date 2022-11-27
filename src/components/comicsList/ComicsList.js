import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const offsetInit = 0

    const [comics, setComics] = useState([])
    const [offset, setOffset] = useState(offsetInit)
    const [comicsEnded, setComicsEnded] = useState(false)
    const {loading, error, getAllComics} = useMarvelService()

    useEffect(() => {
        onRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onRequest = (offset) => {
        getAllComics(offset).then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComics) => {

        let ended = false
        if (newComics.length < 8) {
            ended = true
        }
        setComics(comics => [...comics, ...newComics])
        setOffset(offset => offset + 8)
        setComicsEnded(ended)
    }

    let comicsList = comics.map((item, i) => {
        return (
            <li className="comics__item" key={i}>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}</div>
                </Link>
            </li>
        )
    })


    const spinner = loading && offset === offsetInit ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null

    

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            <ul className="comics__grid">
                {comicsList}
            </ul>
            <button className="button button__main button__long"
            disabled={loading}
            onClick={()=> onRequest(offset)}
            style={{'display': comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;