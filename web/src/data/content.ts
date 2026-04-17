import type { ImageMetadata } from 'astro';

import firstPostFeatured from '../assets/posts/first-post/featured.png';
import aqiStationsScraperImage from '../assets/projects/aqi_stations_scraper.png';
import argosExtensionsImage from '../assets/projects/argos_extensions.png';
import sdcpyImage from '../assets/projects/sdcpy.png';
import sdcpyAppImage from '../assets/projects/sdcpy_app.png';
import sugarboardImage from '../assets/projects/sugarboard.png';
import tokyoSkylineImage from '../assets/projects/tokyo_skyline.jpg';

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  short: string;
  icon: string;
};

export type BlogPost = {
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: ImageMetadata;
  href: string;
};

export type Project = {
  title: string;
  description: string;
  date: string;
  categories: string[];
  image: ImageMetadata;
  href: string;
};

export type HeroCard = {
  title: string;
  subtitle: string;
};

export type HomeHero = {
  name: string;
  availability: string;
  tagline: string;
  cards: HeroCard[];
};

export type HomeAnchorCard = {
  id: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
};

export type EducationTimelineItem = {
  degree: string;
  subtitle?: string;
  institution: string;
  years: string;
  focus: string;
};

export type Publication = {
  title: string;
  authors: string;
  publication: string;
  year: number;
  categories: string[];
  doi?: string;
  pdf?: string;
  code?: string;
};

export const siteMeta = {
  name: 'Alejandro Fontal',
  masthead: 'Portfolio · Blog · CV',
  tagline: 'Data science · Bioinformatics · Health Analytics',
  description:
    'Personal site for notebooks, projects, publications, and CV material spanning data science, bioinformatics, and scientific software.',
  siteUrl: 'https://alfontal.dev',
  repoUrl: 'https://github.com/AlFontal/alfontal.dev',
  email: 'alejandro.fontal.92@gmail.com',
  footerPrompt: 'Research notes, software projects, and contact details in one place.',
};

export const navLinks: NavLink[] = [
  { label: 'About', href: '/' },
  { label: 'CV', href: '/cv' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'Publications', href: '/publications' },
];

