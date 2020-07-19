import * as xml from "xml2js";
import { XmlCheckStyleRoot } from "./entity";
import { Issues, Issue } from "./issues";

export async function parse(value: string): Promise<Issues> {
    const root = (await xml.parseStringPromise(value)) as XmlCheckStyleRoot;
    if (root.checkstyle.file == undefined) {
        return { issues: [] };
    }
    const issues: Issue[] = [];

    for (const file of root.checkstyle.file) {
        if (file.error == undefined) {
            continue;
        }
        for (const element of file.error) {
            let id = element.$.source;
            if (id.startsWith("detekt.")) {
                id = id.slice(7, id.length);
            }
            issues.push({
                severity: element.$.severity,
                id: id,
            } as Issue);
        }
    }
    return { issues: issues };
}
