// reference by https://github.com/SeanSobey/ChartjsNodeCanvas
import * as fs from "fs";
import { Chart, ChartConfiguration } from "chart.js";
import { createCanvas } from "canvas";
import { Report } from "./report";
import { Data } from "./data";

const width = 400;
const height = 400;

type Canvas = HTMLCanvasElement & {
    toBuffer(callback: (err: Error | null, result: Buffer) => void, mimeType?: string, config?: any): void;
};

class CanvasRenderService {
    constructor(private readonly width: number, private readonly height: number) {}

    private renderChart(configuration: ChartConfiguration): Chart {
        const canvas = createCanvas(this.width, this.height);
        configuration.options = configuration.options || {};
        configuration.options.responsive = false;
        configuration.options.animation = false as any;
        const context = canvas.getContext("2d");
        return new Chart(context, configuration);
    }

    public renderToBuffer(configuration: ChartConfiguration): Promise<Buffer> {
        const chart = this.renderChart(configuration);
        return new Promise<Buffer>((resolve, reject) => {
            if (!chart.canvas) {
                throw new Error("canvas is null");
            }
            const canvas = chart.canvas as Canvas;
            canvas.toBuffer((error: Error | null, buffer: Buffer) => {
                chart.destroy();
                if (error) {
                    return reject(error);
                }
                return resolve(buffer);
            }, "image/png");
        });
    }
}

export async function renderSeverity(report: Report, fileName: string) {
    const fatalCount = report.severity.get("fatal") ?? 0;
    const errorCount = report.severity.get("error") ?? 0;
    const warningCount = report.severity.get("warning") ?? 0;
    const infoCount = report.severity.get("info") ?? 0;

    const canvasRenderService = new CanvasRenderService(width, height);
    const configuration: ChartConfiguration = {
        type: "bar",
        data: {
            labels: ["Info", "Warning", "Error", "Fatal"],
            datasets: [
                {
                    data: [infoCount, warningCount, errorCount, fatalCount],
                    backgroundColor: [
                        "rgba(0, 255, 255, 0.2)",
                        "rgba(0, 128, 0, 0.2)",
                        "rgba(255, 0, 0, 0.2)",
                        "rgba(128, 0, 0, 0.2)",
                    ],
                    borderColor: [
                        "rgba(0, 255, 255, 1)",
                        "rgba(0, 128, 0, 1)",
                        "rgba(255, 0, 0, 1)",
                        "rgba(128, 0, 0, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                title: {
                    display: true,
                    font: {
                        size: 18,
                    },
                    text: "Severity",
                },
                legend: {
                    display: false,
                },
            },
        },
    };
    const image = await canvasRenderService.renderToBuffer(configuration);
    fs.writeFileSync(fileName, image);
}

export async function renderData(data: Data[], fileName: string) {
    const take = 10;
    const takeData = data.slice(0 <= data.length - take ? data.length - take : 0, data.length);
    const labels = takeData.map((x) => x.date);

    const canvasRenderService = new CanvasRenderService(width, height);
    const configuration: ChartConfiguration = {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "All",
                    borderColor: "rgba(35, 87, 177, 1)",
                    backgroundColor: "rgba(35, 87, 177, 0.2)",
                    tension: 0,
                    data: takeData.map((x) => x.all),
                },
                {
                    label: "Info",
                    borderColor: "rgba(0, 255, 255, 1)",
                    backgroundColor: "rgba(0, 255, 255, 0.2)",
                    tension: 0,
                    data: takeData.map((x) => x.info),
                },
                {
                    label: "Warning",
                    borderColor: "rgba(0, 128, 0, 1)",
                    backgroundColor: "rgba(0, 128, 0, 0.2)",
                    tension: 0,
                    data: takeData.map((x) => x.warning),
                },
                {
                    label: "Error",
                    borderColor: "rgba(255, 0, 0, 1)",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    tension: 0,
                    data: takeData.map((x) => x.error),
                },
                {
                    label: "Fatal",
                    borderColor: "rgba(128, 0, 0, 1)",
                    backgroundColor: "rgba(128, 0, 0, 0.2)",
                    tension: 0,
                    data: takeData.map((x) => x.fatal),
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                title: {
                    display: true,
                    font: {
                        size: 18,
                    },
                    text: "Transition",
                },
            },
        },
    };
    const image = await canvasRenderService.renderToBuffer(configuration);
    fs.writeFileSync(fileName, image);
}
