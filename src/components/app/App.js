import {lazy, Suspense} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/Spinner';

// заменено на ленивую загрузку ниже, импорт происходит только при обращении к компоненту
//import { ComicsPage, Page404, ComicsPage , SingleComicsPage } from '../pages';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicsPage = lazy(() => import('../pages/SingleComicsPage'));
const SingleCharacterPage = lazy(() => import('../pages/SingleCharacterPage'));

const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader />
                <main>
                    <Suspense fallback={<Spinner/>}>
                    <Routes>
                        <Route path="/" element={<MainPage/>} />
                        <Route path="/comics" element={<ComicsPage/>} />
                        <Route path="/comics/:comicId" element={<SingleComicsPage/>} />
                        <Route path="/characters/:charId" element={<SingleCharacterPage/>} />
                        <Route path="*" element={<Page404/>} />  
                    </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;