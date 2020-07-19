import * as core from "@actions/core";

export interface Config {
    /**
     * owner and repository
     */
    repository: string;
    githubToken: string;
    detektXmlFilePath: string;
    detektXmlFilePathFollowSymbolicLinks: boolean;
    dataBranch: string | null;
    dataCommitUser: string | null;
    dataCommitEmail: string | null;
    dataJsonFilePath: string | null;
    dataChartFilePath: string | null;
    severityChartFilePath: string;
    reportJsonFilePath: string;
    reportTextFilePath: string;
}

export function readConfig(): Config {
    return {
        repository: getInput("repository"),
        githubToken: getInput("github_token"),
        detektXmlFilePath: getInput("detekt_xml_file_path"),
        detektXmlFilePathFollowSymbolicLinks: getInput("detekt_xml_file_path_follow_symbolic_links") == "true",
        dataBranch: getInputOrNull("data_branch"),
        dataCommitUser: getInputOrNull("data_commit_user"),
        dataCommitEmail: getInputOrNull("data_commit_email"),
        dataJsonFilePath: getInputOrNull("data_json_file_path"),
        dataChartFilePath: getInputOrNull("data_chart_file_path"),
        severityChartFilePath: getInput("severity_chart_file_path"),
        reportJsonFilePath: getInput("report_json_file_path"),
        reportTextFilePath: getInput("report_text_file_path"),
    };
}

function getInputOrNull(key: string): string | null {
    const result = core.getInput(key, { required: false });
    if (result.length == 0) {
        return null;
    }
    return result;
}

function getInput(key: string): string {
    return core.getInput(key, { required: true });
}
