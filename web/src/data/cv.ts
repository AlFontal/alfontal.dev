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
    summary: 'Internship focused on machine learning for empirical protein design.',
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
      'Expert (9+ years); primary language for package development, testing, and end-to-end analytical and ML work. Regularly use pandas, polars, statsmodels, scikit-learn, TensorFlow, PyTorch, plotnine, and FastAPI.',
  },
  {
    title: 'R',
    icon: 'simple-icons:r',
    details: 'Proficient with tidyverse and Bioconductor, with strong R/Python interoperability in statistical and bioinformatics workflows.',
  },
  {
    title: 'Linux + HPC',
    icon: 'material-symbols:terminal-rounded',
    details: 'Daily Linux user with scripting, remote systems, and HPC workflows using SLURM, Nextflow, and reproducible command-line pipelines.',
  },
  {
    title: 'Git + CI/CD',
    icon: 'fa6-brands:git-alt',
    details: 'Collaborative development, code review, and automated testing and deployment with GitHub Actions and GitLab CI/CD.',
  },
  {
    title: 'Web + APIs',
    icon: 'mdi:web',
    details: 'Development of lightweight web tools and REST services for research and data applications using HTML/CSS, JavaScript, and FastAPI.',
  },
  {
    title: 'Systems',
    icon: 'mdi:server',
    details:
      'Linux-based deployment for data and research applications, including containerized services, automation, secure remote access, and lightweight infrastructure.',
  },
];

export const cvLanguages: CvLanguage[] = [
  { name: 'Spanish', level: 'Native' },
  { name: 'Catalan', level: 'Native' },
  { name: 'English', level: 'C2 (Full professional)' },
  { name: 'Italian', level: 'Limited working proficiency' },
  { name: 'French', level: 'Limited working proficiency' },
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
