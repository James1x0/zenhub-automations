const zh                           = require('../zh-client'),
      resolveIssueNumbers          = require('../resolve-issue-number'),
      { PR_COLUMN, REVIEW_COLUMN } = process.env;

exports.opened = async function handleOpenedPR (tools) {
  tools.log.info('Handling opened PR...');

  const failures = [],
        { payload } = tools.context;

  // Move PR to PR issue column specified by ENV var
  if (PR_COLUMN) {
    tools.log.info('ZH :: Moving opened PR...');
    try {
      await zh.issues.moveIssueBetweenPipelines(payload.repository.id, payload.number, {
        pipeline_id: PR_COLUMN,
        position: 'top'
      });
    } catch (e) {
      failures.push(e);
    }
  } else {
    tools.log.info('ZH :: Skipped moving opened PR because `PR_COLUMN` is undefined.');
  }

  // Move PR closes to REVIEW_COLUMN
  if (REVIEW_COLUMN) {
    let issueNumbers = resolveIssueNumbers(payload.pull_request.head.ref, body);

    for (let i = 0; i < issueNumbers.length; i++) {
      let issueNo = issueNumbers[i];

      try {
        await zh.issues.moveIssueBetweenPipelines(payload.repository.id, issueNo, {
          pipeline_id: REVIEW_COLUMN,
          position: 'top'
        });
      } catch (e) {
        failures.push(`Failed to move issue ${issueNo}: ${e}`);
      }
    }
  }

  if (failures.length) {
    throw new Error(`Failed to execute some actions: ${failures.map(x => x.message || x).join(', ')}`);
  }
};
