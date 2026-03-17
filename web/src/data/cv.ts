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
  summary?: string;
  highlights: string[];
  tags: string[];
};

export type CvSkillGroup = {
  title: string;
  icon: string;
  details: string;
};

export type CvLanguage = {
  name: string;
  level: string;
  notes?: string;
};

export const cvHeader = {
  name: 'Alejandro Fontal',
  title: 'Research Data Scientist',
  location: 'Barcelona, ES',
  email: 'alejandrofontal92@gmail.com',
  phone: '+34 623 090 672',
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
      'Thesis in data science applied to epidemiology, metagenomics, and climate-health interactions.',


    ],
  },
  {
    degree: 'MSc in Bioinformatics',
    institution: 'Wageningen University & Research',
    date: '2016 - 2018',
    location: 'Wageningen, NL',
    details: [
      'Data Science minor with cum laude distinction.',
      'Thesis on explainable deep learning models for protein subcellular location prediction.',
    ],
  },
  {
    degree: 'BSc in Biotechnology',
    institution: 'Universitat de Barcelona',
    date: '2011 - 2015',
    location: 'Barcelona, ES',
    details: ['Thesis at the Bioinformatics unit of VHIR on meta-analysis of transcriptomics tools.'],
  },
];

export const cvExperience: CvExperienceItem[] = [
  {
    role: 'Post-doctoral Researcher',
    organization: 'Climate & Health Program @ ISGlobal',
    date: 'Oct 2024 - Present',
    location: 'Barcelona, ES',
    highlights: [
      'Software and data engineering lead for research workflows, including package and dashboard development.',
      'Building reproducible pipelines for long-read aerobiome metagenomics linked to health outcomes.',
      'Repurposing pollen detection instrumentation for bacterial discrimination using laser-induced fluorescence and supervised ML.',
    ],
    tags: ['Python', 'Dash', 'Metagenomics', 'Machine Learning', 'Data Engineering'],
  },
  {
    role: 'PhD Fellow - Early Stage Researcher (ESR)',
    organization: 'Climate & Health Program @ ISGlobal (HELICAL ITN)',
    date: 'Oct 2019 - Oct 2024',
    location: 'Barcelona, ES',
    summary: 'Marie Sklodowska-Curie Actions ESR within HELICAL ITN.',
    highlights: [
      'Developed time-series methods for transient/lagged effects, multi-scale correlations, and phase-shift analyses in epidemics.',
      'Integrated nationwide case data with climate reanalysis, remote sensing, GIS layers, and air-mass trajectories.',
      'Coordinated in-situ sampling campaigns in Japan to characterize biological and chemical air-mass fractions.',
    ],
    tags: ['Time-Series', 'GIS', 'Epidemiology', 'Docker', 'Nextflow', 'Quarto', 'GitHub Actions', 'Web-dev'],
  },
  {
    role: 'Data Scientist',
    organization: 'Protein Engineering @ DuPont Industrial Biosciences',
    date: 'Sep 2018 - Aug 2019',
    location: 'Leiden, NL',
    highlights: [
      'Integrated data-driven and ML solutions into protein engineering workflows.',
      'Built and maintained reproducible bioinformatics and data pipelines.',
      'Partnered with wet-lab teams to close the model-experiment loop and accelerate workflow automation.',
    ],
    tags: ['Machine Learning', 'Bioinformatics', 'Pipelines', 'R&D'],
  },
  {
    role: 'Graduate Trainee in Data Science',
    organization: 'DuPont Industrial Biosciences',
    date: 'Mar 2018 - Sep 2018',
    location: 'Leiden, NL',
    summary: 'MSc internship project: ML for empirical protein design.',
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
    details:
      'High proficiency (9+ years): package development/testing and end-to-end data science with pandas, polars, statsmodels, scikit-learn, tensorflow, pytorch, plotnine, and dash.',
  },
  {
    title: 'R',
    icon: 'simple-icons:r',
    details: 'Experienced with tidyverse (ggplot2, dplyr) and Bioconductor in polyglot R/Python workflows.',
  },
  {
    title: 'Shell + HPC',
    icon: 'material-symbols:terminal-rounded',
    details: 'Daily Linux user with HPC pipelines using SLURM and Nextflow.',
  },
  {
    title: 'Git + CI/CD',
    icon: 'fa6-brands:git-alt',
    details: 'Collaborative development with GitHub Actions and GitLab CI/CD.',
  },
  {
    title: 'Web-dev',
    icon: 'mdi:web',
    details:
      'Builds responsive web apps and scientific interfaces with Astro, Quarto, HTML/CSS, JavaScript, and dashboard-oriented UX patterns.',
  },
  {
    title: 'Systems',
    icon: 'mdi:server',
    details:
      'Maintains Linux servers; Docker behind nginx/Traefik with Let\'s Encrypt, SSH/user operations, cron/systemd automation, and WireGuard VPN.',
  },
];

export const cvLanguages: CvLanguage[] = [
  { name: 'Spanish', level: 'Native' },
  { name: 'Catalan', level: 'Native' },
  { name: 'English', level: 'C2 (Proficient)'},
  { name: 'Italian', level: 'B2 (Upper-Intermediate)'},
  { name: 'Dutch', level: 'A1/2'},
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
