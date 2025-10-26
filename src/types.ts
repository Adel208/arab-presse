export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  date: string;
  metaDescription?: string;
  keywords?: string;
  content?: string; // Contenu complet de l'article
}

