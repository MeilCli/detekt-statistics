import * as core from "@actions/core";
import * as glob from "@actions/glob";
import * as fs from "fs";
import * as git from "./git";
import { Config, readConfig } from "./config";
import { parse } from "./parse";
import { calculate } from "./calculate";
import { Data, readData, writeData, appendData } from "./data";
import { Report, writeReport } from "./report";
import { renderSeverity, renderData } from "./chart";
import { Issues } from "./issues";

async function run() {
    let config: Config;
    let mainBranch: string;
    let isInitialBranch: boolean;
    const issuesList: Issues[] = [];
    try {
        config = readConfig();
        mainBranch = await git.echoCurrentBranch();
        const globber = await glob.create(config.detektXmlFilePath, {
            followSymbolicLinks: config.detektXmlFilePathFollowSymbolicLinks,
        });
        for await (const file of globber.globGenerator()) {
            const issues = await parse(fs.readFileSync(file).toString());
            issuesList.push(issues);
        }
        isInitialBranch = await git.checkoutDataBranch(config);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        return;
    }
    let report: Report;
    let data: Data[];
    try {
        report = calculate(issuesList);
        data = readData(config);
        appendData(data, report);
        writeData(config, data);
        await git.commit(config, isInitialBranch);
        await git.pushDataBranch(config);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        return;
    } finally {
        await git.checkoutBranch(mainBranch);
    }
    try {
        writeReport(config, report);
        await renderSeverity(report, config.severityChartFilePath);
        if (config.dataChartFilePath != null) {
            await renderData(data, config.dataChartFilePath);
        }
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();
