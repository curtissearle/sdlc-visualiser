import type { ToolCategory, ToolDefinition } from './types';

export const toolCatalog: Record<ToolCategory, ToolDefinition[]> = {
  scm: [
    { id: 'gitlab', name: 'GitLab', category: 'scm', vendor: 'GitLab Inc.', url: 'https://gitlab.com' },
    { id: 'github', name: 'GitHub', category: 'scm', vendor: 'GitHub / Microsoft', url: 'https://github.com' },
    { id: 'bitbucket', name: 'Bitbucket', category: 'scm', vendor: 'Atlassian', url: 'https://bitbucket.org' },
    { id: 'azure-repos', name: 'Azure Repos', category: 'scm', vendor: 'Microsoft', url: 'https://azure.microsoft.com/services/devops/repos/' },
    { id: 'aws-codecommit', name: 'AWS CodeCommit', category: 'scm', vendor: 'Amazon Web Services', url: 'https://aws.amazon.com/codecommit/' },
    { id: 'gitea', name: 'Gitea', category: 'scm', vendor: 'Gitea', url: 'https://gitea.io' },
    { id: 'gitbucket', name: 'GitBucket', category: 'scm', url: 'https://gitbucket.github.io' },
    { id: 'perforce-helix-core', name: 'Perforce Helix Core', category: 'scm', vendor: 'Perforce', url: 'https://www.perforce.com/products/helix-core' },
  ],
  ci: [
    { id: 'gitlab-ci', name: 'GitLab CI', category: 'ci', vendor: 'GitLab Inc.', url: 'https://docs.gitlab.com/ee/ci/' },
    { id: 'github-actions', name: 'GitHub Actions', category: 'ci', vendor: 'GitHub / Microsoft', url: 'https://github.com/features/actions' },
    { id: 'jenkins', name: 'Jenkins', category: 'ci', url: 'https://www.jenkins.io' },
    { id: 'circleci', name: 'CircleCI', category: 'ci', url: 'https://circleci.com' },
    { id: 'travis-ci', name: 'Travis CI', category: 'ci', url: 'https://www.travis-ci.com' },
    { id: 'azure-pipelines', name: 'Azure Pipelines', category: 'ci', vendor: 'Microsoft', url: 'https://azure.microsoft.com/services/devops/pipelines/' },
    { id: 'teamcity', name: 'TeamCity', category: 'ci', vendor: 'JetBrains', url: 'https://www.jetbrains.com/teamcity/' },
    { id: 'bitbucket-pipelines', name: 'Bitbucket Pipelines', category: 'ci', vendor: 'Atlassian', url: 'https://bitbucket.org/product/features/pipelines' },
    { id: 'bamboo', name: 'Bamboo', category: 'ci', vendor: 'Atlassian', url: 'https://www.atlassian.com/software/bamboo' },
    { id: 'buildkite', name: 'Buildkite', category: 'ci', url: 'https://buildkite.com' },
  ],
  cd: [
    { id: 'argocd', name: 'Argo CD', category: 'cd', url: 'https://argo-cd.readthedocs.io' },
    { id: 'spinnaker', name: 'Spinnaker', category: 'cd', url: 'https://spinnaker.io' },
    { id: 'fluxcd', name: 'Flux CD', category: 'cd', url: 'https://fluxcd.io' },
    { id: 'harness', name: 'Harness CD', category: 'cd', url: 'https://www.harness.io/products/continuous-delivery' },
    { id: 'octopus-deploy', name: 'Octopus Deploy', category: 'cd', url: 'https://octopus.com' },
    { id: 'codefresh', name: 'Codefresh', category: 'cd', url: 'https://codefresh.io' },
    { id: 'azure-release-pipelines', name: 'Azure Release Pipelines', category: 'cd', vendor: 'Microsoft', url: 'https://azure.microsoft.com/services/devops/pipelines/' },
    { id: 'spacelift', name: 'Spacelift', category: 'cd', url: 'https://spacelift.io' },
  ],
  observability: [
    { id: 'datadog', name: 'Datadog', category: 'observability', url: 'https://www.datadoghq.com' },
    { id: 'new-relic', name: 'New Relic', category: 'observability', url: 'https://newrelic.com' },
    { id: 'grafana', name: 'Grafana', category: 'observability', url: 'https://grafana.com' },
    { id: 'prometheus', name: 'Prometheus', category: 'observability', url: 'https://prometheus.io' },
    { id: 'sentry', name: 'Sentry', category: 'observability', url: 'https://sentry.io' },
    { id: 'honeycomb', name: 'Honeycomb', category: 'observability', url: 'https://www.honeycomb.io' },
    { id: 'elastic-apm', name: 'Elastic APM', category: 'observability', url: 'https://www.elastic.co/apm' },
    { id: 'splunk', name: 'Splunk Observability', category: 'observability', url: 'https://www.splunk.com' },
    { id: 'dynatrace', name: 'Dynatrace', category: 'observability', url: 'https://www.dynatrace.com' },
    { id: 'aws-cloudwatch', name: 'Amazon CloudWatch', category: 'observability', vendor: 'Amazon Web Services', url: 'https://aws.amazon.com/cloudwatch/' },
    { id: 'azure-application-insights', name: 'Azure Application Insights', category: 'observability', vendor: 'Microsoft', url: 'https://azure.microsoft.com/services/monitor/' },
  ],
  'issue-tracking': [
    { id: 'jira', name: 'Jira', category: 'issue-tracking', vendor: 'Atlassian', url: 'https://www.atlassian.com/software/jira' },
    { id: 'linear', name: 'Linear', category: 'issue-tracking', url: 'https://linear.app' },
    { id: 'youtrack', name: 'YouTrack', category: 'issue-tracking', vendor: 'JetBrains', url: 'https://www.jetbrains.com/youtrack/' },
    { id: 'azure-boards', name: 'Azure Boards', category: 'issue-tracking', vendor: 'Microsoft', url: 'https://azure.microsoft.com/services/devops/boards/' },
    { id: 'github-issues', name: 'GitHub Issues', category: 'issue-tracking', vendor: 'GitHub / Microsoft', url: 'https://github.com' },
    { id: 'clickup', name: 'ClickUp', category: 'issue-tracking', url: 'https://clickup.com' },
    { id: 'shortcut', name: 'Shortcut', category: 'issue-tracking', url: 'https://shortcut.com' },
    { id: 'trello', name: 'Trello', category: 'issue-tracking', vendor: 'Atlassian', url: 'https://trello.com' },
    { id: 'asana', name: 'Asana', category: 'issue-tracking', url: 'https://asana.com' },
    { id: 'monday', name: 'Monday.com', category: 'issue-tracking', url: 'https://monday.com' },
  ],
  'feature-flags': [
    { id: 'launchdarkly', name: 'LaunchDarkly', category: 'feature-flags', url: 'https://launchdarkly.com' },
    { id: 'split', name: 'Split', category: 'feature-flags', url: 'https://www.split.io' },
    { id: 'unleash', name: 'Unleash', category: 'feature-flags', url: 'https://www.getunleash.io' },
    { id: 'flagsmith', name: 'Flagsmith', category: 'feature-flags', url: 'https://www.flagsmith.com' },
    { id: 'toggler', name: 'Toggler', category: 'feature-flags' },
    { id: 'optimizely-rollouts', name: 'Optimizely Rollouts', category: 'feature-flags', url: 'https://www.optimizely.com' },
    { id: 'configcat', name: 'ConfigCat', category: 'feature-flags', url: 'https://configcat.com' },
    { id: 'harness-feature-flags', name: 'Harness Feature Flags', category: 'feature-flags', url: 'https://www.harness.io/products/feature-flags' },
  ],
  infra: [
    { id: 'terraform', name: 'Terraform', category: 'infra', vendor: 'HashiCorp', url: 'https://www.terraform.io' },
    { id: 'pulumi', name: 'Pulumi', category: 'infra', url: 'https://www.pulumi.com' },
    { id: 'cloudformation', name: 'AWS CloudFormation', category: 'infra', vendor: 'Amazon Web Services', url: 'https://aws.amazon.com/cloudformation/' },
    { id: 'crossplane', name: 'Crossplane', category: 'infra', url: 'https://www.crossplane.io' },
    { id: 'ansible', name: 'Ansible', category: 'infra', vendor: 'Red Hat', url: 'https://www.ansible.com' },
    { id: 'aws-cdk', name: 'AWS CDK', category: 'infra', vendor: 'Amazon Web Services', url: 'https://aws.amazon.com/cdk/' },
    { id: 'chef', name: 'Chef', category: 'infra', url: 'https://www.chef.io' },
    { id: 'puppet', name: 'Puppet', category: 'infra', url: 'https://www.puppet.com' },
    { id: 'saltstack', name: 'SaltStack', category: 'infra', url: 'https://www.saltproject.io' },
  ],
  qa: [
    { id: 'cypress', name: 'Cypress', category: 'qa', url: 'https://www.cypress.io' },
    { id: 'playwright', name: 'Playwright', category: 'qa', url: 'https://playwright.dev' },
    { id: 'selenium', name: 'Selenium', category: 'qa', url: 'https://www.selenium.dev' },
    { id: 'postman', name: 'Postman', category: 'qa', url: 'https://www.postman.com' },
    { id: 'k6', name: 'k6', category: 'qa', url: 'https://k6.io' },
    { id: 'jmeter', name: 'Apache JMeter', category: 'qa', url: 'https://jmeter.apache.org' },
    { id: 'gatling', name: 'Gatling', category: 'qa', url: 'https://gatling.io' },
    { id: 'testcafe', name: 'TestCafe', category: 'qa', url: 'https://testcafe.io' },
  ],
  other: [
    { id: 'sonarqube', name: 'SonarQube', category: 'other', url: 'https://www.sonarsource.com/products/sonarqube/' },
    { id: 'artifactory', name: 'JFrog Artifactory', category: 'other', url: 'https://jfrog.com/artifactory/' },
    { id: 'nexus-repo', name: 'Nexus Repository', category: 'other', url: 'https://www.sonatype.com/products/sonatype-nexus-repository' },
    { id: 'backstage', name: 'Backstage', category: 'other', url: 'https://backstage.io' },
    { id: 'snyk', name: 'Snyk', category: 'other', url: 'https://snyk.io' },
    { id: 'black-duck', name: 'Black Duck', category: 'other', url: 'https://www.synopsys.com/software-integrity/security-testing/software-composition-analysis.html' },
    { id: 'whitesource', name: 'WhiteSource', category: 'other', url: 'https://www.mend.io' },
  ],
};

export const toolById: Record<string, ToolDefinition> = Object.values(toolCatalog).flat().reduce(
  (acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  },
  {} as Record<string, ToolDefinition>
);

export function getToolById(id: string | undefined): ToolDefinition | undefined {
  if (!id) return undefined;
  return toolById[id];
}


