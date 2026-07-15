import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsBaseMetadata = {
  'plantify': {
    title: 'PLANTIFY',
    category: 'Brand Identity',
    description: 'Plantify is a premium green brand identity focused on bringing elegance and nature into homes. The project showcases business card presentations, customized packaging, advertising flyers, and professional brand brochures.',
    client: 'Plantify Corp',
    year: '2025',
    services: 'Brand Strategy, Logo Design, Stationery, Print',
    tools: 'Illustrator, Photoshop'
  },
  'bite-right': {
    title: 'BITE RIGHT',
    category: 'Food Brand',
    description: 'Bite Right is an energetic and modern food branding system created for a healthy eating restaurant chain. Features clean logos, colorful food packaging mockups, and a welcoming layout.',
    client: 'Bite Right Restaurants',
    year: '2024',
    services: 'Creative Direction, Branding, Menu & Packaging Design',
    tools: 'Illustrator, Photoshop'
  },
  'steel-gate': {
    title: 'STEEL GATE',
    category: 'Construction Branding',
    description: 'Steel Gate is a solid and reliable corporate identity for a general contracting and construction supplies firm. Bold industrial colors, heavy layout patterns, and modern typography are utilized to establish market trust and strength.',
    client: 'Steel Gate Contracting',
    year: '2024',
    services: 'Brand Identity, Stationery Design, Vehicle Wrap',
    tools: 'Illustrator, Photoshop'
  },
  'website': {
    title: 'WEB EXPERIENCES',
    category: 'UI/UX Design',
    description: 'Web Experiences highlights a collection of modern, responsive user interfaces and websites designed with high usability and futuristic concepts. Implements advanced dashboard designs and elegant layouts.',
    client: 'Various Clients',
    year: '2025',
    services: 'UI/UX Design, Web Layouts, Dashboard Prototyping',
    tools: 'Figma, VS Code'
  },
  'engineers-elections': {
    title: 'ENGINEERS ELECTIONS',
    category: 'Campaign Design',
    description: 'A comprehensive branding and campaign design for the Engineers Syndicate Elections. Featuring strong visual communications, posters, flyers, and digital cards designed to reach and inspire syndicate voters.',
    client: 'Syndicate Campaign Committee',
    year: '2024',
    services: 'Political Campaign Design, Print Design, Brand Strategy',
    tools: 'Photoshop, InDesign'
  },
  'cards': {
    title: 'CARD SYSTEMS',
    category: 'Print Design',
    description: 'A portfolio of high-end business card concepts, corporate card layouts, and premium branding systems. Uses luxury elements, textures, and clean typography to elevate professional connections.',
    client: 'Multiple Businesses',
    year: '2024',
    services: 'Print Design, Stationery, Premium Textures',
    tools: 'Illustrator, Photoshop'
  },
  'hypnos': {
    title: 'HYPNOS',
    category: 'Visual Identity',
    description: 'Hypnos represents a futuristic, minimalist branding project that blends dark theme aesthetics, glow effects, and modern brand design concepts. Perfect for experimental agencies or luxury tech startups.',
    client: 'Hypnos Agency',
    year: '2025',
    services: 'Visual Identity, Digital Branding, Art Direction',
    tools: 'Illustrator, Photoshop'
  },
  'flayer-poster': {
    title: 'PRINT COLLECTION',
    category: 'Print & Poster',
    description: 'A beautiful collection of printed posters, commercial flyers, and event print materials. Incorporating strong layout hierarchies and striking graphics designed to draw attention and convey messages.',
    client: 'Retail & Event Brands',
    year: '2024',
    services: 'Print Ads, Commercial Posters, Typography Layouts',
    tools: 'Photoshop, InDesign'
  },
  'logo': {
    title: 'BRAND LOGOS',
    category: 'Brand Logos',
    description: 'A showcase of professional logo designs, corporate marks, and brand symbols created for various industries. Focuses on vector precision, clever metaphors, and timeless shapes.',
    client: 'Various Startups',
    year: '2024',
    services: 'Logo Design, Brand Marks, Vector Styling',
    tools: 'Illustrator'
  },
  'menu': {
    title: 'MENU DESIGNS',
    category: 'Menu Design',
    description: 'Professional menu designs and restaurant presentation boards. Crafted to reflect the brand character of culinary projects, enhancing the guest experience with appetizing layout structure.',
    client: 'Restaurants & Cafés',
    year: '2023',
    services: 'Editorial Layout, Menu Design, Print Optimization',
    tools: 'InDesign, Illustrator, Photoshop'
  }
};

const projectsDir = path.join(__dirname, '../public/assets/projects');
const outputFilePath = path.join(__dirname, '../src/projectsData.json');

const projects = {};

try {
  if (fs.existsSync(projectsDir)) {
    const dirs = fs.readdirSync(projectsDir);
    dirs.forEach(dir => {
      const fullPath = path.join(projectsDir, dir);
      if (fs.statSync(fullPath).isDirectory()) {
        const slug = dir;
        const base = projectsBaseMetadata[slug] || {
          title: slug.toUpperCase().replace('-', ' '),
          category: 'Creative Design',
          description: 'Creative showcase for ' + slug,
          client: 'Client',
          year: '2025',
          services: 'Creative Services',
          tools: 'Design Tools'
        };

        const files = fs.readdirSync(fullPath);
        const images = files
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext);
          })
          .map(file => `/assets/projects/${slug}/${file}`);

        projects[slug] = {
          ...base,
          images
        };
      }
    });
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(projects, null, 2), 'utf-8');
  console.log('Successfully generated src/projectsData.json');
} catch (error) {
  console.error('Error generating projects data:', error);
  process.exit(1);
}
