import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService()

    onError = () => {
        this.setState({ 
            loading:false,
            error: true
        })
    }

    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharsListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharsListLoading = () => {
        this.setState({ 
            newItemLoading: true
        }) 
    }

    onCharListLoaded = (newChars) => {

        let ended = false
        if(newChars.length < 9) {
            ended = true
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    render() {
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state
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
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={()=> this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;