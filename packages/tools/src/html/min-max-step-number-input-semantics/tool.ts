import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MinMaxStepNumberInputSemanticsInput = {
  readonly value: number;
  readonly hasMin: boolean;
  readonly min: number;
  readonly hasMax: boolean;
  readonly max: number;
  readonly stepAny: boolean;
  readonly step: number;
  readonly hasValueAttribute: boolean;
  readonly valueAttribute: number;
};
export type MinMaxStepNumberInputSemanticsOutput = {
  readonly rangeUnderflow: boolean;
  readonly rangeOverflow: boolean;
  readonly stepMismatch: boolean;
  readonly stepBase: number;
};
export const minMaxStepNumberInputSemanticsInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "number",
      "description": "Value"
    },
    "hasMin": {
      "type": "boolean",
      "description": "Has Min"
    },
    "min": {
      "type": "number",
      "description": "Min"
    },
    "hasMax": {
      "type": "boolean",
      "description": "Has Max"
    },
    "max": {
      "type": "number",
      "description": "Max"
    },
    "stepAny": {
      "type": "boolean",
      "description": "Step Any"
    },
    "step": {
      "type": "number",
      "minimum": 0,
      "description": "Step"
    },
    "hasValueAttribute": {
      "type": "boolean",
      "description": "Has Value Attribute"
    },
    "valueAttribute": {
      "type": "number",
      "description": "Value Attribute"
    }
  },
  "required": [
    "value",
    "hasMin",
    "min",
    "hasMax",
    "max",
    "stepAny",
    "step",
    "hasValueAttribute",
    "valueAttribute"
  ]
} as const satisfies ToolJsonSchema;
export const minMaxStepNumberInputSemanticsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rangeUnderflow": {
      "type": "boolean",
      "description": "Range Underflow"
    },
    "rangeOverflow": {
      "type": "boolean",
      "description": "Range Overflow"
    },
    "stepMismatch": {
      "type": "boolean",
      "description": "Step Mismatch"
    },
    "stepBase": {
      "type": "number",
      "description": "Step Base"
    }
  },
  "required": [
    "rangeUnderflow",
    "rangeOverflow",
    "stepMismatch",
    "stepBase"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
const decimalParts = (value: number): { coefficient: bigint; scale: number } => {
 const [mantissa = "0", exponent = "0"] = value.toString().split("e");
 const point = mantissa.indexOf(".");
 return { coefficient: BigInt(mantissa.replace(".", "")), scale: (point < 0 ? 0 : mantissa.length - point - 1) - Number(exponent) };
};
// Reference: https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number); https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#concept-input-step
export const calculateMinMaxStepNumberInputSemantics = (rawInput: unknown): ToolResult<MinMaxStepNumberInputSemanticsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly value?: unknown; readonly hasMin?: unknown; readonly min?: unknown; readonly hasMax?: unknown; readonly max?: unknown; readonly stepAny?: unknown; readonly step?: unknown; readonly hasValueAttribute?: unknown; readonly valueAttribute?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "value",
  "hasMin",
  "min",
  "hasMax",
  "max",
  "stepAny",
  "step",
  "hasValueAttribute",
  "valueAttribute"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valueValue = candidate.value;
if (typeof valueValue !== "number" || !Number.isFinite(valueValue)) return issue("value", "invalid_type", "Enter a finite number.");
const hasMinValue = candidate.hasMin;
if (typeof hasMinValue !== "boolean") return issue("hasMin", "invalid_type", "Enter a boolean value.");
const minValue = candidate.min;
if (typeof minValue !== "number" || !Number.isFinite(minValue)) return issue("min", "invalid_type", "Enter a finite number.");
const hasMaxValue = candidate.hasMax;
if (typeof hasMaxValue !== "boolean") return issue("hasMax", "invalid_type", "Enter a boolean value.");
const maxValue = candidate.max;
if (typeof maxValue !== "number" || !Number.isFinite(maxValue)) return issue("max", "invalid_type", "Enter a finite number.");
const stepAnyValue = candidate.stepAny;
if (typeof stepAnyValue !== "boolean") return issue("stepAny", "invalid_type", "Enter a boolean value.");
const stepValue = candidate.step;
if (typeof stepValue !== "number" || !Number.isFinite(stepValue)) return issue("step", "invalid_type", "Enter a finite number.");
if (stepValue < 0) return issue("step", "out_of_range", "Value is outside the accepted range.");
const hasValueAttributeValue = candidate.hasValueAttribute;
if (typeof hasValueAttributeValue !== "boolean") return issue("hasValueAttribute", "invalid_type", "Enter a boolean value.");
const valueAttributeValue = candidate.valueAttribute;
if (typeof valueAttributeValue !== "number" || !Number.isFinite(valueAttributeValue)) return issue("valueAttribute", "invalid_type", "Enter a finite number.");
  const input: MinMaxStepNumberInputSemanticsInput = { value: valueValue, hasMin: hasMinValue, min: minValue, hasMax: hasMaxValue, max: maxValue, stepAny: stepAnyValue, step: stepValue, hasValueAttribute: hasValueAttributeValue, valueAttribute: valueAttributeValue };
 if (input.step <= 0) return issue("step", "out_of_range", "Normalized step must be positive.");
 const stepBase = input.hasMin ? input.min : input.hasValueAttribute ? input.valueAttribute : 0;
 const parts = [decimalParts(input.value), decimalParts(stepBase), decimalParts(input.step)];
 const scale = Math.max(...parts.map(part => part.scale));
 const scaled = parts.map(part => part.coefficient * 10n ** BigInt(scale - part.scale));
 const [value, base, step] = scaled;
 if (value === undefined || base === undefined || step === undefined) return issue("", "calculation_failed", "Unable to align decimal values.");
 return toolSuccess({ rangeUnderflow: input.hasMin && input.value < input.min, rangeOverflow: input.hasMax && input.value > input.max, stepMismatch: !input.stepAny && (value - base) % step !== 0n, stepBase });
};
export const example = {
  "input": {
    "value": 0.3,
    "hasMin": true,
    "min": 0.1,
    "hasMax": true,
    "max": 1,
    "stepAny": false,
    "step": 0.2,
    "hasValueAttribute": false,
    "valueAttribute": 0
  },
  "output": {
    "rangeUnderflow": false,
    "rangeOverflow": false,
    "stepMismatch": false,
    "stepBase": 0.1
  }
} satisfies ToolExample<MinMaxStepNumberInputSemanticsInput, MinMaxStepNumberInputSemanticsOutput>;
export const minMaxStepNumberInputSemanticsTool = defineTool<MinMaxStepNumberInputSemanticsInput, MinMaxStepNumberInputSemanticsOutput>({
  id: "html/min-max-step-number-input-semantics",
  title: "min/max/step Number Input Semantics",
  description: "Checks parsed number-input min/max and step constraints using exact decimal arithmetic on the canonical decimal spelling of supplied finite numbers. Supply normalized positive step (default 1) and attribute presence flags; this is an ideal decimal model, independent of browser binary floating point tolerances.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: minMaxStepNumberInputSemanticsInputSchema,
  outputSchema: minMaxStepNumberInputSemanticsOutputSchema,
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
        "id": "hasMin",
        "label": "Has Min",
        "required": true,
        "valueType": {
          "type": "boolean"
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
        "id": "hasMax",
        "label": "Has Max",
        "required": true,
        "valueType": {
          "type": "boolean"
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
        "id": "stepAny",
        "label": "Step Any",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "step",
        "label": "Step",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "hasValueAttribute",
        "label": "Has Value Attribute",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "valueAttribute",
        "label": "Value Attribute",
        "required": true,
        "valueType": {
          "type": "number"
        }
      }
    ],
    "outputs": [
      {
        "id": "rangeUnderflow",
        "label": "Range Underflow",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "rangeOverflow",
        "label": "Range Overflow",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "stepMismatch",
        "label": "Step Mismatch",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "stepBase",
        "label": "Step Base",
        "valueType": {
          "type": "number"
        }
      }
    ]
  },
  execute: calculateMinMaxStepNumberInputSemantics,
});
export const runMinMaxStepNumberInputSemantics = minMaxStepNumberInputSemanticsTool.execute;
export default minMaxStepNumberInputSemanticsTool;
