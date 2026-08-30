import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ProgressValueMaxPercentInput = {
  readonly hasValue: boolean;
  readonly value: number;
  readonly max: number;
};
export type ProgressValueMaxPercentOutput = {
  readonly indeterminate: boolean;
  readonly effectiveMax: number;
  readonly effectiveValue: number;
  readonly percent: number;
};
export const progressValueMaxPercentInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hasValue": {
      "type": "boolean",
      "description": "Has Value"
    },
    "value": {
      "type": "number",
      "description": "Value"
    },
    "max": {
      "type": "number",
      "description": "Max"
    }
  },
  "required": [
    "hasValue",
    "value",
    "max"
  ]
} as const satisfies ToolJsonSchema;
export const progressValueMaxPercentOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "indeterminate": {
      "type": "boolean",
      "description": "Indeterminate"
    },
    "effectiveMax": {
      "type": "number",
      "description": "Effective Max"
    },
    "effectiveValue": {
      "type": "number",
      "description": "Effective Value"
    },
    "percent": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Percent"
    }
  },
  "required": [
    "indeterminate",
    "effectiveMax",
    "effectiveValue",
    "percent"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element
export const calculateProgressValueMaxPercent = (rawInput: unknown): ToolResult<ProgressValueMaxPercentOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hasValue?: unknown; readonly value?: unknown; readonly max?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hasValue",
  "value",
  "max"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hasValueValue = candidate.hasValue;
if (typeof hasValueValue !== "boolean") return issue("hasValue", "invalid_type", "Enter a boolean value.");
const valueValue = candidate.value;
if (typeof valueValue !== "number" || !Number.isFinite(valueValue)) return issue("value", "invalid_type", "Enter a finite number.");
const maxValue = candidate.max;
if (typeof maxValue !== "number" || !Number.isFinite(maxValue)) return issue("max", "invalid_type", "Enter a finite number.");
  const input: ProgressValueMaxPercentInput = { hasValue: hasValueValue, value: valueValue, max: maxValue };
 const effectiveMax = input.max > 0 ? input.max : 1;
 const effectiveValue = input.hasValue ? Math.min(effectiveMax, Math.max(0, input.value)) : 0;
 return toolSuccess({ indeterminate: !input.hasValue, effectiveMax, effectiveValue, percent: effectiveValue / effectiveMax * 100 });
};
export const example = {
  "input": {
    "hasValue": true,
    "value": 3,
    "max": 8
  },
  "output": {
    "indeterminate": false,
    "effectiveMax": 8,
    "effectiveValue": 3,
    "percent": 37.5
  }
} satisfies ToolExample<ProgressValueMaxPercentInput, ProgressValueMaxPercentOutput>;
export const progressValueMaxPercentTool = defineTool<ProgressValueMaxPercentInput, ProgressValueMaxPercentOutput>({
  id: "html/progress-value-max-percent",
  title: "progress value/max Percent",
  description: "Resolves progress from parsed value/max: absent value is indeterminate, nonpositive max defaults to 1, and value is clamped into [0,max]. Indeterminate percent is represented as 0 with its explicit flag.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: progressValueMaxPercentInputSchema,
  outputSchema: progressValueMaxPercentOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hasValue",
        "label": "Has Value",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "value",
        "label": "Value",
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
      }
    ],
    "outputs": [
      {
        "id": "indeterminate",
        "label": "Indeterminate",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "effectiveMax",
        "label": "Effective Max",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "effectiveValue",
        "label": "Effective Value",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "percent",
        "label": "Percent",
        "valueType": {
          "type": "number",
          "unit": "%"
        }
      }
    ]
  },
  execute: calculateProgressValueMaxPercent,
});
export const runProgressValueMaxPercent = progressValueMaxPercentTool.execute;
export default progressValueMaxPercentTool;
