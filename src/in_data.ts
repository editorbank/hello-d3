import { DataItem } from './polymatica/data';
import { DataSettings, SingleData, ViewSettings, Widget } from './polymatica/widget';

export declare class SamplePolymaticaWidget extends Widget implements SingleData {
    data: DataItem[];
    dataSettings: DataSettings;
    onChange(): void;
    viewSettings: ViewSettings;
}

var samplePolymaticaWidget = {
    data: [
        {
            "col_0": "Начало",
            "col_1": "Красный",
            "col_2": 2
        },
        {
            "col_0": "Красный",
            "col_1": "Конец",
            "col_2": 1
        },
        {
            "col_0": "Красный",
            "col_1": "Синий",
            "col_2": 1
        },
        {
            "col_0": "Начало",
            "col_1": "Конец",
            "col_2": 3
        },
        {
            "col_0": "Начало",
            "col_1": "Зелёный",
            "col_2": 2
        },
        {
            "col_0": "Зелёный",
            "col_1": "Конец",
            "col_2": 1
        },
        {
            "col_0": "Зелёный",
            "col_1": "Синий",
            "col_2": 1
        },
        {
            "col_0": "Начало",
            "col_1": "Синий",
            "col_2": 5
        },
        {
            "col_0": "Синий",
            "col_1": "Конец",
            "col_2": 7
        }
    ],
    dataSettings: {
        "columns": [
            {// @ts-ignore
                "type": "string",
                "id": 0,
                "path": "col_0",
                "name": "from"
            },
            {// @ts-ignore
                "type": "string",
                "id": 1,
                "path": "col_1",
                "name": "to"
            },
            {// @ts-ignore
                "type": "number",
                "id": 2,
                "path": "col_2",
                "name": "flow"
            }
        ],
        "columnsByBlock": {
            "FROM": [
                {// @ts-ignore
                    "type": "string",
                    "id": 0,
                    "path": "col_0",
                    "name": "from"
                }
            ],
            "TO": [
                {// @ts-ignore
                    "type": "string",
                    "id": 1,
                    "path": "col_1",
                    "name": "to"
                }
            ],
            "FLOW": [
                {// @ts-ignore
                    "type": "number",
                    "id": 2,
                    "path": "col_2",
                    "name": "flow"
                }
            ]
        },
        // @ts-ignore
        "filters": [],
        // @ts-ignore
        "sort": [],
        // @ts-ignore
        "colorize": [],
        "total": 9,
        "limit": 0,
        "offset": 0,
        "events": {}
    },

    viewSettings: {
        "colorMode": "gradient",
        "_TextColor": "gray",
        "_TextSize": "20",
        "_TextFamily": "Arial",
        "_TextStyle": "normal",
        "preferredFlowOverlap": "max",
        "_NodesBorderValue": "1",
        "_NodesBorderColor": "transparent"
    },

    theme: {
        "colors": [
            "#00afd7",
            "#10069f",
            "#1857f0",
            "#c724b1",
            "#fedb00",
            "#ff9900",
            "#78d64b",
            "#0c83e4",
            "#8a1f7a",
            "#e45d2b",
            "#f5c7d1",
            "#0e0f7d",
            "#ed6881",
            "#70b5ec",
            "#d76bc8",
            "#6f6cc3"
        ],
        "colorize": [
            [
                "rgba(7,195,178,0.1)",
                "rgba(7,195,178,0.2)",
                "rgba(7,195,178,0.3)",
                "rgba(7,195,178,0.4)",
                "rgba(7,195,178,0.5)",
                "rgba(7,195,178,0.6)",
                "rgba(7,195,178,0.7)",
                "rgba(7,195,178,0.8)",
                "rgba(7,195,178,0.9)",
                "rgba(7,195,178,1)"
            ],
            [
                "rgba(3,207,207,0.1)",
                "rgba(3,207,207,0.2)",
                "rgba(3,207,207,0.3)",
                "rgba(3,207,207,0.4)",
                "rgba(3,207,207,0.5)",
                "rgba(3,207,207,0.6)",
                "rgba(3,207,207,0.7)",
                "rgba(3,207,207,0.8)",
                "rgba(3,207,207,0.9)",
                "rgba(3,207,207,1)"
            ],
            [
                "rgba(8,108,108,0.1)",
                "rgba(8,108,108,0.2)",
                "rgba(8,108,108,0.3)",
                "rgba(8,108,108,0.4)",
                "rgba(8,108,108,0.5)",
                "rgba(8,108,108,0.6)",
                "rgba(8,108,108,0.7)",
                "rgba(8,108,108,0.8)",
                "rgba(8,108,108,0.9)",
                "rgba(8,108,108,1)"
            ],
            [
                "rgba(191,255,10,0.1)",
                "rgba(191,255,10,0.2)",
                "rgba(191,255,10,0.3)",
                "rgba(191,255,10,0.4)",
                "rgba(191,255,10,0.5)",
                "rgba(191,255,10,0.6)",
                "rgba(191,255,10,0.7)",
                "rgba(191,255,10,0.8)",
                "rgba(191,255,10,0.9)",
                "rgba(191,255,10,1)"
            ],
            [
                "rgba(120,214,75,0.1)",
                "rgba(120,214,75,0.2)",
                "rgba(120,214,75,0.3)",
                "rgba(120,214,75,0.4)",
                "rgba(120,214,75,0.5)",
                "rgba(120,214,75,0.6)",
                "rgba(120,214,75,0.7)",
                "rgba(120,214,75,0.8)",
                "rgba(120,214,75,0.9)",
                "rgba(120,214,75,1)"
            ],
            [
                "rgba(48,92,2,0.1)",
                "rgba(48,92,2,0.2)",
                "rgba(48,92,2,0.3)",
                "rgba(48,92,2,0.4)",
                "rgba(48,92,2,0.5)",
                "rgba(48,92,2,0.6)",
                "rgba(48,92,2,0.7)",
                "rgba(48,92,2,0.8)",
                "rgba(48,92,2,0.9)",
                "rgba(48,92,2,1)"
            ],
            [
                "rgba(18,62,10,0.1)",
                "rgba(18,62,10,0.2)",
                "rgba(18,62,10,0.3)",
                "rgba(18,62,10,0.4)",
                "rgba(18,62,10,0.5)",
                "rgba(18,62,10,0.6)",
                "rgba(18,62,10,0.7)",
                "rgba(18,62,10,0.8)",
                "rgba(18,62,10,0.9)",
                "rgba(18,62,10,1)"
            ],
            [
                "rgba(239,82,72,0.1)",
                "rgba(239,82,72,0.2)",
                "rgba(239,82,72,0.3)",
                "rgba(239,82,72,0.4)",
                "rgba(239,82,72,0.5)",
                "rgba(239,82,72,0.6)",
                "rgba(239,82,72,0.7)",
                "rgba(239,82,72,0.8)",
                "rgba(239,82,72,0.9)",
                "rgba(239,82,72,1)"
            ],
            [
                "rgba(255,91,76,0.1)",
                "rgba(255,91,76,0.2)",
                "rgba(255,91,76,0.3)",
                "rgba(255,91,76,0.4)",
                "rgba(255,91,76,0.5)",
                "rgba(255,91,76,0.6)",
                "rgba(255,91,76,0.7)",
                "rgba(255,91,76,0.8)",
                "rgba(255,91,76,0.9)",
                "rgba(255,91,76,1)"
            ],
            [
                "rgba(224,3,3,0.1)",
                "rgba(224,3,3,0.2)",
                "rgba(224,3,3,0.3)",
                "rgba(224,3,3,0.4)",
                "rgba(224,3,3,0.5)",
                "rgba(224,3,3,0.6)",
                "rgba(224,3,3,0.7)",
                "rgba(224,3,3,0.8)",
                "rgba(224,3,3,0.9)",
                "rgba(224,3,3,1)"
            ],
            [
                "rgba(163,8,101,0.1)",
                "rgba(163,8,101,0.2)",
                "rgba(163,8,101,0.3)",
                "rgba(163,8,101,0.4)",
                "rgba(163,8,101,0.5)",
                "rgba(163,8,101,0.6)",
                "rgba(163,8,101,0.7)",
                "rgba(163,8,101,0.8)",
                "rgba(163,8,101,0.9)",
                "rgba(163,8,101,1)"
            ],
            [
                "rgba(255,63,177,0.1)",
                "rgba(255,63,177,0.2)",
                "rgba(255,63,177,0.3)",
                "rgba(255,63,177,0.4)",
                "rgba(255,63,177,0.5)",
                "rgba(255,63,177,0.6)",
                "rgba(255,63,177,0.7)",
                "rgba(255,63,177,0.8)",
                "rgba(255,63,177,0.9)",
                "rgba(255,63,177,1)"
            ],
            [
                "rgba(255,1,92,0.1)",
                "rgba(255,1,92,0.2)",
                "rgba(255,1,92,0.3)",
                "rgba(255,1,92,0.4)",
                "rgba(255,1,92,0.5)",
                "rgba(255,1,92,0.6)",
                "rgba(255,1,92,0.7)",
                "rgba(255,1,92,0.8)",
                "rgba(255,1,92,0.9)",
                "rgba(255,1,92,1)"
            ],
            [
                "rgba(214,3,108,0.1)",
                "rgba(214,3,108,0.2)",
                "rgba(214,3,108,0.3)",
                "rgba(214,3,108,0.4)",
                "rgba(214,3,108,0.5)",
                "rgba(214,3,108,0.6)",
                "rgba(214,3,108,0.7)",
                "rgba(214,3,108,0.8)",
                "rgba(214,3,108,0.9)",
                "rgba(214,3,108,1)"
            ],
            [
                "rgba(163,8,14,0.1)",
                "rgba(163,8,14,0.2)",
                "rgba(163,8,14,0.3)",
                "rgba(163,8,14,0.4)",
                "rgba(163,8,14,0.5)",
                "rgba(163,8,14,0.6)",
                "rgba(163,8,14,0.7)",
                "rgba(163,8,14,0.8)",
                "rgba(163,8,14,0.9)",
                "rgba(163,8,14,1)"
            ]
        ],
        "background": "#f9fafb",
        "backgroundBright": "#0ea5e9",
        "backgroundTint": [
            "#f3f4f6",
            "#e5e7eb",
            "#d1d5db",
            "#9ca3af",
            "#6b7280"
        ],
        "text": "#000",
        "textTint": [
            "#0d131e",
            "#111827",
            "#1f2937",
            "#374151",
            "#4b5563"
        ]
    }

} as any;


export default samplePolymaticaWidget ;