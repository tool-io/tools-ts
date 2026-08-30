import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CnfClauseSetFromTruthTableBuilderInput = {
  readonly variables: ReadonlyArray<string>;
  readonly values: ReadonlyArray<boolean>;
};
export type CnfClauseSetFromTruthTableBuilderOutput = {
  readonly clauses: ReadonlyArray<string>;
  readonly formula: string;
};
export const cnfClauseSetFromTruthTableBuilderInputSchema = {
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
      "maxItems": 12,
      "description": "Distinct variables in most-significant-bit order"
    },
    "values": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 1,
      "maxItems": 4096,
      "description": "Truth values in binary counting order"
    }
  },
  "required": [
    "variables",
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const cnfClauseSetFromTruthTableBuilderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "clauses": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Canonical CNF clauses"
    },
    "formula": {
      "type": "string",
      "description": "Conjunctive normal form"
    }
  },
  "required": [
    "clauses",
    "formula"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
export const truthAssignment = (row: number, variableCount: number): boolean[] =>
  Array.from({ length: variableCount }, (_, index) => Math.floor(row / 2 ** (variableCount - index - 1)) % 2 === 1);
// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateCnfClauseSetFromTruthTableBuilder = (rawInput: unknown): ToolResult<CnfClauseSetFromTruthTableBuilderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly variables?: unknown; readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "variables",
  "values"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const variablesValue = candidate.variables;
  if (!Array.isArray(variablesValue)) return issue("variables", "invalid_type", "Enter a dense array.");
  if (variablesValue.length < 0) return issue("variables", "out_of_range", "Too few entries.");
  if (variablesValue.length > 12) return issue("variables", "resource_limit", "Array exceeds the 12-entry resource limit.");
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
  const valuesValue = candidate.values;
  if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
  if (valuesValue.length < 1) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 4096) return issue("values", "resource_limit", "Array exceeds the 4096-entry resource limit.");
  const validatedValues: boolean[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "boolean") return issue(`values.${index}`, "invalid_type", "Enter a boolean value.");
    validatedValues.push(item);
  }

  const input: CnfClauseSetFromTruthTableBuilderInput = { variables: validatedVariables, values: validatedValues };
  if (new Set(input.variables).size !== input.variables.length) return issue("variables", "duplicate_variable", "Variable identifiers must be distinct.");
  if (input.values.length !== 2 ** input.variables.length) return issue("values", "length_mismatch", "Supply exactly 2^variableCount rows in binary counting order.");
  const clauses: string[] = [];
  let characters = 0;
  for (let row = 0; row < input.values.length; row++) {
    if (input.values[row]) continue;
    const bits = truthAssignment(row, input.variables.length);
    const clause = input.variables.map((name, index) => `${bits[index] ? "!" : ""}${name}`).join(" || ") || "false";
    characters += clause.length + 6;
    if (characters > 200000) return issue("variables", "resource_limit", "Rendered normal form exceeds 200,000 characters.");
    clauses.push(clause);
  }
  const formula = clauses.length === 0 ? "true" : clauses.map((clause) => `(${clause})`).join(" && ");
  return toolSuccess({ clauses, formula });
};
export const example = {
  input: {
    "variables": [
      "p",
      "q"
    ],
    "values": [
      true,
      false,
      false,
      true
    ]
  },
  output: {
    "clauses": [
      "p || !q",
      "!p || q"
    ],
    "formula": "(p || !q) && (!p || q)"
  },
} satisfies ToolExample<CnfClauseSetFromTruthTableBuilderInput, CnfClauseSetFromTruthTableBuilderOutput>;
export const cnfClauseSetFromTruthTableBuilderTool = defineTool<CnfClauseSetFromTruthTableBuilderInput, CnfClauseSetFromTruthTableBuilderOutput>({
  id: "logic/cnf-clause-set-from-truth-table-builder",
  title: "Full CNF Clause Set Builder from Truth Table",
  description: "Build equivalent canonical CNF clauses from every false truth-table row without auxiliary variables.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: cnfClauseSetFromTruthTableBuilderInputSchema,
  outputSchema: cnfClauseSetFromTruthTableBuilderOutputSchema,
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
        "id": "values",
        "label": "Truth values in binary counting order",
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
        "id": "clauses",
        "label": "Canonical CNF clauses",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "formula",
        "label": "Conjunctive normal form",
        "valueType": {
          "type": "string",
          "format": "propositional-formula"
        }
      }
    ]
  },
  execute: calculateCnfClauseSetFromTruthTableBuilder,
});
export const runCnfClauseSetFromTruthTableBuilder = cnfClauseSetFromTruthTableBuilderTool.execute;
export default cnfClauseSetFromTruthTableBuilderTool;
