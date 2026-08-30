import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DataAttributeNamingValidatorInput = {
  readonly name: string;
};
export type DataAttributeNamingValidatorOutput = {
  readonly valid: boolean;
  readonly datasetKey: string;
};
export const dataAttributeNamingValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 1000,
      "description": "Name"
    }
  },
  "required": [
    "name"
  ]
} as const satisfies ToolJsonSchema;
export const dataAttributeNamingValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "boolean",
      "description": "Valid"
    },
    "datasetKey": {
      "type": "string",
      "description": "Dataset Key"
    }
  },
  "required": [
    "valid",
    "datasetKey"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes; https://dom.spec.whatwg.org/#valid-attribute-local-name
export const calculateDataAttributeNamingValidator = (rawInput: unknown): ToolResult<DataAttributeNamingValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly name?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "name"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nameValue = candidate.name;
if (typeof nameValue !== "string") return issue("name", "invalid_type", "Enter a string value.");
if (nameValue.length > 1000) return issue("name", "resource_limit", "Text exceeds the 1000-character resource limit.");
  const input: DataAttributeNamingValidatorInput = { name: nameValue };
  const valid = input.name.startsWith("data-") && input.name.length > 5 && !/[A-Z\u0000\t\n\f\r \/>=]/u.test(input.name);
  return toolSuccess({ valid, datasetKey: valid ? input.name.slice(5).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()) : "" });
};
export const example = {
  "input": {
    "name": "data-user-id"
  },
  "output": {
    "valid": true,
    "datasetKey": "userId"
  }
} satisfies ToolExample<DataAttributeNamingValidatorInput, DataAttributeNamingValidatorOutput>;
export const dataAttributeNamingValidatorTool = defineTool<DataAttributeNamingValidatorInput, DataAttributeNamingValidatorOutput>({
  id: "html/data-attribute-naming-validator",
  title: "data-* Attribute Naming Validator",
  description: "Validates a namespace-less DOM data-* attribute local name and derives its dataset property name. Supply the DOM name after any HTML parser lowercasing.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dataAttributeNamingValidatorInputSchema,
  outputSchema: dataAttributeNamingValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "name",
        "label": "Name",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "datasetKey",
        "label": "Dataset Key",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateDataAttributeNamingValidator,
});
export const runDataAttributeNamingValidator = dataAttributeNamingValidatorTool.execute;
export default dataAttributeNamingValidatorTool;
