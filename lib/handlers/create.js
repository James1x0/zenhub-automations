const zh                  = require('../zh-client'),
      resolveIssueNumbers = require('../resolve-issue-number'),
      { INPROG_COLUMN }   = process.env;

exports.branch = async function handleCreatedBranch (tools) {
  tools.log.info('Handling created branch...');

  const failures = [],
        { payload } = tools.context;

  let issueNumbers = resolveIssueNumbers(payload.ref);

  if (!issueNumbers || issueNumbers.length < 1) {
    return tools.exit.neutral('No issues detected to act upon.');
  }

  for (let i = 0; i < issueNumbers.length; i++) {
    let issueNo = issueNumbers[i];

    // Assign sender to issue(s)
    try {
      tools.log.info(`Adding assignees for #${issueNo}...`);

      await tools.github.issues.issues.addAssignees({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: issueNo,
        assignees: [ payload.sender.login ]
      });

      tools.log.info(`Added assignees for #${issueNo}.`);
    } catch (e) {
      failures.push(`Failed to added assignees for #${issueNo}: ${e}`);
    }

    // Move issue(s) to INPROG_COLUMN
    if (INPROG_COLUMN) {
      try {
        tools.log.info(`Moving issue #${issueNo} to in progress...`);

        await zh.issues.moveIssueBetweenPipelines(payload.repository.id, issueNo, {
          pipeline_id: INPROG_COLUMN,
          position: 'top'
        });

        tools.log.info(`Moved #${issueNo} to in progress.`);
      } catch (e) {
        failures.push(`Failed to move #${issueNo} to in progress: ${e}`);
      }
    }
  }

  if (failures.length) {
    throw new Error(`Failed to execute some actions: ${failures.map(x => x.message || x).join(', ')}`);
  }
};
