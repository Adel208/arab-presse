export interface NewsItem {
  id: number;
  slug: string; // URL SEO-friendly
  title: string;
  summary: string;
  category: string;
  date: string;
  metaDescription?: string;
  keywords?: string;
  content?: string; // Contenu complet de l'article
  author?: string; // Auteur de l'article
}

