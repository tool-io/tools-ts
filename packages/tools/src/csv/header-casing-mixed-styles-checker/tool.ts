import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type HeaderCasingMixedStylesCheckerInput = {
  readonly headers: ReadonlyArray<string>;
};
export type HeaderCasingMixedStylesCheckerOutput = {
  readonly styles: ReadonlyArray<string>;
  readonly distinctStyles: ReadonlyArray<string>;
  readonly mixed: boolean;
};
export const headerCasingMixedStylesCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "headers": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Headers"
    }
  },
  "required": [
    "headers"
  ]
} as const satisfies ToolJsonSchema;
export const headerCasingMixedStylesCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "styles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Styles"
    },
    "distinctStyles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Distinct styles"
    },
    "mixed": {
      "type": "boolean",
      "description": "Mixed"
    }
  },
  "required": [
    "styles",
    "distinctStyles",
    "mixed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateHeaderCasingMixedStylesChecker = (rawInput: unknown): ToolResult<HeaderCasingMixedStylesCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly headers?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "headers"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const headersValue = candidate.headers;
  if (!Array.isArray(headersValue)) return issue("headers", "invalid_type", "Enter a dense array.");
  if (headersValue.length < 0) return issue("headers", "out_of_range", "Too few entries.");
  if (headersValue.length > 10000) return issue("headers", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedHeaders: string[] = [];
  for (let index = 0; index < headersValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(headersValue, index)) return issue(`headers.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = headersValue[index];
    if (typeof item !== "string") return issue(`headers.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`headers.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedHeaders.push(item);
  }
  if (validatedHeaders.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("headers", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: HeaderCasingMixedStylesCheckerInput = { headers: validatedHeaders };
  const styles = input.headers.map((header) => {
    if (/^[a-z][a-z0-9]*$/.test(header)) return "lowercase";
    if (/^[A-Z][A-Z0-9]*$/.test(header)) return "uppercase";
    if (/^[a-z][A-Za-z0-9]*$/.test(header)) return "camel";
    if (/^[A-Z][A-Za-z0-9]*$/.test(header)) return "Pascal";
    if (/^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/.test(header)) return "snake";
    if (/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/.test(header)) return "kebab";
    if (/^[A-Z][a-z0-9]*(?: [A-Z][a-z0-9]*)+$/.test(header)) return "title";
    return "unknown";
  });
  const distinctStyles = [...new Set(styles.filter((style) => style !== "unknown"))];
  return toolSuccess({ styles, distinctStyles, mixed: distinctStyles.length > 1 });
};
export const example = {
  input: {
    "headers": [
      "firstName",
      "last_name",
      "zip-code"
    ]
  },
  output: {
    "styles": [
      "camel",
      "snake",
      "kebab"
    ],
    "distinctStyles": [
      "camel",
      "snake",
      "kebab"
    ],
    "mixed": true
  },
} satisfies ToolExample<HeaderCasingMixedStylesCheckerInput, HeaderCasingMixedStylesCheckerOutput>;
export const headerCasingMixedStylesCheckerTool = defineTool<HeaderCasingMixedStylesCheckerInput, HeaderCasingMixedStylesCheckerOutput>({
  id: "csv/header-casing-mixed-styles-checker",
  title: "Header Casing Mixed-Styles Check",
  description: "Classify ASCII header spelling as lowercase, uppercase, camel, Pascal, snake, kebab, title, or unknown, reporting distinct styles and whether more than one recognized style occurs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: headerCasingMixedStylesCheckerInputSchema,
  outputSchema: headerCasingMixedStylesCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "headers",
        "label": "Headers",
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
        "id": "styles",
        "label": "Styles",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "distinctStyles",
        "label": "Distinct styles",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "mixed",
        "label": "Mixed",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateHeaderCasingMixedStylesChecker,
});
export const runHeaderCasingMixedStylesChecker = headerCasingMixedStylesCheckerTool.execute;
export default headerCasingMixedStylesCheckerTool;
