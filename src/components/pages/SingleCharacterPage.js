import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {Helmet} from "react-helmet"
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from "../appBanner/AppBanner";
import './singleComicsPage.scss';

const SingleCharacterPage = () => {
    const {charId} = useParams();
    const [char, setChar] = useState(null);
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charId])

    const updateChar = () => {
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    function onCharLoaded(char) {
        setChar(char)
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail } = char;

    return (
        <div className="single-comic">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{name}</title>
                
            </Helmet>
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
            </div>
            <Link to="/" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleCharacterPage;