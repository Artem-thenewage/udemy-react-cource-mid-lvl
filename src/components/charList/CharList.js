import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';
//import abyss from '../../resources/img/abyss.jpg';


class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService()

    onCharsLoaded = (chars) => {
        this.setState({ chars, loading:false }) // такая запись аналогична записи {char: char}
    }

    onError = () => {
        this.setState({ 
            loading:false,
            error: true
        })
    }

    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }
    render() {
        const {chars, loading, error} = this.state
        const spinner = loading ? <Spinner/> : null
        const errorMessage = error ? <ErrorMessage/> : null
        
        let charLst = chars.map(item => {
            let imgFit = {}
            if (item.thumbnail.indexOf('image_not_available') >= 0) {
                imgFit = {objectFit: 'fill'}
            }
            return (
                <li className="char__item char__item_selected" key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgFit}/>
                    <div className="char__name">{item.name}</div>
                </li>)
        })



        return (
            <div className="char__list">
                {spinner}
                {errorMessage}
                <ul className="char__grid">
                {charLst}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;