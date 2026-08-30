import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MeterOptimumLowHighBandClassifierInput = {
  readonly value: number;
  readonly min: number;
  readonly low: number;
  readonly high: number;
  readonly max: number;
  readonly optimum: number;
};
export type MeterOptimumLowHighBandClassifierOutput = {
  readonly effectiveValue: number;
  readonly effectiveOptimum: number;
  readonly band: "optimum" | "suboptimal" | "least-good";
};
export const meterOptimumLowHighBandClassifierInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "number",
      "description": "Value"
    },
    "min": {
      "type": "number",
      "description": "Min"
    },
    "low": {
      "type": "number",
      "description": "Low"
    },
    "high": {
      "type": "number",
      "description": "High"
    },
    "max": {
      "type": "number",
      "description": "Max"
    },
    "optimum": {
      "type": "number",
      "description": "Optimum"
    }
  },
  "required": [
    "value",
    "min",
    "low",
    "high",
    "max",
    "optimum"
  ]
} as const satisfies ToolJsonSchema;
export const meterOptimumLowHighBandClassifierOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "effectiveValue": {
      "type": "number",
      "description": "Effective Value"
    },
    "effectiveOptimum": {
      "type": "number",
      "description": "Effective Optimum"
    },
    "band": {
      "type": "string",
      "enum": [
        "optimum",
        "suboptimal",
        "least-good"
      ],
      "description": "Band"
    }
  },
  "required": [
    "effectiveValue",
    "effectiveOptimum",
    "band"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/form-elements.html#the-meter-element
export const calculateMeterOptimumLowHighBandClassifier = (rawInput: unknown): ToolResult<MeterOptimumLowHighBandClassifierOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly value?: unknown; readonly min?: unknown; readonly low?: unknown; readonly high?: unknown; readonly max?: unknown; readonly optimum?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "value",
  "min",
  "low",
  "high",
  "max",
  "optimum"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valueValue = candidate.value;
if (typeof valueValue !== "number" || !Number.isFinite(valueValue)) return issue("value", "invalid_type", "Enter a finite number.");
const minValue = candidate.min;
if (typeof minValue !== "number" || !Number.isFinite(minValue)) return issue("min", "invalid_type", "Enter a finite number.");
const lowValue = candidate.low;
if (typeof lowValue !== "number" || !Number.isFinite(lowValue)) return issue("low", "invalid_type", "Enter a finite number.");
const highValue = candidate.high;
if (typeof highValue !== "number" || !Number.isFinite(highValue)) return issue("high", "invalid_type", "Enter a finite number.");
const maxValue = candidate.max;
if (typeof maxValue !== "number" || !Number.isFinite(maxValue)) return issue("max", "invalid_type", "Enter a finite number.");
const optimumValue = candidate.optimum;
if (typeof optimumValue !== "number" || !Number.isFinite(optimumValue)) return issue("optimum", "invalid_type", "Enter a finite number.");
  const input: MeterOptimumLowHighBandClassifierInput = { value: valueValue, min: minValue, low: lowValue, high: highValue, max: maxValue, optimum: optimumValue };
 if (!(input.min <= input.low && input.low <= input.high && input.high <= input.max)) return issue("low", "invalid_bounds", "Normalized bounds must satisfy min <= low <= high <= max.");
 const effectiveValue = Math.min(input.max, Math.max(input.min, input.value));
 const effectiveOptimum = Math.min(input.max, Math.max(input.min, input.optimum));
 let band: "optimum" | "suboptimal" | "least-good";
 if (effectiveOptimum < input.low) band = effectiveValue < input.low ? "optimum" : effectiveValue <= input.high ? "suboptimal" : "least-good";
 else if (effectiveOptimum > input.high) band = effectiveValue > input.high ? "optimum" : effectiveValue >= input.low ? "suboptimal" : "least-good";
 else band = effectiveValue >= input.low && effectiveValue <= input.high ? "optimum" : "suboptimal";
 return toolSuccess({ effectiveValue, effectiveOptimum, band });
};
export const example = {
  "input": {
    "value": 90,
    "min": 0,
    "low": 20,
    "high": 80,
    "max": 100,
    "optimum": 10
  },
  "output": {
    "effectiveValue": 90,
    "effectiveOptimum": 10,
    "band": "least-good"
  }
} satisfies ToolExample<MeterOptimumLowHighBandClassifierInput, MeterOptimumLowHighBandClassifierOutput>;
export const meterOptimumLowHighBandClassifierTool = defineTool<MeterOptimumLowHighBandClassifierInput, MeterOptimumLowHighBandClassifierOutput>({
  id: "html/meter-optimum-low-high-band-classifier",
  title: "meter optimum low/high Band Classifier",
  description: "Classifies a meter value against caller-supplied normalized min/low/high/max bounds and optimum. Value and optimum are clamped; optimum on a low/high boundary selects the middle optimum region.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: meterOptimumLowHighBandClassifierInputSchema,
  outputSchema: meterOptimumLowHighBandClassifierOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "value",
        "label": "Value",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "min",
        "label": "Min",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "low",
        "label": "Low",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "high",
        "label": "High",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "max",
        "label": "Max",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "optimum",
        "label": "Optimum",
        "required": true,
        "valueType": {
          "type": "number"
        }
      }
    ],
    "outputs": [
      {
        "id": "effectiveValue",
        "label": "Effective Value",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "effectiveOptimum",
        "label": "Effective Optimum",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "band",
        "label": "Band",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateMeterOptimumLowHighBandClassifier,
});
export const runMeterOptimumLowHighBandClassifier = meterOptimumLowHighBandClassifierTool.execute;
export default meterOptimumLowHighBandClassifierTool;
