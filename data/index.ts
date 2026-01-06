
const commitData = [
    { day: 'Seg', commits: 12 },
    { day: 'Ter', commits: 8 },
    { day: 'Qua', commits: 15 },
    { day: 'Qui', commits: 10 },
    { day: 'Sex', commits: 20 },
    { day: 'Sáb', commits: 5 },
    { day: 'Dom', commits: 3 }
  ];

  const performanceData = [
    { month: 'Jan', commits: 120, prs: 15, reviews: 23 },
    { month: 'Fev', commits: 145, prs: 18, reviews: 28 },
    { month: 'Mar', commits: 180, prs: 22, reviews: 35 },
    { month: 'Abr', commits: 165, prs: 20, reviews: 30 },
    { month: 'Mai', commits: 200, prs: 25, reviews: 40 }
  ];

  const languageData = [
    { name: 'JavaScript', value: 45, color: '#f7df1e' },
    { name: 'TypeScript', value: 30, color: '#3178c6' },
    { name: 'Python', value: 15, color: '#3776ab' },
    { name: 'CSS', value: 10, color: '#264de4' }
  ];

  const allRepos = [
    { name: 'my-portfolio', stars: 24, forks: 5, language: 'React', updated: '2h atrás', status: 'active', issues: 3, prs: 2 },
    { name: 'api-service', stars: 8, forks: 2, language: 'Node.js', updated: '1 dia', status: 'active', issues: 5, prs: 1 },
    { name: 'ml-project', stars: 45, forks: 12, language: 'Python', updated: '3 dias', status: 'inactive', issues: 0, prs: 0 },
    { name: 'nextjs-blog', stars: 12, forks: 3, language: 'TypeScript', updated: '5h atrás', status: 'active', issues: 2, prs: 3 },
    { name: 'docker-setup', stars: 31, forks: 8, language: 'Shell', updated: '2 dias', status: 'active', issues: 1, prs: 0 },
    { name: 'react-components', stars: 67, forks: 15, language: 'React', updated: '1h atrás', status: 'active', issues: 8, prs: 4 },
    { name: 'data-analysis', stars: 19, forks: 4, language: 'Python', updated: '1 semana', status: 'inactive', issues: 0, prs: 0 },
    { name: 'mobile-app', stars: 53, forks: 11, language: 'React Native', updated: '3h atrás', status: 'active', issues: 6, prs: 2 }
  ];

  const issues = [
    { title: 'Fix login bug', repo: 'api-service', priority: 'high', time: '2h' },
    { title: 'Update dependencies', repo: 'my-portfolio', priority: 'medium', time: '1d' },
    { title: 'Add dark mode', repo: 'nextjs-blog', priority: 'low', time: '3d' }
  ];

  const goals = [
    { title: 'Fazer 100 commits este mês', current: 73, target: 100, type: 'commits', deadline: '10 dias' },
    { title: 'Contribuir para 3 projetos open source', current: 1, target: 3, type: 'contributions', deadline: '20 dias' },
    { title: 'Completar 20 code reviews', current: 15, target: 20, type: 'reviews', deadline: '5 dias' },
    { title: 'Resolver 30 issues', current: 22, target: 30, type: 'issues', deadline: '15 dias' }
  ];

  type ModalStates = 'export' | 'sync' | 'newRepo' | 'newGoal';

export { commitData, performanceData, languageData, allRepos, issues, goals };
export type { ModalStates };