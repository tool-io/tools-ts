import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type FigureFigcaptionPairingCheckerInput = {
  readonly children: ReadonlyArray<string>;
};
export type FigureFigcaptionPairingCheckerOutput = {
  readonly captionCount: number;
  readonly captionIndex: number;
  readonly validPlacement: boolean;
};
export const figureFigcaptionPairingCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "children": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Children"
    }
  },
  "required": [
    "children"
  ]
} as const satisfies ToolJsonSchema;
export const figureFigcaptionPairingCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "captionCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Caption Count"
    },
    "captionIndex": {
      "type": "integer",
      "minimum": -1,
      "maximum": 9007199254740991,
      "description": "Caption Index"
    },
    "validPlacement": {
      "type": "boolean",
      "description": "Valid Placement"
    }
  },
  "required": [
    "captionCount",
    "captionIndex",
    "validPlacement"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element
export const calculateFigureFigcaptionPairingChecker = (rawInput: unknown): ToolResult<FigureFigcaptionPairingCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly children?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "children"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const childrenValue = candidate.children;
if (!Array.isArray(childrenValue)) return issue("children", "invalid_type", "Enter a dense array.");
if (childrenValue.length < 0) return issue("children", "out_of_range", "Too few entries.");
if (childrenValue.length > 10000) return issue("children", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedChildren: string[] = [];
for (let index = 0; index < childrenValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(childrenValue, index)) return issue(`children.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = childrenValue[index];
if (typeof item !== "string") return issue(`children.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`children.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedChildren.push(item);
}
if (validatedChildren.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("children", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: FigureFigcaptionPairingCheckerInput = { children: validatedChildren };
 const tags = input.children.map(asciiLower);
 const captionCount = tags.filter(tag => tag === "figcaption").length;
 const captionIndex = tags.indexOf("figcaption");
 return toolSuccess({ captionCount, captionIndex, validPlacement: captionCount === 0 || captionCount === 1 && (captionIndex === 0 || captionIndex === tags.length - 1) });
};
export const example = {
  "input": {
    "children": [
      "img",
      "figcaption"
    ]
  },
  "output": {
    "captionCount": 1,
    "captionIndex": 1,
    "validPlacement": true
  }
} satisfies ToolExample<FigureFigcaptionPairingCheckerInput, FigureFigcaptionPairingCheckerOutput>;
export const figureFigcaptionPairingCheckerTool = defineTool<FigureFigcaptionPairingCheckerInput, FigureFigcaptionPairingCheckerOutput>({
  id: "html/figure-figcaption-pairing-checker",
  title: "figure/figcaption Pairing Check",
  description: "Checks figure direct-element children for at most one figcaption at either end. Missing figcaption is allowed; caption content quality and accessibility are outside this structural check.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: figureFigcaptionPairingCheckerInputSchema,
  outputSchema: figureFigcaptionPairingCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "children",
        "label": "Children",
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
        "id": "captionCount",
        "label": "Caption Count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "captionIndex",
        "label": "Caption Index",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "validPlacement",
        "label": "Valid Placement",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateFigureFigcaptionPairingChecker,
});
export const runFigureFigcaptionPairingChecker = figureFigcaptionPairingCheckerTool.execute;
export default figureFigcaptionPairingCheckerTool;
