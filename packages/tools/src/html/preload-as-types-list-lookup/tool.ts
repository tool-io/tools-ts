import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type PreloadAsTypesListLookupInput = {
  readonly values: ReadonlyArray<string>;
};
export type PreloadAsTypesListLookupOutput = {
  readonly valid: ReadonlyArray<boolean>;
  readonly fetchDestinations: ReadonlyArray<string>;
};
export const preloadAsTypesListLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const preloadAsTypesListLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Valid"
    },
    "fetchDestinations": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Fetch Destinations"
    }
  },
  "required": [
    "valid",
    "fetchDestinations"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/links.html#preload-destination
export const calculatePreloadAsTypesListLookup = (rawInput: unknown): ToolResult<PreloadAsTypesListLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
if (valuesValue.length < 0) return issue("values", "out_of_range", "Too few entries.");
if (valuesValue.length > 10000) return issue("values", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedValues: string[] = [];
for (let index = 0; index < valuesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = valuesValue[index];
if (typeof item !== "string") return issue(`values.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`values.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedValues.push(item);
}
if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: PreloadAsTypesListLookupInput = { values: validatedValues };
 const values = input.values.map(asciiLower);
 const allowed = new Set(["fetch", "font", "image", "script", "style", "track"]);
 return toolSuccess({ valid: values.map(value => allowed.has(value)), fetchDestinations: values.map(value => allowed.has(value) && value !== "fetch" ? value : "") });
};
export const example = {
  "input": {
    "values": [
      "font",
      "FETCH",
      "video",
      "script"
    ]
  },
  "output": {
    "valid": [
      true,
      true,
      false,
      true
    ],
    "fetchDestinations": [
      "font",
      "",
      "",
      "script"
    ]
  }
} satisfies ToolExample<PreloadAsTypesListLookupInput, PreloadAsTypesListLookupOutput>;
export const preloadAsTypesListLookupTool = defineTool<PreloadAsTypesListLookupInput, PreloadAsTypesListLookupOutput>({
  id: "html/preload-as-types-list-lookup",
  title: "link preload as= Types List",
  description: "Checks the six current HTML preload as destinations and translates fetch to the empty Fetch destination. Modulepreload has a separate vocabulary and is outside this lookup.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: preloadAsTypesListLookupInputSchema,
  outputSchema: preloadAsTypesListLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Values",
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
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "fetchDestinations",
        "label": "Fetch Destinations",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculatePreloadAsTypesListLookup,
});
export const runPreloadAsTypesListLookup = preloadAsTypesListLookupTool.execute;
export default preloadAsTypesListLookupTool;
