import * as fs from "fs";
import { Config } from "./config";
import { Report } from "./report";

interface DataRoot {
    data: Data[];
}

export interface Data {
    date: string;
    all: number;
    info: number;
    warning: number;
    error: number;
    fatal: number;
}

export function readData(config: Config): Data[] {
    if (config.dataJsonFilePath == null) {
        return [];
    }
    if (fs.existsSync(config.dataJsonFilePath)) {
        const dataRoot = JSON.parse(fs.readFileSync(config.dataJsonFilePath).toString()) as DataRoot;
        return dataRoot.data;
    } else {
        return [];
    }
}

export function writeData(config: Config, data: Data[]) {
    if (config.dataJsonFilePath == null) {
        return;
    }
    const dataRoot: DataRoot = { data: data };
    fs.writeFileSync(config.dataJsonFilePath, JSON.stringify(dataRoot, undefined, 4));
}

export function appendData(data: Data[], report: Report) {
    const date = new Date();
    const dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    const info = report.severity.get("info") ?? 0;
    const warning = report.severity.get("warning") ?? 0;
    const error = report.severity.get("error") ?? 0;
    const fatal = report.severity.get("fatal") ?? 0;
    const all = info + warning + error + fatal;
    data.push({ date: dateString, all: all, info: info, warning: warning, error: error, fatal: fatal });
}
