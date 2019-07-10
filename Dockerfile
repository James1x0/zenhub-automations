FROM node:slim

LABEL "com.github.actions.name"="Zenhub Automations"
LABEL "com.github.actions.description"="Automate zenhub with ease"
# Here are all of the available icons: https://feathericons.com/
LABEL "com.github.actions.icon"="move"
# And all of the available colors: https://developer.github.com/actions/creating-github-actions/creating-a-docker-container/#label
LABEL "com.github.actions.color"="gray-dark"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]
