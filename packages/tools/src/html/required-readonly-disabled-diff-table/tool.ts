import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RequiredReadonlyDisabledDiffTableInput = {
  readonly type: "hidden" | "text" | "search" | "tel" | "url" | "email" | "password" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "checkbox" | "radio" | "file" | "submit" | "image" | "reset" | "button";
  readonly required: boolean;
  readonly readonly: boolean;
  readonly disabled: boolean;
};
export type RequiredReadonlyDisabledDiffTableOutput = {
  readonly requiredApplies: boolean;
  readonly readonlyApplies: boolean;
  readonly mutable: boolean;
  readonly excludedByDisabled: boolean;
  readonly barredFromValidation: boolean;
};
export const requiredReadonlyDisabledDiffTableInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "type": {
      "type": "string",
      "enum": [
        "hidden",
        "text",
        "search",
        "tel",
        "url",
        "email",
        "password",
        "date",
        "month",
        "week",
        "time",
        "datetime-local",
        "number",
        "range",
        "color",
        "checkbox",
        "radio",
        "file",
        "submit",
        "image",
        "reset",
        "button"
      ],
      "description": "Type"
    },
    "required": {
      "type": "boolean",
      "description": "Required"
    },
    "readonly": {
      "type": "boolean",
      "description": "Readonly"
    },
    "disabled": {
      "type": "boolean",
      "description": "Disabled"
    }
  },
  "required": [
    "type",
    "required",
    "readonly",
    "disabled"
  ]
} as const satisfies ToolJsonSchema;
export const requiredReadonlyDisabledDiffTableOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "requiredApplies": {
      "type": "boolean",
      "description": "Required Applies"
    },
    "readonlyApplies": {
      "type": "boolean",
      "description": "Readonly Applies"
    },
    "mutable": {
      "type": "boolean",
      "description": "Mutable"
    },
    "excludedByDisabled": {
      "type": "boolean",
      "description": "Excluded By Disabled"
    },
    "barredFromValidation": {
      "type": "boolean",
      "description": "Barred From Validation"
    }
  },
  "required": [
    "requiredApplies",
    "readonlyApplies",
    "mutable",
    "excludedByDisabled",
    "barredFromValidation"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/input.html#input-type-attr-summary
export const calculateRequiredReadonlyDisabledDiffTable = (rawInput: unknown): ToolResult<RequiredReadonlyDisabledDiffTableOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly type?: unknown; readonly required?: unknown; readonly readonly?: unknown; readonly disabled?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "type",
  "required",
  "readonly",
  "disabled"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const typeValue = candidate.type;
if (typeof typeValue !== "string") return issue("type", "invalid_type", "Enter a string value.");
if (typeValue !== "hidden" && typeValue !== "text" && typeValue !== "search" && typeValue !== "tel" && typeValue !== "url" && typeValue !== "email" && typeValue !== "password" && typeValue !== "date" && typeValue !== "month" && typeValue !== "week" && typeValue !== "time" && typeValue !== "datetime-local" && typeValue !== "number" && typeValue !== "range" && typeValue !== "color" && typeValue !== "checkbox" && typeValue !== "radio" && typeValue !== "file" && typeValue !== "submit" && typeValue !== "image" && typeValue !== "reset" && typeValue !== "button") return issue("type", "invalid_value", "Choose a supported value.");
const requiredValue = candidate.required;
if (typeof requiredValue !== "boolean") return issue("required", "invalid_type", "Enter a boolean value.");
const readonlyValue = candidate.readonly;
if (typeof readonlyValue !== "boolean") return issue("readonly", "invalid_type", "Enter a boolean value.");
const disabledValue = candidate.disabled;
if (typeof disabledValue !== "boolean") return issue("disabled", "invalid_type", "Enter a boolean value.");
  const input: RequiredReadonlyDisabledDiffTableInput = { type: typeValue, required: requiredValue, readonly: readonlyValue, disabled: disabledValue };
 const textTypes = ["text", "search", "tel", "url", "email", "password", "date", "month", "week", "time", "datetime-local", "number"];
 const readonlyApplies = input.readonly && textTypes.includes(input.type);
 const requiredApplies = input.required && [...textTypes, "checkbox", "radio", "file"].includes(input.type);
 const barredFromValidation = input.disabled || readonlyApplies || ["hidden", "reset", "button"].includes(input.type);
 return toolSuccess({ requiredApplies, readonlyApplies, mutable: !input.disabled && !readonlyApplies && !["hidden", "submit", "image", "reset", "button"].includes(input.type), excludedByDisabled: input.disabled, barredFromValidation });
};
export const example = {
  "input": {
    "type": "text",
    "required": true,
    "readonly": true,
    "disabled": false
  },
  "output": {
    "requiredApplies": true,
    "readonlyApplies": true,
    "mutable": false,
    "excludedByDisabled": false,
    "barredFromValidation": true
  }
} satisfies ToolExample<RequiredReadonlyDisabledDiffTableInput, RequiredReadonlyDisabledDiffTableOutput>;
export const requiredReadonlyDisabledDiffTableTool = defineTool<RequiredReadonlyDisabledDiffTableInput, RequiredReadonlyDisabledDiffTableOutput>({
  id: "html/required-readonly-disabled-diff-table",
  title: "required/readonly/disabled Diff Table",
  description: "Resolves required, readonly and disabled flags for an ordinary input type. Effective disabled includes inherited fieldset state supplied by the caller. Submission eligibility concerns disabling only; name, checkedness and submitter selection are separate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: requiredReadonlyDisabledDiffTableInputSchema,
  outputSchema: requiredReadonlyDisabledDiffTableOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "type",
        "label": "Type",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "required",
        "label": "Required",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "readonly",
        "label": "Readonly",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "requiredApplies",
        "label": "Required Applies",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "readonlyApplies",
        "label": "Readonly Applies",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "mutable",
        "label": "Mutable",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "excludedByDisabled",
        "label": "Excluded By Disabled",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "barredFromValidation",
        "label": "Barred From Validation",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateRequiredReadonlyDisabledDiffTable,
});
export const runRequiredReadonlyDisabledDiffTable = requiredReadonlyDisabledDiffTableTool.execute;
export default requiredReadonlyDisabledDiffTableTool;
