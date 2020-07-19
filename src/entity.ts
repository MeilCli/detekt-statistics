export interface XmlCheckStyleRoot {
    checkstyle: XmlCheckStyle;
}

export interface XmlCheckStyle {
    file: XmlFile[];
}

export interface XmlFile {
    error: XmlErrorRoot[];
}

export interface XmlErrorRoot {
    $: XmlError;
}

export interface XmlError {
    source: string;
    severity: string;
}
