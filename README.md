# PriceSphere - Global Price Comparison Tool

PriceSphere is a powerful AI-driven price comparison platform that helps users find the best deals on products across 195+ countries. Using advanced search APIs and LLM-powered analysis, it delivers intelligent product recommendations tailored to each market.

## 🚀 Features

### 🌍 Global Coverage
- **195+ countries** supported with country-specific e-commerce sites
- **Regional currency** and language support
- **Popular shopping sites** for each market (Amazon, eBay, local retailers)

### 🔍 Smart Search
- **Multi-engine search** using Google Custom Search API and SerpAPI
- **Up to 100 results** per search from top shopping sites
- **AI-powered query processing** for better product matching
- **Country-specific** search optimization

### 🤖 AI-Powered Analysis
- **LLM deal analysis** using OpenAI GPT-4 and Anthropic Claude
- **Quality scoring** (excellent/good/average/poor)
- **Relevance filtering** to show only the best matches
- **Price comparison** with availability checking

### 👤 User Features
- **Search history** - View all past searches
- **Save products** - Bookmark favorite deals
- **User authentication** - Secure account management
- **Personalized dashboard** - Tailored to your preferences

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
- **AI/LLM**: OpenAI GPT-4, Anthropic Claude
- **Search APIs**: Google Custom Search, SerpAPI
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- API keys for:
  - OpenAI or Anthropic
  - Google Custom Search API
  - SerpAPI (optional fallback)

## 🚀 Quick Start

1. **Clone and install**
```bash
git clone <repository-url>
cd price-comparison-tool
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pricesphere"

# Authentication
NEXTAUTH_SECRET="your-secret-key"

# Search APIs
GOOGLE_SEARCH_API_KEY="your-google-api-key"
GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"
SERPAPI_KEY="your-serpapi-key"

# AI/LLM APIs
OPENAI_API_KEY="your-openai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
```

3. **Set up database**
```bash
npm run db:generate
npm run db:migrate
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### 1. Product Search
- User selects a product and country
- System queries Google Custom Search API or SerpAPI
- Returns up to 100 results from top shopping sites in that country

### 2. AI Analysis
- LLM analyzes search results for relevance and quality
- Filters and ranks deals based on:
  - Product match accuracy
  - Price competitiveness
  - Seller reliability
  - Availability status

### 3. Dashboard Presentation
- Best deals displayed in organized cards
- Shows product details, pricing, and seller information
- Direct links to purchase on original sites

### 4. User Features
- **Past Searches**: View search history with timestamps
- **Saved Products**: Bookmark products for later
- **User Preferences**: Set default country and currency

## 🗂️ Project Structure

```
price-comparison-tool/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── search/       # Main search endpoint
│   │   │   ├── analyze-deals/ # AI analysis endpoint
│   │   │   ├── auth/         # Authentication
│   │   │   ├── past-searches/ # User history
│   │   │   └── saved-products/ # Saved items
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── auth/            # Auth pages
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── search/          # Search components
│   │   ├── ui/              # Shadcn/UI components
│   │   └── dashboard/       # Dashboard components
│   ├── lib/
│   │   ├── services/        # Business logic
│   │   │   ├── searchService.ts
│   │   │   ├── regionMapper.ts
│   │   │   └── priceComparisonService.ts
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utilities
│   └── middleware.ts        # Auth middleware
├── prisma/
│   └── schema.prisma        # Database schema
└── package.json
```

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

## 🌐 API Endpoints

### Search
- `POST /api/search` - Search for products
- `GET /api/search?query=...&country=...` - GET search

### Analysis
- `POST /api/analyze-deals` - Analyze search results with AI

### User Data
- `GET /api/past-searches` - Get user search history
- `POST /api/saved-products` - Save/unsave products
- `GET /api/saved-products` - Get saved products

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ✅ |
| `GOOGLE_SEARCH_API_KEY` | Google Custom Search API key | ✅ |
| `GOOGLE_SEARCH_ENGINE_ID` | Google Search Engine ID | ✅ |
| `SERPAPI_KEY` | SerpAPI key (fallback) | ❌ |
| `OPENAI_API_KEY` | OpenAI API key | ✅ |
| `ANTHROPIC_API_KEY` | Anthropic API key | ❌ |

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker
```bash
docker build -t pricesphere .
docker run -p 3000:3000 pricesphere
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the CLAUDE.md file for development guidance

---

Built with ❤️ using Next.js, TypeScript, and AI technology.