export const socialLinks: SocialLink[] = [
  { label: 'Email', href: 'mailto:alejandro.fontal.92@gmail.com', short: 'Mail', icon: 'fa6-solid:envelope' },
  { label: 'GitHub', href: 'https://github.com/AlFontal', short: 'GH', icon: 'fa6-brands:github' },
  { label: 'GitLab', href: 'https://gitlab.com/AlFontal', short: 'GL', icon: 'fa6-brands:gitlab' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alfontal', short: 'IN', icon: 'fa6-brands:linkedin' },
  { label: 'ORCID', href: 'https://orcid.org/0000-0003-1138-2158', short: 'ORCID', icon: 'fa6-brands:orcid' },
  { label: 'Letterboxd', href: 'https://letterboxd.com/AlFontal', short: 'LB', icon: 'simple-icons:letterboxd' },
  // that was a bit too much but we can keep it commented just in case XD
  // { label: 'Strava', href: 'https://www.strava.com/athletes/24896086', short: 'SV', icon: 'fa6-brands:strava' },
];

export const homeHero: HomeHero = {
  name: 'Alejandro Fontal',
  availability: 'I’m a data scientist based in Barcelona, working mostly on health, environmental, and omics data. See my CV for full professional background.',
  tagline:
    'I use this site for projects, writing, publications, and whatever I’m building or thinking about lately, with the occasional rabbit hole.',
  cards: [
    { title: 'Data Science', subtitle: 'Applied ML/AI, time series, spatial analysis, statistics, and data visualization' },
    { title: 'Bioinformatics', subtitle: 'metagenomics, sequence analysis, reproducible pipelines' },
    { title: 'Software', subtitle: 'packages, web tools, APIs, research workflows, data engineering' },
  ],
};

export const homeAnchorCards: HomeAnchorCard[] = [
  {
    id: 'contact',
    title: 'Get in touch',
    description:
      'Email is the simplest route for collaborations, research questions, or anything on the site that you want to discuss.',
    linkLabel: 'Send an email',
    linkHref: 'mailto:alejandro.fontal.92@gmail.com',
  },
  {
    id: 'projects',
    title: 'Projects & Code',
    description: 'Mostly open-source contributions in the form of dashboards, apps, and small systems.',
    linkLabel: 'Browse selected work',
    linkHref: '/projects',
  },
  {
    id: 'blog',
    title: 'Blog & Notebooks',
    description: 'Published blog posts with a mix of technical and non-technical content, often based on rendered Jupyter notebooks.',
    linkLabel: 'Read notebook essays',
    linkHref: '/blog',
  },
];

export const educationTimeline: EducationTimelineItem[] = [
  {
    degree: 'PhD in Biotechnology',
    institution: 'University of Barcelona',
    years: '2019 - 2024',
    focus: 'Computational epidemiology, atmospheric drivers of Kawasaki disease, and reproducible data workflows.',
  },
  {
    degree: 'MSc in Bioinformatics',
    subtitle: 'Data Science track',
    institution: 'Wageningen University & Research',
    years: '2016 - 2018',
    focus: 'Machine learning and scientific computing for biological systems.',
  },
  {
    degree: 'BSc in Molecular Biotechnology',
    institution: 'University of Barcelona',
    years: '2010 - 2015',
    focus: 'Foundations in molecular biology, systems thinking, and quantitative analysis.',
  },
];

export const interestTags = [
  'Machine Learning',
  'Wearable Technologies',
  'Health Analytics',
  'Metagenomics',
  'Self-hosting',
  'Open Science',
  'GIS & Geospatial Modeling',
];

export const blogPosts: BlogPost[] = [
  {
    title: 'Publishing notebooks with Astro and Quarto',
    description: 'How this site turns Jupyter notebooks into blog posts during the Astro build.',
    date: '2023-02-20',
    categories: ['Publishing', 'Blog'],
    image: firstPostFeatured,
    href: '/blog/first-post',
  },
];

export const projects: Project[] = [
  {
    title: 'Env. Data Japan',
    description: 'Toolkit for collecting, processing, and standardizing environmental datasets for Japan.',
    date: '2022-09-01',
    categories: ['Python', 'GIS', 'Data Mining'],
    image: tokyoSkylineImage,
    href: 'https://github.com/AlFontal/environmental-data-japan',
  },
  {
    title: 'Argos Extensions',
    description: 'Small menu-bar utilities for Argos on GNOME Shell, with xbar support for macOS.',
    date: '2022-06-01',
    categories: ['Python', 'Argos', 'xbar', 'API', 'Linux', 'MacOS'],
    image: argosExtensionsImage,
    href: 'https://github.com/AlFontal/argos-extensions',
  },
  {
    title: 'Sugarboard',
    description: 'Streamlit dashboard for exploring Nightscout CGM time series.',
    date: '2022-03-01',
    categories: ['Python', 'Streamlit', 'API', 'Data Visualisation', 'Dashboard'],
    image: sugarboardImage,
    href: 'https://github.com/AlFontal/sugarboard',
  },
  {
    title: 'AQI Stations Scraper',
    description: 'Selenium scraper scheduled with GitHub Actions to collect historical AQI station records.',
    date: '2021-07-01',
    categories: ['Python', 'Selenium', 'Scraping', 'Data Mining'],
    image: aqiStationsScraperImage,
    href: 'https://github.com/AlFontal/aqi-stations-scraper',
  },
  {
    title: 'SDCpy App',
    description: 'Dash interface for exploring scale-dependent correlation analysis interactively.',
    date: '2021-06-01',
    categories: ['Python', 'Time-Series Analysis', 'Dash', 'Heroku'],
    image: sdcpyAppImage,
    href: 'https://github.com/AlFontal/sdcpy-app',
  },
  {
    title: 'SDCpy',
    description: 'Python package for scale-dependent correlation analysis of time-series data.',
    date: '2021-04-01',
    categories: ['Python', 'Time-Series Analysis'],
    image: sdcpyImage,
    href: 'https://github.com/AlFontal/sdcpy',
  },
];

export const publications: Publication[] = [
  {
    title: 'Integrating air microbiome for comprehensive air quality analysis',
    authors:
      'Sofya Pozdniakova, Akira Uchida, Alejandro Fontal, Lidia Cañas, Samuel Santamaría, Lim Yee Hui, Irvan Luhung, Stephan C. Schuster, Xavier Rodó, Sílvia Borràs',
    publication: 'iScience',
    year: 2025,
    categories: ['Microbiology', 'Microbiome', 'Aerobiology', 'Environmental monitoring'],
    doi: 'https://doi.org/10.1016/j.isci.2025.113015',
    pdf: 'https://www.cell.com/action/showPdf?pii=S2589-0042%2825%2901276-3',
    code: 'https://github.com/AirLabBcn/aerobiome-integration-AQ',
  },
  {
    title:
      'Laser-Induced Fluorescence coupled with Machine Learning as an effective approach for real-time identification of bacteria in bioaerosols',
    authors: 'Alejandro Fontal, Sílvia Borràs, Sofya Pozdniakova, Lidia Cañas, Xavier Rodó',
    publication: 'Atmospheric Measurement Techniques',
    year: 2025,
    categories: ['Microbiology', 'Machine Learning', 'Laser-Induced Fluorescence', 'Aerobiology'],
    doi: 'https://doi.org/10.5194/amt-18-7297-2025',
    pdf: 'https://amt.copernicus.org/articles/18/7297/2025/amt-18-7297-2025.pdf',
    code: 'https://github.com/AlFontal/lif-bacteria-aerosols-ms',
  },
  {
    title:
      'Microbial richness and air chemistry in aerosols above the PBL confirm 2,000-km long-distance transport of potential human pathogens',
    authors:
      'Xavier Rodó, Sofya Pozdniakova, Sílvia Borràs, Atsushi Matsuki, Hiroshi Tanimoto, Maria-Pilar Armengol, Irina Pey, Laura Muñoz, Samuel Santamaría, Lidia Cañas, Josep-Anton Morguí, Alejandro Fontal, Roger Curcoll',
    publication: 'Proceedings of the National Academy of Sciences',
    year: 2024,
    categories: ['Microbiology', 'Metagenomics', 'Aerobiology', 'Infectious Diseases'],
    doi: 'https://doi.org/10.1073/pnas.2404191121',
    pdf: 'https://www.pnas.org/doi/pdf/10.1073/pnas.2404191121',
    code: 'https://github.com/AlFontal/microbial-richness-troposphere',
  },
  {
    title:
      'Sub-weekly signatures relate ultrafine aerosols enriched in metals from intensive farming and urban pollution to Kawasaki disease',
    authors:
      'Xavier Rodó, Albert Navarro-Gallinad, Tomoko Kojima, Josep-Anton Morguí, Sílvia Borràs, Alejandro Fontal',
    publication: 'Environmental Research Letters',
    year: 2023,
    categories: ['Kawasaki Disease', 'Time Series Analysis', 'Air Pollution & Health'],
    doi: 'https://doi.org/10.1088/1748-9326/acd798',
    pdf: 'https://iopscience.iop.org/article/10.1088/1748-9326/acd798/pdf',
    code: 'https://github.com/AlFontal/kd-metals-swc',
  },
  {
    title: 'Tracing Tokyo’s air sources to identify Kawasaki Disease’s etiological triggers',
    authors:
      'Alejandro Fontal, Sofya Pozdniakova, Sílvia Borràs, Lídia Cañas, Roger Curcoll, Josep-Anton Morguí, Atsushi Matsuki, Xavier Rodó',
    publication: 'International Vasculitis and ANCA Workshop',
    year: 2022,
    categories: ['Kawasaki Disease', 'Time Series Analysis', 'Atmospheric Processes', 'Conference'],
    doi: 'https://alfontal.github.io/vasculitis2022-conference/summary.html',
    code: 'https://alfontal.github.io/vasculitis2022-conference/kd_tokyo_air_sources.html',
  },
  {
    title: 'COVID-19 Pandemic Sets New Clues on the Transmission Pathways in Kawasaki Disease',
    authors: 'Xavier Rodó, Alejandro Fontal',
    publication: 'JAMA Network Open',
    year: 2021,
    categories: ['COVID-19', 'Kawasaki Disease', 'Epidemiology', 'Infectious Diseases'],
    doi: 'https://doi.org/10.1001/jamanetworkopen.2021.4624',
    pdf: 'https://jamanetwork.com/journals/jamanetworkopen/articlepdf/2778186/rod_2021_ic_210055_1617035383.10445.pdf',
  },
  {
    title: 'Climatic signatures in the different COVID-19 pandemic waves across both hemispheres',
    authors:
      'Alejandro Fontal, Menno J. Bouma, Adrià San José, Leonardo López, Mercedes Pascual, Xavier Rodó',
    publication: 'Nature Computational Science',
    year: 2021,
    categories: ['COVID-19', 'Time Series Analysis', 'Climate & Health', 'Infectious Diseases'],
    doi: 'https://doi.org/10.1038/s43588-021-00136-6',
    pdf: 'https://www.nature.com/articles/s43588-021-00136-6.pdf',
    code: 'https://github.com/AlFontal/covid-climate-signatures',
  },
  {
    title: 'Neural Networks for Subcellular Localization Prediction',
    authors: 'Alejandro Fontal',
    publication: 'Wageningen University & Research Thesis Repository',
    year: 2017,
    categories: ['Bioinformatics', 'Proteomics', 'Machine Learning'],
    pdf: 'https://edepot.wur.nl/429151',
  },
];
