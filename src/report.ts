import * as fs from "fs";
import { Config } from "./config";

export interface Report {
    severity: Map<string, number>;
    id: Map<string, number>;
}

export function writeReport(config: Config, report: Report) {
    const json = {
        severity: Array.from(report.severity.entries()),
        id: Array.from(report.id.entries()),
    };
    fs.writeFileSync(config.reportJsonFilePath, JSON.stringify(json, undefined, 4));

    const severity = toStringFromStringMap(report.severity);
    const id = toStringFromStringMap(report.id);

    let text = "";
    text += "--severity--\n";
    text += `${severity}\n`;
    text += "--id--\n";
    text += `${id}\n`;

    fs.writeFileSync(config.reportTextFilePath, text);
}

function toStringFromStringMap(map: Map<string, number>): string {
    const keys = Array.from(map.keys()).sort();
    let result = "";
    for (const key of keys) {
        const value = map.get(key) ?? 0;
        result += `${key}: ${value}\n`;
    }
    return result;
}
