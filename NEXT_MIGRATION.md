# Coolors.in Next.js Migration Guide

This document outlines the ongoing migration of Coolors.in from a client-side React application to a server-rendered Next.js application.

## Migration Goals

- **Improved SEO**: Server-side rendering for better search engine indexing
- **Faster initial page loads**: Pre-rendering critical HTML for improved Core Web Vitals
- **Better social sharing**: Dynamic OpenGraph images and metadata
- **Improved AdSense compliance**: Better content visibility and indexing
- **Enhanced analytics**: More accurate tracking of page views and interactions
- **Progressive enhancement**: Graceful degradation for users with JavaScript disabled

## Migration Status

| Feature | Status | Notes |
|---------|--------|-------|
| Core app structure | ✅ | Basic Next.js setup complete |
| Home page | 🟡 | In progress |
| Auth system | 🟡 | In progress |
| Color palette generator | 🟡 | In progress |
| Image-to-palette tool | 🟡 | Server-side extraction API created |
| Palette visualizer | ✅ | Migrated |
| Designer's guide | ✅ | Migrated with enhanced SEO |
| FAQ page | ✅ | Migrated with structured data |
| Privacy Policy | ✅ | Migrated |
| SEO improvements | ✅ | Added sitemap, robots.txt |
| AdSense integration | ✅ | Component-based implementation |
| Analytics | ✅ | Using Next.js Script component |

## Directory Structure

The application is currently in a hybrid state during the migration. Here's how the structure is organized:

```
/
├── client/                # Original React app (Vite)
│   ├── src/               # React components and logic
│   └── ...
├── pages/                 # Next.js pages
│   ├── api/               # API routes (server-side only)
│   ├── _app.tsx           # Next.js app wrapper
│   ├── _document.tsx      # HTML document customization
│   ├── index.tsx          # Home page
│   └── ...                # Other pages
├── components/            # Shared components for Next.js
├── public/                # Static assets
├── styles/                # Global styles
├── shared/                # Shared types and utilities
├── next.config.js         # Next.js configuration
└── ...
```

## Migration Approach

We're taking a phased approach to migration:

1. **Phase 1**: Set up Next.js alongside the existing React app
2. **Phase 2**: Create server-side API endpoints for improved functionality
3. **Phase 3**: Migrate static pages (FAQ, Privacy Policy, etc.)
4. **Phase 4**: Migrate dynamic pages with SSR/SSG
5. **Phase 5**: Complete the migration and remove legacy code

During the migration period, both the original React app and the Next.js app will run simultaneously to ensure a smooth transition.

## How to Run During Migration

### Running both applications (development):

```bash
./start-all.sh
```

This will start:
- Vite development server on port 5000 (original app)
- Next.js development server on port 3000 (new app)

### Running only Next.js (development):

```bash
./start-all.sh --next-only
```

or

```bash
./start-next-dev.sh
```

## Development Guidelines

### Adding New Pages

1. Create the page in the `pages/` directory following Next.js conventions
2. Use the `CommonHead` component for consistent SEO
3. Implement both client-side and server-side data fetching as needed

### API Routes

- Place API routes in `pages/api/`
- Use server-side processing for tasks like image analysis
- Implement proper error handling and caching headers

### Component Reuse

- Components in `client/src/components` can be imported and used in Next.js pages
- Where applicable, create wrapper components in `components/` that adapt React components for Next.js

### SEO Best Practices

- Use `CommonHead` component for consistent metadata
- Implement JSON-LD structured data where appropriate
- Ensure proper canonical URLs across all pages
- Add appropriate OpenGraph and Twitter card metadata

## AdSense Integration

We've implemented a component-based approach for AdSense:

- `AdSenseSetup`: Include once in `_app.tsx` to initialize AdSense
- `InArticleAd`: For in-content advertisements
- `SidebarAd`: For sidebar advertisements
- `BannerAd`: For top/bottom banner advertisements

## Next Steps

1. Complete the migration of the color palette generator
2. Implement server-side rendering for the image-to-palette feature
3. Migrate authentication system
4. Implement API routes for palette saving and sharing
5. Complete SEO optimizations
6. Performance testing and optimization

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [React to Next.js Migration Guide](https://nextjs.org/docs/migrating/from-react)