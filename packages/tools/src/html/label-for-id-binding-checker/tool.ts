import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type LabelForIdBindingCheckerInput = {
  readonly hasFor: boolean;
  readonly forId: string;
  readonly elementIds: ReadonlyArray<string>;
  readonly labelable: ReadonlyArray<boolean>;
  readonly implicitLabelableCount: number;
};
export type LabelForIdBindingCheckerOutput = {
  readonly bound: boolean;
  readonly targetIndex: number;
  readonly duplicateId: boolean;
};
export const labelForIdBindingCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hasFor": {
      "type": "boolean",
      "description": "Has For"
    },
    "forId": {
      "type": "string",
      "maxLength": 100000,
      "description": "For Id"
    },
    "elementIds": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Element Ids"
    },
    "labelable": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Labelable"
    },
    "implicitLabelableCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10000,
      "description": "Implicit Labelable Count"
    }
  },
  "required": [
    "hasFor",
    "forId",
    "elementIds",
    "labelable",
    "implicitLabelableCount"
  ]
} as const satisfies ToolJsonSchema;
export const labelForIdBindingCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bound": {
      "type": "boolean",
      "description": "Bound"
    },
    "targetIndex": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Target Index"
    },
    "duplicateId": {
      "type": "boolean",
      "description": "Duplicate Id"
    }
  },
  "required": [
    "bound",
    "targetIndex",
    "duplicateId"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/forms.html#the-label-element
export const calculateLabelForIdBindingChecker = (rawInput: unknown): ToolResult<LabelForIdBindingCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly hasFor?: unknown; readonly forId?: unknown; readonly elementIds?: unknown; readonly labelable?: unknown; readonly implicitLabelableCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "hasFor",
  "forId",
  "elementIds",
  "labelable",
  "implicitLabelableCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const hasForValue = candidate.hasFor;
if (typeof hasForValue !== "boolean") return issue("hasFor", "invalid_type", "Enter a boolean value.");
const forIdValue = candidate.forId;
if (typeof forIdValue !== "string") return issue("forId", "invalid_type", "Enter a string value.");
if (forIdValue.length > 100000) return issue("forId", "resource_limit", "Text exceeds the 100000-character resource limit.");
const elementIdsValue = candidate.elementIds;
if (!Array.isArray(elementIdsValue)) return issue("elementIds", "invalid_type", "Enter a dense array.");
if (elementIdsValue.length < 0) return issue("elementIds", "out_of_range", "Too few entries.");
if (elementIdsValue.length > 10000) return issue("elementIds", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedElementids: string[] = [];
for (let index = 0; index < elementIdsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(elementIdsValue, index)) return issue(`elementIds.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = elementIdsValue[index];
if (typeof item !== "string") return issue(`elementIds.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`elementIds.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedElementids.push(item);
}
if (validatedElementids.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("elementIds", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
const labelableValue = candidate.labelable;
if (!Array.isArray(labelableValue)) return issue("labelable", "invalid_type", "Enter a dense array.");
if (labelableValue.length < 0) return issue("labelable", "out_of_range", "Too few entries.");
if (labelableValue.length > 10000) return issue("labelable", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedLabelable: boolean[] = [];
for (let index = 0; index < labelableValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(labelableValue, index)) return issue(`labelable.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = labelableValue[index];
if (typeof item !== "boolean") return issue(`labelable.${index}`, "invalid_type", "Enter a boolean value.");
validatedLabelable.push(item);
}
const implicitLabelableCountValue = candidate.implicitLabelableCount;
if (typeof implicitLabelableCountValue !== "number" || !Number.isSafeInteger(implicitLabelableCountValue)) return issue("implicitLabelableCount", "invalid_type", "Enter a finite safe integer.");
if (implicitLabelableCountValue < 0) return issue("implicitLabelableCount", "out_of_range", "Value is outside the accepted range.");
if (implicitLabelableCountValue > 10000) return issue("implicitLabelableCount", "out_of_range", "Value is outside the accepted range.");
  const input: LabelForIdBindingCheckerInput = { hasFor: hasForValue, forId: forIdValue, elementIds: validatedElementids, labelable: validatedLabelable, implicitLabelableCount: implicitLabelableCountValue };
 if (input.elementIds.length !== input.labelable.length) return issue("labelable", "length_mismatch", "IDs and labelability flags must have equal lengths.");
 const targetIndex = input.hasFor && input.forId.length > 0 ? input.elementIds.indexOf(input.forId) : -1;
 const bound = input.hasFor ? targetIndex >= 0 && input.labelable[targetIndex] === true : input.implicitLabelableCount > 0;
 return toolSuccess({ bound, targetIndex, duplicateId: input.hasFor && input.forId.length > 0 && input.elementIds.filter(id => id === input.forId).length > 1 });
};
export const example = {
  "input": {
    "hasFor": true,
    "forId": "email",
    "elementIds": [
      "email",
      "email"
    ],
    "labelable": [
      false,
      true
    ],
    "implicitLabelableCount": 0
  },
  "output": {
    "bound": false,
    "targetIndex": 0,
    "duplicateId": true
  }
} satisfies ToolExample<LabelForIdBindingCheckerInput, LabelForIdBindingCheckerOutput>;
export const labelForIdBindingCheckerTool = defineTool<LabelForIdBindingCheckerInput, LabelForIdBindingCheckerOutput>({
  id: "html/label-for-id-binding-checker",
  title: "label for=id Binding Check",
  description: "Resolves explicit label for binding from document-order IDs and labelability flags. An explicit for attribute uses the first matching ID; a nonlabelable first match prevents binding to a later duplicate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: labelForIdBindingCheckerInputSchema,
  outputSchema: labelForIdBindingCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "hasFor",
        "label": "Has For",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "forId",
        "label": "For Id",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "elementIds",
        "label": "Element Ids",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "labelable",
        "label": "Labelable",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "implicitLabelableCount",
        "label": "Implicit Labelable Count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "bound",
        "label": "Bound",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "targetIndex",
        "label": "Target Index",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "duplicateId",
        "label": "Duplicate Id",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateLabelForIdBindingChecker,
});
export const runLabelForIdBindingChecker = labelForIdBindingCheckerTool.execute;
export default labelForIdBindingCheckerTool;
