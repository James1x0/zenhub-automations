const zh = require('../zh-client'),
      { PR_COLUMN } = process.env;

exports.opened = async function handleOpenedPR (tools) {
  tools.log.info('Handling opened PR...');

  const failures = [],
        { payload } = tools.context;

  // Move PR to PR issue column specified by ENV var
  if (PR_COLUMN) {
    tools.log.info('ZH :: Moving opened PR...');
    try {
      let moveResult = await zh.issues.moveIssueBetweenPipelines(payload.repository.id, payload.number, {
        pipeline_id: PR_COLUMN,
        position: 'top'
      });

      console.log('move res', moveResult);
    } catch (e) {
      failures.push(e);
    }
  } else {
    tools.log.info('ZH :: Skipped moving opened PR because `PR_COLUMN` is undefined.');
  }

  if (failures.length) {
    throw new Error(`Failed to execute some actions: ${failures.map(x => x.message).join(', ')}`);
  }

  // TODO: the rest ;)
};
