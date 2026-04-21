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

export type HomePage = {
  eyebrow: string;
  quickPathsHeading: string;
  academicBackgroundHeading: string;
  academicBackgroundIntro: string;
  interestsHeading: string;
};

export type HomeAnchorCard = {
  id: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  icon: string;
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
  publishedOn?: string;
  categories: string[];
  doi?: string;
  pdf?: string;
  code?: string;
};

export type ProjectsPage = {
  seoTitle: string;
  description: string;
  kicker: string;
  title: string;
  intro: string;
  stats: {
    totalLabel: string;
    latestYearLabel: string;
    stackValue: string;
    stackLabel: string;
  };
  ctaLabel: string;
};

export type PublicationsPage = {
  seoTitle: string;
  description: string;
  kicker: string;
  title: string;
  intro: string;
  stats: {
    totalLabel: string;
    latestYearLabel: string;
    codeLabel: string;
  };
  links: {
    journal: string;
    pdf: string;
    code: string;
  };
};

export type BlogPage = {
  seoTitle: string;
  description: string;
  kicker: string;
  title: string;
  intro: string;
  stats: {
    totalLabel: string;
    notebookLabel: string;
    manualLabel: string;
  };
  featuredLabel: string;
  notebookLabel: string;
  manualLabel: string;
};

export type CvEducationItem = {
  degree: string;
  institution: string;
  date: string;
  location: string;
  details: string[];
};

export type CvExperienceItem = {
  role: string;
  organization: string;
  date: string;
  location: string;
  summary: string;
  highlights: string[];
  tags: string[];
};

export type CvSkillGroup = {
  title: string;
  icon: string;
  summary: string;
  details: string;
  keywords: string[];
};

export type CvLanguage = {
  name: string;
  level: string;
  notes?: string;
};

export type CvPage = {
  seoTitle: string;
  description: string;
  summary: string;
  skillsHeading: string;
  experienceHeading: string;
  detailsHeading: string;
  searchPlaceholder: string;
  skillsToggleLabel: {
    expand: string;
    collapse: string;
  };
  experienceVisibleLabel: {
    singular: string;
    plural: string;
  };
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
  availability: 'I’m a data scientist based in Barcelona, working mostly on health-adjacent, environmental, and omics data.\n See my CV for full professional background.',
  tagline:
    'I use this site as a sort of public portfolio, a place to share projects, writing, publications, and whatever I’m building or thinking about lately.',
  cards: [
    { title: 'Data Science', subtitle: 'Applied ML/AI, time series, spatial analysis, statistics, and data visualization' },
    { title: 'Bioinformatics', subtitle: 'Metagenomics, sequence analysis, reproducible pipelines' },
    { title: 'Software', subtitle: 'Packages, web tools, APIs, research workflows, data engineering' },
  ],
};

export const homePage: HomePage = {
  eyebrow: 'Data science · Bioinformatics · Scientific software',
  quickPathsHeading: 'Quick Paths',
  academicBackgroundHeading: 'Academic Background',
  academicBackgroundIntro: 'A quick overview of my educational journey.',
  interestsHeading: 'Interests',
};

export const homeAnchorCards: HomeAnchorCard[] = [
  {
    id: 'contact',
    title: 'Get in touch',
    description:
      'Email is the simplest route for collaborations, research questions, or anything you might want to reach out about.',
    linkLabel: 'Send an email',
    linkHref: 'mailto:alejandro.fontal.92@gmail.com',
    icon: 'fa6-solid:envelope',
  },
  {
    id: 'projects',
    title: 'Projects & Code',
    description: 'A collection of mostly open-source software projects, repositories, and code snippets that I have built over the years.',
    linkLabel: 'Browse selected work',
    linkHref: '/projects',
    icon: 'fa6-solid:terminal',
  },
  {
    id: 'blog',
    title: 'Blog & Writing',
    description: 'Published blog posts with a mix of technical and non-technical content, from research notes to coding experiments and reproducible notebooks.',
    linkLabel: 'Read the blog',
    linkHref: '/blog',
    icon: 'fa6-solid:book-open',
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
    years: '2011 - 2015',
    focus: 'Foundations in molecular biology, systems thinking, and quantitative analysis.',
  },
];

