import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseUrl, type PortableUrl } from "../../core/url.js";

export type UrlDomainExtractPerCellInput = {
  readonly values: ReadonlyArray<string>;
};
export type UrlDomainExtractPerCellOutput = {
  readonly hostnames: ReadonlyArray<string>;
};
export const urlDomainExtractPerCellInputSchema = {
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
export const urlDomainExtractPerCellOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hostnames": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Hostnames"
    }
  },
  "required": [
    "hostnames"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://url.spec.whatwg.org/
export const calculateUrlDomainExtractPerCell = (rawInput: unknown): ToolResult<UrlDomainExtractPerCellOutput> => {
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
  const input: UrlDomainExtractPerCellInput = { values: validatedValues };
  const hostnames: string[] = [];
  for (const [index, cell] of input.values.entries()) {
    let url: PortableUrl;
    try { url = parseUrl(cell.trim()); }
    catch (error) { if (error instanceof TypeError) return issue(`values.${index}`, "invalid_url", "Enter an absolute HTTP or HTTPS URL."); throw error; }
    if ((url.protocol !== "http:" && url.protocol !== "https:") || url.hostname === "") return issue(`values.${index}`, "invalid_url", "Enter an absolute HTTP or HTTPS URL with a host.");
    hostnames.push(url.hostname);
  }
  return toolSuccess({ hostnames });
};
export const example = {
  input: {
    "values": [
      "https://News.Example.org:8443/story",
      "http://127.0.0.1/a"
    ]
  },
  output: {
    "hostnames": [
      "news.example.org",
      "127.0.0.1"
    ]
  },
} satisfies ToolExample<UrlDomainExtractPerCellInput, UrlDomainExtractPerCellOutput>;
export const urlDomainExtractPerCellTool = defineTool<UrlDomainExtractPerCellInput, UrlDomainExtractPerCellOutput>({
  id: "csv/url-domain-extract-per-cell",
  title: "URL Domain Extract Per Cell",
  description: "Extract normalized hostnames from absolute HTTP or HTTPS URL cells using the URL Standard; hostnames include subdomains and are not registrable-domain guesses.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: urlDomainExtractPerCellInputSchema,
  outputSchema: urlDomainExtractPerCellOutputSchema,
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
        "id": "hostnames",
        "label": "Hostnames",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateUrlDomainExtractPerCell,
});
export const runUrlDomainExtractPerCell = urlDomainExtractPerCellTool.execute;
export default urlDomainExtractPerCellTool;
