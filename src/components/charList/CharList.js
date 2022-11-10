import React, { Component } from 'react';
import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';


class CharList extends Component {

    selectedRef = React.createRef();

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

    itemRefs = [];
    
    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    render() {
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state
        const spinner = loading ? <Spinner/> : null
        const errorMessage = error ? <ErrorMessage/> : null
        
        let charLst = chars.map((item, i) => {
            let imgFit = {}
            if (item.thumbnail.indexOf('image_not_available') >= 0) {
                imgFit = {objectFit: 'fill'}
            }
            return (//char__item_selected
                <li className="char__item" 
                    key={item.id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                                    this.props.onCharSelected(item.id)
                                    this.focusOnItem(i)
                                } 
                    }
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}
                    >
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

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;