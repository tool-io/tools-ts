import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SlotNameFallbackShadowDomLookupInput = {
  readonly slotName: string;
  readonly earlierSlotNames: ReadonlyArray<string>;
  readonly nodeSlotNames: ReadonlyArray<string>;
};
export type SlotNameFallbackShadowDomLookupOutput = {
  readonly assignedIndices: ReadonlyArray<number>;
  readonly assignedCount: number;
  readonly usesFallback: boolean;
};
export const slotNameFallbackShadowDomLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "slotName": {
      "type": "string",
      "maxLength": 100000,
      "description": "Slot Name"
    },
    "earlierSlotNames": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Earlier Slot Names"
    },
    "nodeSlotNames": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Node Slot Names"
    }
  },
  "required": [
    "slotName",
    "earlierSlotNames",
    "nodeSlotNames"
  ]
} as const satisfies ToolJsonSchema;
export const slotNameFallbackShadowDomLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "assignedIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Assigned Indices"
    },
    "assignedCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Assigned Count"
    },
    "usesFallback": {
      "type": "boolean",
      "description": "Uses Fallback"
    }
  },
  "required": [
    "assignedIndices",
    "assignedCount",
    "usesFallback"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://dom.spec.whatwg.org/#find-a-slot; https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element
export const calculateSlotNameFallbackShadowDomLookup = (rawInput: unknown): ToolResult<SlotNameFallbackShadowDomLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly slotName?: unknown; readonly earlierSlotNames?: unknown; readonly nodeSlotNames?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "slotName",
  "earlierSlotNames",
  "nodeSlotNames"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const slotNameValue = candidate.slotName;
if (typeof slotNameValue !== "string") return issue("slotName", "invalid_type", "Enter a string value.");
if (slotNameValue.length > 100000) return issue("slotName", "resource_limit", "Text exceeds the 100000-character resource limit.");
const earlierSlotNamesValue = candidate.earlierSlotNames;
if (!Array.isArray(earlierSlotNamesValue)) return issue("earlierSlotNames", "invalid_type", "Enter a dense array.");
if (earlierSlotNamesValue.length < 0) return issue("earlierSlotNames", "out_of_range", "Too few entries.");
if (earlierSlotNamesValue.length > 10000) return issue("earlierSlotNames", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedEarlierslotnames: string[] = [];
for (let index = 0; index < earlierSlotNamesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(earlierSlotNamesValue, index)) return issue(`earlierSlotNames.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = earlierSlotNamesValue[index];
if (typeof item !== "string") return issue(`earlierSlotNames.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`earlierSlotNames.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedEarlierslotnames.push(item);
}
if (validatedEarlierslotnames.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("earlierSlotNames", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
const nodeSlotNamesValue = candidate.nodeSlotNames;
if (!Array.isArray(nodeSlotNamesValue)) return issue("nodeSlotNames", "invalid_type", "Enter a dense array.");
if (nodeSlotNamesValue.length < 0) return issue("nodeSlotNames", "out_of_range", "Too few entries.");
if (nodeSlotNamesValue.length > 10000) return issue("nodeSlotNames", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedNodeslotnames: string[] = [];
for (let index = 0; index < nodeSlotNamesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(nodeSlotNamesValue, index)) return issue(`nodeSlotNames.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = nodeSlotNamesValue[index];
if (typeof item !== "string") return issue(`nodeSlotNames.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`nodeSlotNames.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedNodeslotnames.push(item);
}
if (validatedNodeslotnames.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("nodeSlotNames", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: SlotNameFallbackShadowDomLookupInput = { slotName: slotNameValue, earlierSlotNames: validatedEarlierslotnames, nodeSlotNames: validatedNodeslotnames };
 const assignedIndices: number[] = [];
 if (!input.earlierSlotNames.includes(input.slotName)) input.nodeSlotNames.forEach((name, index) => { if (name === input.slotName) assignedIndices.push(index); });
 return toolSuccess({ assignedIndices, assignedCount: assignedIndices.length, usesFallback: assignedIndices.length === 0 });
};
export const example = {
  "input": {
    "slotName": "title",
    "earlierSlotNames": [],
    "nodeSlotNames": [
      "",
      "title",
      "title"
    ]
  },
  "output": {
    "assignedIndices": [
      1,
      2
    ],
    "assignedCount": 2,
    "usesFallback": false
  }
} satisfies ToolExample<SlotNameFallbackShadowDomLookupInput, SlotNameFallbackShadowDomLookupOutput>;
export const slotNameFallbackShadowDomLookupTool = defineTool<SlotNameFallbackShadowDomLookupInput, SlotNameFallbackShadowDomLookupOutput>({
  id: "html/slot-name-fallback-shadow-dom-lookup",
  title: "slot name Fallback Shadow DOM Lookup",
  description: "Resolves automatic named slot assignment from direct host slotable names. The first slot with a given name receives matching nodes; later same-name slots display fallback. Text nodes use the empty default name. Manual assignment is outside this profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: slotNameFallbackShadowDomLookupInputSchema,
  outputSchema: slotNameFallbackShadowDomLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "slotName",
        "label": "Slot Name",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "earlierSlotNames",
        "label": "Earlier Slot Names",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "nodeSlotNames",
        "label": "Node Slot Names",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "assignedIndices",
        "label": "Assigned Indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "assignedCount",
        "label": "Assigned Count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "usesFallback",
        "label": "Uses Fallback",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSlotNameFallbackShadowDomLookup,
});
export const runSlotNameFallbackShadowDomLookup = slotNameFallbackShadowDomLookupTool.execute;
export default slotNameFallbackShadowDomLookupTool;
