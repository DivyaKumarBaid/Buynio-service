module.exports = {
  types: [
    {
      value: "build",
      name: "build:    Changes that affect the build system or external dependencies",
    },
    {
      value: "chore",
      name: "chore:    Other changes that don't modify src or test files",
    },
    {
      value: "ci",
      name: "ci:       Changes to our CI configuration files and scripts",
    },
    { value: "docs", name: "docs:     Documentation only changes" },
    { value: "feat", name: "feat:     A new feature" },
    { value: "fix", name: "fix:      A bug fix" },
    {
      value: "perf",
      name: "perf:     A code change that improves performance",
    },
    {
      value: "refactor",
      name: "refactor: A code change that neither fixes a bug nor adds a feature",
    },
    { value: "revert", name: "revert:   Reverts a previous commit" },
    {
      value: "style",
      name: "style:    Changes that do not affect the meaning of the code",
    },
    {
      value: "test",
      name: "test:     Adding missing tests or correcting existing tests",
    },
    { value: "bug", name: "bug:      A bug-related change" },
  ],

  // Override the default messages, defaults are in node_modules/cz-conventional-changelog.
  messages: {
    type: "Select the type of change that you're committing:",
    scope: "Denote the scope of this change (optional):",
    customScope: "Denote the scope of this change:",
    subject: "Write a short, imperative tense description of the change:\n",
    body: 'Provide a longer description of the change (optional). Use "|" to break new line:\n',
    breaking: "List any breaking changes (optional):\n",
    footer:
      "List any issues closed by this change (optional). E.g.: #31, #34:\n",
    confirmCommit: "Are you sure you want to proceed with the commit above?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  subjectLimit: 100,
};
