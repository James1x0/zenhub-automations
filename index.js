const { Toolkit } = require('actions-toolkit')

const tools = new Toolkit({
  event: [ 'issues', 'pull_requests' ]
});


console.log(tools.context.payload);
