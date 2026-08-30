import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { truthAssignment } from "../cnf-clause-set-from-truth-table-builder/tool.js";
export type MaxtermIndexComplementConventionCheckerInput = {
  readonly variables: ReadonlyArray<string>;
  readonly index: number;
  readonly negated: ReadonlyArray<boolean>;
};
export type MaxtermIndexComplementConventionCheckerOutput = {
  readonly maxterm: string;
  readonly conventionMatches: boolean;
};
export const maxtermIndexComplementConventionCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "variables": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 100,
        "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])"
      },
      "minItems": 0,
      "maxItems": 52,
      "description": "Distinct variables in most-significant-bit order"
    },
    "index": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Maxterm index"
    },
    "negated": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 0,
      "maxItems": 52,
      "description": "Proposed negation mask"
    }
  },
  "required": [
    "variables",
    "index",
    "negated"
  ]
} as const satisfies ToolJsonSchema;
export const maxtermIndexComplementConventionCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "maxterm": {
      "type": "string",
      "description": "Maxterm formula"
    },
    "conventionMatches": {
      "type": "boolean",
      "description": "Negation convention matches"
    }
  },
  "required": [
    "maxterm",
    "conventionMatches"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateMaxtermIndexComplementConventionChecker = (rawInput: unknown): ToolResult<MaxtermIndexComplementConventionCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly variables?: unknown; readonly index?: unknown; readonly negated?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "variables",
  "index",
  "negated"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const variablesValue = candidate.variables;
  if (!Array.isArray(variablesValue)) return issue("variables", "invalid_type", "Enter a dense array.");
  if (variablesValue.length < 0) return issue("variables", "out_of_range", "Too few entries.");
  if (variablesValue.length > 52) return issue("variables", "resource_limit", "Array exceeds the 52-entry resource limit.");
  const validatedVariables: string[] = [];
  for (let index = 0; index < variablesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(variablesValue, index)) return issue(`variables.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = variablesValue[index];
    if (typeof item !== "string") return issue(`variables.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 100) return issue(`variables.${index}`, "resource_limit", "Text exceeds the 100-character resource limit.");
    if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(item)) return issue(`variables.${index}`, "invalid_format", "Text does not match the accepted syntax.");
    validatedVariables.push(item);
  }
  if (validatedVariables.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("variables", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const indexValue = candidate.index;
  if (typeof indexValue !== "number" || !Number.isSafeInteger(indexValue)) return issue("index", "invalid_type", "Enter a finite safe integer.");
  if (indexValue < 0) return issue("index", "out_of_range", "Value is outside the accepted range.");
  if (indexValue > 9007199254740991) return issue("index", "out_of_range", "Value is outside the accepted range.");
  const negatedValue = candidate.negated;
  if (!Array.isArray(negatedValue)) return issue("negated", "invalid_type", "Enter a dense array.");
  if (negatedValue.length < 0) return issue("negated", "out_of_range", "Too few entries.");
  if (negatedValue.length > 52) return issue("negated", "resource_limit", "Array exceeds the 52-entry resource limit.");
  const validatedNegated: boolean[] = [];
  for (let index = 0; index < negatedValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(negatedValue, index)) return issue(`negated.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = negatedValue[index];
    if (typeof item !== "boolean") return issue(`negated.${index}`, "invalid_type", "Enter a boolean value.");
    validatedNegated.push(item);
  }

  const input: MaxtermIndexComplementConventionCheckerInput = { variables: validatedVariables, index: indexValue, negated: validatedNegated };
  if (new Set(input.variables).size !== input.variables.length) return issue("variables", "duplicate_variable", "Variable identifiers must be distinct.");
  if (input.index >= 2 ** input.variables.length) return issue("index", "out_of_range", "Index exceeds the variable bit width.");
  if (input.negated.length !== input.variables.length) return issue("negated", "length_mismatch", "Provide one negation flag per variable.");
  const assignment = truthAssignment(input.index, input.variables.length);
  return toolSuccess({ maxterm: input.variables.map((name, index) => `${assignment[index] ? "!" : ""}${name}`).join(" || ") || "false", conventionMatches: input.negated.every((value, index) => value === assignment[index]) });
};
export const example = {
  input: {
    "variables": [
      "p",
      "q"
    ],
    "index": 1,
    "negated": [
      false,
      true
    ]
  },
  output: {
    "maxterm": "p || !q",
    "conventionMatches": true
  },
} satisfies ToolExample<MaxtermIndexComplementConventionCheckerInput, MaxtermIndexComplementConventionCheckerOutput>;
export const maxtermIndexComplementConventionCheckerTool = defineTool<MaxtermIndexComplementConventionCheckerInput, MaxtermIndexComplementConventionCheckerOutput>({
  id: "logic/maxterm-index-complement-convention-checker",
  title: "Maxterm Index Complement Convention Checker",
  description: "Construct a maxterm from a binary row index and check a proposed most-significant-bit negation mask.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: maxtermIndexComplementConventionCheckerInputSchema,
  outputSchema: maxtermIndexComplementConventionCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "variables",
        "label": "Distinct variables in most-significant-bit order",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "index",
        "label": "Maxterm index",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "negated",
        "label": "Proposed negation mask",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "maxterm",
        "label": "Maxterm formula",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      },
      {
        "id": "conventionMatches",
        "label": "Negation convention matches",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateMaxtermIndexComplementConventionChecker,
});
export const runMaxtermIndexComplementConventionChecker = maxtermIndexComplementConventionCheckerTool.execute;
export default maxtermIndexComplementConventionCheckerTool;
