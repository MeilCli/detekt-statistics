# detekt-statistics
![CI](https://github.com/MeilCli/detekt-statistics/workflows/CI/badge.svg)  
Generate [detekt](https://github.com/detekt/detekt) statistics action

This action generate some chart image and report file:
|data transition|severity|
|:--:|:--:|
|![](/images/data.png)|![](/images/severity.png)|

## Required
- This action can execute only linux runner

## Example
Simple example your android project repository, using [MeilCli/slack-upload-file](https://github.com/MeilCli/slack-upload-file) to notify slack
```yaml
name: CI

on:
  workflow_dispatch:

jobs:
  detekt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Grant permission
        run: chmod +x gradlew
      - name: Run detekt
        run: ./gradlew detekt
      - uses: MeilCli/detekt-statistics@v1
        with:
          detekt_xml_file_path: 'reports/detekt/**/**.xml' # change your detekt result path
      - uses: MeilCli/slack-upload-file@v1
        with:
          slack_token: ${{ secrets.SLACK_TOKEN }}
          channels: ${{ secrets.SLACK_CHANNELS }}
          file_path: 'report.txt'
          file_name: 'report.txt'
          file_type: 'text' 
      - uses: MeilCli/slack-upload-file@v1
        with:
          slack_token: ${{ secrets.SLACK_TOKEN }}
          channels: ${{ secrets.SLACK_CHANNELS }}
          file_path: 'data.png'
          file_name: 'data.png'
          file_type: 'png'
      - uses: MeilCli/slack-upload-file@v1
        with:
          slack_token: ${{ secrets.SLACK_TOKEN }}
          channels: ${{ secrets.SLACK_CHANNELS }}
          file_path: 'severity.png'
          file_name: 'severity.png'
          file_type: 'png'
```
You can also pin to a [specific release](https://github.com/MeilCli/detekt-statistics/releases) version in the format `@v1.x.x`

## Input
- `repository`
  - required
  - running repository, format: owner/repository
  - default: `${{ github.repository }}`
- `github_token`
  - required
  - github token, using to push data branch
  - default: `${{ github.token }}`
- `detekt_xml_file_path`
  - required
  - detekt reported xml file paths, enable glob pattern
- `detekt_xml_file_path_follow_symbolic_links`
  - required
  - detekt reported xml file paths glob pattern's follow symbolic links option
  - value: `true` or `false`
  - default: `false`
- `data_branch`
  - the saving data branch, this branch is created by this action. if want disable this feature, put empty string
  - default: `data/detekt`
- `data_commit_user`
  - the saving data commit user
  - default: `github-action`
- `data_commit_email`
  - the saving data commit user's email
  - default: `41898282+github-actions[bot]@users.noreply.github.com`
- `data_json_file_path`
  - the saving data json file path, this file is created at data branch
  - default: `data.json`
- `data_chart_file_path`
  - the data transition chart png image path, this file is created at your checkouted branch
  - default: `data.png`
- `severity_chart_file_path`
  - required
  - the severity chart png image path, this file is created at your checkouted branch
  - default: `severity.png`
- `report_json_file_path`
  - required
  - the report json file path, this file is created at your checkouted branch
  - default: `report.json`
- `report_text_file_path`
  - required
  - the report text file path, this file is created at your checkouted branch
  - default: `report.txt`

## Attention!
This action auto create *data branch* and auto commit and push, because to create data transition chart image. Plese see `data_branch` input option

## How execute windows or mac runner?
This action can execute only linux runner because [@zeit/ncc](https://github.com/vercel/ncc) aggregate node-canvas's binary. So, if you execute other runner, you do fork this repository and do `npm run build && npm run pack` on your runner.

## How to run in a different repository than the target repository
In my case, double checkout repository on monitoring repository.

- target repository: [Librarian](https://github.com/MeilCli/Librarian)
- monitoring repository: [Librarian-monitoring](https://github.com/MeilCli/Librarian-monitoring)

simple example:
```yaml
name: CI

on:
  workflow_dispatch:

jobs:
  detekt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/checkout@v2
        with:
          repository: 'MeilCli/Librarian'
          ref: 'master'
          path: 'Librarian'
      - uses: actions/setup-java@v1
        with:
          java-version: 1.8
      - name: Grant permission
        run: chmod +x Librarian/gradlew
      - name: Run detekt
        run: cd Librarian && ./gradlew detekt
      - uses: MeilCli/detekt-statistics@v1
        with:
          detekt_xml_file_path: 'Librarian/reports/detekt/**/**.xml'
      # generate paths:
      # - report.txt
      # - report.json
      # - data.png
      # - severity.png
```

## Contributing
see [Contributing.md](./.github/CONTRIBUTING.md)

## License
MIT License

### Using
- [actions/toolkit](https://github.com/actions/toolkit), published by [MIT License](https://github.com/actions/toolkit/blob/master/LICENSE.md)
- [Automattic/node-canvas](https://github.com/Automattic/node-canvas), published by MIT License
- [chartjs/Chart.js](https://github.com/chartjs/Chart.js), published by [MIT License](https://github.com/chartjs/Chart.js/blob/master/LICENSE.md)
- [Leonidas-from-XIV/node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js), published by [MIT License](https://github.com/Leonidas-from-XIV/node-xml2js/blob/master/LICENSE)