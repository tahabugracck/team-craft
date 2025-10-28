const originalKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'PHP', 'Laravel',
    'Ruby', 'Rails', 'Go', 'Golang', 'Kotlin', 'Swift', 'Flutter', 'Dart', 'React Native',
    'HTML', 'CSS', 'Sass', 'Bootstrap', 'Tailwind',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'GCP', 'Terraform',
    'Git', 'GitHub', 'CI/CD', 'Jenkins', 'Linux', 'Bash', 'Scrum', 'Agile',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'Pandas', 'NumPy',
    'Cyber Security', 'Penetration Testing', 'Network Security',
    'DevOps', 'Siber Güvenlik', 'Makine Öğrenmesi'
];

const lowerCaseKeywords = originalKeywords.map(keyword => keyword.toLowerCase());

module.exports = { originalKeywords, lowerCaseKeywords };