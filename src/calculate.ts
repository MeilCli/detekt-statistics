import { Issues } from "./issues";
import { Report } from "./report";

export function calculate(value: Issues[]): Report {
    const severity = new Map<string, number>();
    const id = new Map<string, number>();

    for (const issues of value) {
        for (const issue of issues.issues) {
            const severityValue = severity.get(issue.severity);
            if (severityValue != undefined) {
                severity.set(issue.severity, severityValue + 1);
            } else {
                severity.set(issue.severity, 1);
            }

            const idValue = id.get(issue.id);
            if (idValue != undefined) {
                id.set(issue.id, idValue + 1);
            } else {
                id.set(issue.id, 1);
            }
        }
    }

    return { severity: severity, id: id };
}
