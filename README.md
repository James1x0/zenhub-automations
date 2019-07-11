# Zenhub Automations Action

## What is this?
Waffle.io shut down in May '19 (RIP) and our organization quickly searched for an alternative. If we were going to pay for a solution, we wanted more features than waffle. After much user testing, we found Zenhub was the best fit for us but lacked the tight knit integration with github issues we loved so much.

![Heartbreak](https://user-images.githubusercontent.com/6146261/61071140-91b9b200-a3cd-11e9-8a16-8e84241293ef.png)

*My response to a Zenhub tweet (now deleted) that mentioned transferring waffle customers.*

This **Github action** built with a node docker container aims to add back some of that github issue functionality that waffle had:

- [x] New branches with issue numbers (ex. `feature/#123-test`) moves the referenced issues to a "in progress" column in your workspace and assigns the branch creator to the issue
- [x] New PRs moved to a "review" column
- [x] New PRs that use a branch reference or "closes" syntax also move the issue to "review".

- [ ] ~New PRs that use a branch reference or "closes" syntax link associated issues.~
❌ Unfortunately there is no Zenhub API to make this happen. Maybe in the future?

## YES! How do I use it?
It's a bit manual. This solution was implemented with the `Zenhub API` & `Github Actions`. You'll need to add a new github action to each zenhub-enabled repo you want to enable automation for.

### Prerequisites
- Zenhub API Key ([see zenhub authentication](https://github.com/ZenHubIO/API#authentication))
- Github Actions Access (GA is in beta right now and requires a sign up/opt in  [https://github.com/features/actions](https://github.com/features/actions))

### Create a github workflow
- Go to the settings tab in your repo, and click on the "secrets" link
- Add a new secret called `ZENHUB_API_KEY` and fill in the api key you've generated.
- Go to the actions tab in your repository
<img width="1044" alt="Screen Shot 2019-07-11 at 11 36 27 AM" src="https://user-images.githubusercontent.com/6146261/61072279-31783f80-a3d0-11e9-959f-203c0ed0e37d.png">
- Click the green "Create a new workflow" button
- Name the workflow whatever you want, and then click "Edit new file", paste in the following:

NOTE: See section below for `Getting your column IDs`. Also you can use the visual editor if you want, but here's a basic workflow file:
```
workflow "ZH Automation - PR" {
  resolves = ["zh_automations"]
  on = "pull_request"
}

action "zh_automations" {
  uses = "james1x0/zenhub-automations@master"
  secrets = ["GITHUB_TOKEN", "ZENHUB_API_KEY"]
  env = {
    PR_COLUMN = "[ID of column]"
    INPROG_COLUMN = "[ID of column]"
    REVIEW_COLUMN = "[ID of column]"
  }
}

workflow "ZH Automation - Branch" {
  on = "create"
  resolves = ["branch_zh_automations"]
}

action "branch_zh_automations" {
  uses = "james1x0/zenhub-automations@master"
  secrets = ["GITHUB_TOKEN", "ZENHUB_API_KEY"]
  env = {
    PR_COLUMN = "[ID of column]"
    REVIEW_COLUMN = "[ID of column]"
    INPROG_COLUMN = "[ID of column]"
  }
}
```
- After you have everything filled in, hit "start commit" at the top right and either commit directly on master or make a PR. Zenhub should now be automated for new PRs/branches!!!

### Getting your column IDs
You'll need the following IDs for functionality on Zenhub:
`PR_COLUMN` Where new PRs land
`REVIEW_COLUMN` Where issues land when referenced in a PR
`INPROG_COLUMN` Where issues land when referenced in a branch name

To get the column IDs:
- Open your Zenhub board in chromium
- Open devtools to the network panel (refresh page if needed)
- Filter requests to find the "board" api request
- In preview view, you should see a JSON object with the key "pipelines", expand that
- Find the column name you want, copy the `_id` key.

### Debugging
This action provides some debugging logs by default. See the actions tab in your repo after you've triggered an automation call.

## ☢️ Drawbacks
- Actions require some time to compile as they are compile=>call rather than a direct call API. This causes about a minute or two delay in automation actions
- Not supported by Zenhub - I'll try and help if you have issues
- If this messes up your board, I'm not responsible. It won't, but the previous still applies!
- If this stops working in the future, I may not be available. For now, we are using this on our own projects ;)
- Not tested with multi-workspaces
