import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type JwkKidNamingUniquenessCheckerInput = {
  readonly keyIds: ReadonlyArray<string>;
};
export type JwkKidNamingUniquenessCheckerOutput = {
  readonly unique: boolean;
  readonly duplicates: ReadonlyArray<string>;
};
export const jwkKidNamingUniquenessCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "keyIds": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 1000
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "JWK key IDs"
    }
  },
  "required": [
    "keyIds"
  ]
} as const satisfies ToolJsonSchema;
export const jwkKidNamingUniquenessCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "unique": {
      "type": "boolean",
      "description": "All supplied IDs distinct"
    },
    "duplicates": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Repeated key IDs in first-repeat order"
    }
  },
  "required": [
    "unique",
    "duplicates"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc7517#section-4.5
export const calculateJwkKidNamingUniquenessChecker = (rawInput: unknown): ToolResult<JwkKidNamingUniquenessCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly keyIds?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "keyIds"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const keyIdsValue = candidate.keyIds;
if (!Array.isArray(keyIdsValue)) return issue("keyIds", "invalid_type", "Enter a dense array.");
if (keyIdsValue.length < 0) return issue("keyIds", "out_of_range", "Too few entries.");
if (keyIdsValue.length > 1000) return issue("keyIds", "resource_limit", "Array exceeds the 1000-entry resource limit.");
const validatedKeyids: string[] = [];
for (let index = 0; index < keyIdsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(keyIdsValue, index)) return issue(`keyIds.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = keyIdsValue[index];
if (typeof item !== "string") return issue(`keyIds.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 1000) return issue(`keyIds.${index}`, "resource_limit", "Text exceeds the 1000-character resource limit.");
validatedKeyids.push(item);
}
if (validatedKeyids.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("keyIds", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: JwkKidNamingUniquenessCheckerInput = { keyIds: validatedKeyids };
  const seen = new Set<string>(), repeated = new Set<string>();
  for (const id of input.keyIds) { if (seen.has(id)) repeated.add(id); seen.add(id); }
  return toolSuccess({ unique: repeated.size === 0, duplicates: [...repeated] });
};
export const example = {
  "input": {
    "keyIds": [
      "signing-1",
      "signing-2",
      "signing-1"
    ]
  },
  "output": {
    "unique": false,
    "duplicates": [
      "signing-1"
    ]
  }
} satisfies ToolExample<JwkKidNamingUniquenessCheckerInput, JwkKidNamingUniquenessCheckerOutput>;
export const jwkKidNamingUniquenessCheckerTool = defineTool<JwkKidNamingUniquenessCheckerInput, JwkKidNamingUniquenessCheckerOutput>({
  id: "cryptography/jwk-kid-naming-uniqueness-checker",
  title: "JWK kid Uniqueness Check",
  description: "Find repeated case-sensitive key IDs in a supplied JWK key-ID list without treating every duplicate as a standards violation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: jwkKidNamingUniquenessCheckerInputSchema,
  outputSchema: jwkKidNamingUniquenessCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "keyIds",
        "label": "JWK key IDs",
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
        "id": "unique",
        "label": "All supplied IDs distinct",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "duplicates",
        "label": "Repeated key IDs in first-repeat order",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateJwkKidNamingUniquenessChecker,
});
export const runJwkKidNamingUniquenessChecker = jwkKidNamingUniquenessCheckerTool.execute;
export default jwkKidNamingUniquenessCheckerTool;
