const { Toolkit } = require('actions-toolkit'),
      { join } = require('path');

const tools = new Toolkit();

Toolkit.run(async tools => {
  const handlerRef = `${tools.context.event}.js`;

  tools.log.info(`Trying to load handler: "${handlerRef}"...`);

  try {
    var eventModule = require(`./lib/handlers/${handlerRef}`);
  } catch (e) {
    console.log(e)
    return tools.exit.success('Failed to load module for event. No action necessary.');
  }

  const moduleAction = eventModule[tools.context.payload.action] || eventModule[tools.context.payload.ref_type];

  console.log(tools.context.payload);

  if (!moduleAction) {
    return tools.exit.success('Failed to find sub handler. No action necessary.');
  }

  try {
    await moduleAction(tools);
  } catch (e) {
    return tools.exit.failure(`Failed to run event handler: ${e}`);
  }

  tools.exit.success('Executed event handler.');
});