export const interestTags = [
  'Machine Learning',
  'Wearable Technologies',
  'Health Analytics',
  'T1D technology',
  'Metagenomics',
  'Self-hosting',
  'Open Science',
  'FOSS',
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

export const blogPage: BlogPage = {
  seoTitle: 'Blog',
  description: 'Research notes, coding experiments, and long-form technical posts.',
  kicker: 'Writing / coding / technical notes',
  title: 'Blog',
  intro: 'A mix of technical and non-technical writing, sometimes sharing reproducible code blocks.',
  stats: {
    totalLabel: 'published posts',
    notebookLabel: 'built from notebooks',
    manualLabel: 'written directly in Astro',
  },
  featuredLabel: 'Latest entry',
  notebookLabel: 'Notebook post',
  manualLabel: 'Astro article',
};

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

export const projectsPage: ProjectsPage = {
  seoTitle: 'Projects',
  description: 'Selected software and data projects.',
  kicker: 'Selected builds',
  title: 'Projects',
  intro: 'Open repositories and small systems spanning data workflows, automation, dashboards, and scientific interfaces.',
  stats: {
    totalLabel: 'selected repositories',
    latestYearLabel: 'most recent project year',
    stackValue: 'Python-first',
    stackLabel: 'with dashboards, GIS, scraping, and automation',
  },
  ctaLabel: 'View repository',
};

export const publications: Publication[] = [
  {
    title: 'Integrating air microbiome for comprehensive air quality analysis',
    authors:
      'Sofya Pozdniakova, Akira Uchida, Alejandro Fontal, Lidia Cañas, Samuel Santamaría, Lim Yee Hui, Irvan Luhung, Stephan C. Schuster, Xavier Rodó, Sílvia Borràs',
    publication: 'iScience',
    year: 2025,
    publishedOn: '2025-07-01',
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
    publishedOn: '2025-12-02',
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
    publishedOn: '2024-09-17',
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
    publishedOn: '2023-07-01',
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
    publishedOn: '2021-04-06',
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
    publishedOn: '2021-10-21',
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

export const publicationsPage: PublicationsPage = {
  seoTitle: 'Publications',
  description: 'Peer-reviewed articles, conference proceedings, and thesis work.',
  kicker: 'Peer-reviewed work',
  title: 'Publications',
  intro: 'Research output across epidemiology, aerobiology, microbiome work, and climate-health analysis.',
  stats: {
    totalLabel: 'listed publications',
    latestYearLabel: 'latest publication year',
    codeLabel: 'records with public code',
  },
  links: {
    journal: 'Link to journal',
    pdf: 'Open PDF',
    code: 'Code repository',
  },
};

export const cvPage: CvPage = {
  seoTitle: 'Alejandro Fontal, PhD',
  description: 'Experience, skills, and education for Alejandro Fontal.',
  summary:
    'Computational scientist working at the intersection of bioinformatics, epidemiology, and scientific software. I analyse complex biological and public health data, develop reproducible methods, and build tools that support research in practice.',
  skillsHeading: 'Development Skills',
  experienceHeading: 'Experience',
  detailsHeading: 'Education & Languages',
  searchPlaceholder: 'Search roles, organizations, highlights...',
  skillsToggleLabel: {
    expand: 'Expand all',
    collapse: 'Collapse all',
  },
  experienceVisibleLabel: {
    singular: 'role visible',
    plural: 'roles visible',
  },
};

export const cvHeader = {
  name: 'Alejandro Fontal, PhD',
  title: 'Data Science · Bioinformatics · Scientific Software',
  location: 'Barcelona, ES',
  email: 'alejandro.fontal.92@gmail.com',
  phone: '+34 623 107 939',
  website: 'https://alfontal.dev',
  linkedin: 'https://www.linkedin.com/in/alfontal',
  linkedinHandle: 'alfontal',
  github: 'https://github.com/AlFontal',
  githubHandle: 'AlFontal',
  gitlab: 'https://gitlab.com/AlFontal',
  gitlabHandle: 'AlFontal',
  orcid: 'https://orcid.org/0000-0003-1138-2158',
  orcidId: '0000-0003-1138-2158',
};

export const cvEducation: CvEducationItem[] = [
  {
    degree: 'PhD in Biotechnology',
    institution: 'Universitat de Barcelona',
    date: '2019 - 2024',
    location: 'Barcelona, ES',
    details: [
      'PhD focused on environmental determinants of disease onset, spatiotemporal modeling, and long-read aerobiome metagenomics.',
    ],
  },
  {
    degree: 'MSc in Bioinformatics',
    institution: 'Wageningen University & Research',
    date: '2016 - 2018',
    location: 'Wageningen, NL',
    details: [
      'Data Science minor with cum laude distinction.',
      'Thesis on interpretable deep learning for protein subcellular location prediction.',
    ],
  },
  {
    degree: 'BSc in Biotechnology',
    institution: 'Universitat de Barcelona',
    date: '2011 - 2015',
    location: 'Barcelona, ES',
    details: ['Thesis at the VHIR Bioinformatics Unit on meta-analysis of transcriptomics tools.'],
  },
];

export const cvExperience: CvExperienceItem[] = [
  {
    role: 'Postdoctoral Researcher · Data and Software Lead',
    organization: 'Climate & Health Program @ ISGlobal',
    date: 'Oct 2024 - Present',
    location: 'Barcelona, ES',
    summary: 'Leading software, data, and reproducibility infrastructure for climate-health and aerobiome research.',
    highlights: [
      'Lead software and data engineering for the group, building internal packages, web tools, and GitHub-based workflows for reproducible research.',
      'Build reproducible pipelines for long-read aerobiome metagenomics and link results to health outcomes.',
      'Repurpose a laser-based pollen detector for bacterial discrimination using fluorescence, light scattering, and supervised machine learning.',
    ],
    tags: ['Python', 'Dash', 'Metagenomics', 'Machine Learning', 'Data Engineering'],
  },
  {
    role: 'PhD Fellow · Early-Stage Researcher',
    organization: 'Climate & Health Program @ ISGlobal (HELICAL ITN)',
    date: 'Oct 2019 - Sep 2024',
    location: 'Barcelona, ES',
    summary: 'Developed computational methods and field workflows to connect atmospheric processes with infectious disease dynamics.',
    highlights: [
      'Developed time-series methods to quantify environmental signals in epidemics, including transient and lagged associations, multi-scale correlations, and phase-shift analyses.',
      'Integrated nationwide case data with climate reanalysis, remote sensing, GIS layers, and air-mass trajectories to study Kawasaki Disease, COVID-19, and influenza.',
      'Coordinated field sampling campaigns in Japan to characterize the biological and chemical composition of air masses.',
    ],
    tags: ['Time-Series', 'GIS', 'Epidemiology', 'Docker', 'Nextflow', 'Quarto', 'GitHub Actions', 'Web-dev'],
  },
  {
    role: 'Data Scientist',
    organization: 'Protein Engineering @ DuPont Industrial Biosciences',
    date: 'Oct 2018 - Sep 2019',
    location: 'Leiden, NL',
    summary: 'Embedded machine learning and reproducible pipelines into protein engineering workflows with wet-lab partners.',
    highlights: [
      'Integrated data-driven and machine-learning solutions into protein engineering workflows.',
      'Built and maintained reproducible bioinformatics and data pipelines.',
      'Partnered with wet-lab teams to design experiments and close the model-experiment loop, accelerating workflow automation.',
    ],
    tags: ['Machine Learning', 'Bioinformatics', 'Pipelines', 'R&D'],
  },
  {
    role: 'Data Science Intern',
    organization: 'DuPont Industrial Biosciences',
    date: 'Mar 2018 - Sep 2018',
    location: 'Leiden, NL',
    summary: 'Internship focused on machine learning for empirical protein design and model benchmarking.',
    highlights: [
      'Built, trained, and benchmarked deep learning models to predict enzyme performance from sequence and structure.',
    ],
    tags: ['PyTorch', 'TensorFlow', 'GANs', 'CNNs', 'LSTMs', 'GitLab CI/CD'],
  },
  {
    role: 'Assistant in MOOCs Development',
    organization: 'Educational Staff Development @ Wageningen University',
    date: 'Sep 2016 - Dec 2017',
    location: 'Wageningen, NL',
    summary: 'Produced assignments and technical support materials for large-scale online course delivery.',
    highlights: [
      'Developed assignments and technical content for 10+ edX MOOCs.',
      'Provided technical support across course development workflows.',
    ],
    tags: ['Education', 'Technical Writing', 'Course Production', 'Web-dev'],
  },
];

export const cvSkills: CvSkillGroup[] = [
  {
    title: 'Python',
    icon: 'fa6-brands:python',
    summary: 'Primary language · 9+ years',
    details:
      'Expert (9+ years); primary language for package development, testing, and end-to-end analytical and ML work. Regularly use pandas, polars, statsmodels, scikit-learn, TensorFlow, PyTorch, plotnine, and FastAPI.',
    keywords: ['Packages', 'ML', 'APIs'],
  },
  {
    title: 'R',
    icon: 'simple-icons:r',
    summary: 'Statistics and bioinformatics workflows',
    details: 'Proficient with tidyverse and Bioconductor, with strong R/Python interoperability in statistical and bioinformatics workflows.',
    keywords: ['tidyverse', 'Bioconductor', 'interop'],
  },
  {
    title: 'Linux + HPC',
    icon: 'material-symbols:terminal-rounded',
    summary: 'Daily shell, remote systems, and clusters',
    details: 'Daily Linux user with scripting, remote systems, and HPC workflows using SLURM, Nextflow, and reproducible command-line pipelines.',
    keywords: ['SLURM', 'Nextflow', 'CLI'],
  },
  {
    title: 'Git + CI/CD',
    icon: 'fa6-brands:git-alt',
    summary: 'Collaborative delivery and automated checks',
    details: 'Collaborative development, code review, and automated testing and deployment with GitHub Actions and GitLab CI/CD.',
    keywords: ['GitHub Actions', 'GitLab CI', 'review'],
  },
  {
    title: 'Web + APIs',
    icon: 'mdi:web',
    summary: 'Research-facing web tools and services',
    details: 'Development of lightweight web tools and REST services for research and data applications using HTML/CSS, JavaScript, and FastAPI.',
    keywords: ['FastAPI', 'JS', 'REST'],
  },
  {
    title: 'Systems',
    icon: 'mdi:server',
    summary: 'Deployment, containers, and remote ops',
    details:
      'Linux-based deployment for data and research applications, including containerized services, automation, secure remote access, and lightweight infrastructure.',
    keywords: ['Containers', 'Automation', 'SSH'],
  },
];

export const cvLanguages: CvLanguage[] = [
  { name: 'Spanish', level: 'Native' },
  { name: 'Catalan', level: 'Native' },
  { name: 'English', level: 'Fluent - C2' },
  { name: 'Italian', level: 'Conversational - B1' },
  { name: 'French', level: 'Limited working proficiency - A2' },
];

export const cvTagOrder = [
  'Python',
  'Machine Learning',
  'Metagenomics',
  'Time-Series',
  'GIS',
  'Epidemiology',
  'Data Engineering',
  'Docker',
  'Nextflow',
  'Quarto',
  'Web-dev',
  'GitHub Actions',
  'Bioinformatics',
  'R&D',
  'Education',
];
