import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ArticleDetail from './ArticleDetail';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

