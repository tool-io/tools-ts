import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SizesAttributeWidthFormulaLookupInput = {
  readonly matches: ReadonlyArray<boolean>;
  readonly lengthsPx: ReadonlyArray<number>;
  readonly viewportWidthPx: number;
};
export type SizesAttributeWidthFormulaLookupOutput = {
  readonly clauseIndex: number;
  readonly sourceSizePx: number;
  readonly usedDefault: boolean;
};
export const sizesAttributeWidthFormulaLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matches": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Matches"
    },
    "lengthsPx": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Lengths Px"
    },
    "viewportWidthPx": {
      "type": "number",
      "minimum": 0,
      "description": "Viewport Width Px"
    }
  },
  "required": [
    "matches",
    "lengthsPx",
    "viewportWidthPx"
  ]
} as const satisfies ToolJsonSchema;
export const sizesAttributeWidthFormulaLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "clauseIndex": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Clause Index"
    },
    "sourceSizePx": {
      "type": "number",
      "minimum": 0,
      "description": "Source Size Px"
    },
    "usedDefault": {
      "type": "boolean",
      "description": "Used Default"
    }
  },
  "required": [
    "clauseIndex",
    "sourceSizePx",
    "usedDefault"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/images.html#parsing-a-sizes-attribute
export const calculateSizesAttributeWidthFormulaLookup = (rawInput: unknown): ToolResult<SizesAttributeWidthFormulaLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly matches?: unknown; readonly lengthsPx?: unknown; readonly viewportWidthPx?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "matches",
  "lengthsPx",
  "viewportWidthPx"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const matchesValue = candidate.matches;
if (!Array.isArray(matchesValue)) return issue("matches", "invalid_type", "Enter a dense array.");
if (matchesValue.length < 0) return issue("matches", "out_of_range", "Too few entries.");
if (matchesValue.length > 10000) return issue("matches", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedMatches: boolean[] = [];
for (let index = 0; index < matchesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(matchesValue, index)) return issue(`matches.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = matchesValue[index];
if (typeof item !== "boolean") return issue(`matches.${index}`, "invalid_type", "Enter a boolean value.");
validatedMatches.push(item);
}
const lengthsPxValue = candidate.lengthsPx;
if (!Array.isArray(lengthsPxValue)) return issue("lengthsPx", "invalid_type", "Enter a dense array.");
if (lengthsPxValue.length < 0) return issue("lengthsPx", "out_of_range", "Too few entries.");
if (lengthsPxValue.length > 10000) return issue("lengthsPx", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedLengthspx: number[] = [];
for (let index = 0; index < lengthsPxValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(lengthsPxValue, index)) return issue(`lengthsPx.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = lengthsPxValue[index];
if (typeof item !== "number" || !Number.isFinite(item)) return issue(`lengthsPx.${index}`, "invalid_type", "Enter a finite number.");
if (item < 0) return issue(`lengthsPx.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedLengthspx.push(item);
}
const viewportWidthPxValue = candidate.viewportWidthPx;
if (typeof viewportWidthPxValue !== "number" || !Number.isFinite(viewportWidthPxValue)) return issue("viewportWidthPx", "invalid_type", "Enter a finite number.");
if (viewportWidthPxValue < 0) return issue("viewportWidthPx", "out_of_range", "Value is outside the accepted range.");
  const input: SizesAttributeWidthFormulaLookupInput = { matches: validatedMatches, lengthsPx: validatedLengthspx, viewportWidthPx: viewportWidthPxValue };
 if (input.matches.length !== input.lengthsPx.length) return issue("lengthsPx", "length_mismatch", "Clause flags and lengths must have equal lengths.");
 const clauseIndex = input.matches.indexOf(true);
 const sourceSizePx = clauseIndex < 0 ? input.viewportWidthPx : input.lengthsPx[clauseIndex];
 if (sourceSizePx === undefined) return issue("lengthsPx", "missing_clause", "Selected clause has no length.");
 return toolSuccess({ clauseIndex, sourceSizePx, usedDefault: clauseIndex < 0 });
};
export const example = {
  "input": {
    "matches": [
      false,
      true,
      true
    ],
    "lengthsPx": [
      320,
      640,
      960
    ],
    "viewportWidthPx": 1200
  },
  "output": {
    "clauseIndex": 1,
    "sourceSizePx": 640,
    "usedDefault": false
  }
} satisfies ToolExample<SizesAttributeWidthFormulaLookupInput, SizesAttributeWidthFormulaLookupOutput>;
export const sizesAttributeWidthFormulaLookupTool = defineTool<SizesAttributeWidthFormulaLookupInput, SizesAttributeWidthFormulaLookupOutput>({
  id: "html/sizes-attribute-width-formula-lookup",
  title: "sizes Attribute Width Formula Lookup",
  description: "Resolves the first matching sizes clause from parsed media flags and already-resolved nonnegative CSS pixel lengths. If none matches, source size defaults to viewport width (100vw). Auto sizes and CSS parsing are outside this profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: sizesAttributeWidthFormulaLookupInputSchema,
  outputSchema: sizesAttributeWidthFormulaLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "matches",
        "label": "Matches",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "lengthsPx",
        "label": "Lengths Px",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "px"
          }
        }
      },
      {
        "id": "viewportWidthPx",
        "label": "Viewport Width Px",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ],
    "outputs": [
      {
        "id": "clauseIndex",
        "label": "Clause Index",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "sourceSizePx",
        "label": "Source Size Px",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "usedDefault",
        "label": "Used Default",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateSizesAttributeWidthFormulaLookup,
});
export const runSizesAttributeWidthFormulaLookup = sizesAttributeWidthFormulaLookupTool.execute;
export default sizesAttributeWidthFormulaLookupTool;
