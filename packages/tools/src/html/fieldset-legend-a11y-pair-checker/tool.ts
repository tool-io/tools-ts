import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { asciiLower } from "../void-elements-list-checker/tool.js";
export type FieldsetLegendA11yPairCheckerInput = {
  readonly children: ReadonlyArray<string>;
};
export type FieldsetLegendA11yPairCheckerOutput = {
  readonly legendCount: number;
  readonly legendFirst: boolean;
  readonly validPlacement: boolean;
  readonly hasLegend: boolean;
};
export const fieldsetLegendA11yPairCheckerInputSchema = {
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
export const fieldsetLegendA11yPairCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "legendCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Legend Count"
    },
    "legendFirst": {
      "type": "boolean",
      "description": "Legend First"
    },
    "validPlacement": {
      "type": "boolean",
      "description": "Valid Placement"
    },
    "hasLegend": {
      "type": "boolean",
      "description": "Has Legend"
    }
  },
  "required": [
    "legendCount",
    "legendFirst",
    "validPlacement",
    "hasLegend"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element
export const calculateFieldsetLegendA11yPairChecker = (rawInput: unknown): ToolResult<FieldsetLegendA11yPairCheckerOutput> => {
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
  const input: FieldsetLegendA11yPairCheckerInput = { children: validatedChildren };
 const children = input.children.map(asciiLower);
 const legendCount = children.filter(tag => tag === "legend").length;
 const legendFirst = children[0] === "legend";
 return toolSuccess({ legendCount, legendFirst, validPlacement: legendCount === 0 || legendCount === 1 && legendFirst, hasLegend: legendCount > 0 });
};
export const example = {
  "input": {
    "children": [
      "legend",
      "input",
      "button"
    ]
  },
  "output": {
    "legendCount": 1,
    "legendFirst": true,
    "validPlacement": true,
    "hasLegend": true
  }
} satisfies ToolExample<FieldsetLegendA11yPairCheckerInput, FieldsetLegendA11yPairCheckerOutput>;
export const fieldsetLegendA11yPairCheckerTool = defineTool<FieldsetLegendA11yPairCheckerInput, FieldsetLegendA11yPairCheckerOutput>({
  id: "html/fieldset-legend-a11y-pair-checker",
  title: "fieldset/legend A11y Pair Check",
  description: "Checks a fieldset direct-element-child list for a single legend in first position. A legend is optional in HTML; this check reports the structural pairing without claiming complete accessibility.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fieldsetLegendA11yPairCheckerInputSchema,
  outputSchema: fieldsetLegendA11yPairCheckerOutputSchema,
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
        "id": "legendCount",
        "label": "Legend Count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "legendFirst",
        "label": "Legend First",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "validPlacement",
        "label": "Valid Placement",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "hasLegend",
        "label": "Has Legend",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateFieldsetLegendA11yPairChecker,
});
export const runFieldsetLegendA11yPairChecker = fieldsetLegendA11yPairCheckerTool.execute;
export default fieldsetLegendA11yPairCheckerTool;
