import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../../html/tag-counter/tool.js";
import {getHtmlAttribute} from "../../html/attribute-parser/tool.js";
// Method reference: https://www.w3.org/TR/json-ld11/#embedding-json-ld-in-html-documents
export type StructuredDataExtractorInput = {
  readonly html: string;
};
export type StructuredDataExtractorOutput = {
  readonly documents: readonly string[];
};
export const structuredDataExtractorInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source containing JSON-LD script elements."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const structuredDataExtractorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"documents":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Normalized JSON-LD document strings."}},"required":["documents"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateStructuredDataExtractor = (input: unknown): ToolResult<StructuredDataExtractorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = structuredDataExtractorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, structuredDataExtractorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: StructuredDataExtractorInput = {
    html: values.html as string
  };
  const documents:string[]=[]; let collecting=false, text="";
  for(const token of scanHtmlTokens(x.html)) {
    if(token.kind === "start" && token.name === "script" && token.tag) {collecting=(getHtmlAttribute(token.tag,"type")??"").toLowerCase().trim()==="application/ld+json";text="";}
    else if(token.kind === "text" && collecting)text+=token.raw;
    else if(token.kind === "end" && token.name === "script" && collecting) {
      let document:unknown;try{document=JSON.parse(text);}catch(error){if(error instanceof SyntaxError)return fail("html","A JSON-LD script contains malformed JSON.","malformed_json");throw error;}
      if(typeof document!=="object" || document===null)return fail("html","A JSON-LD document must be an object or array.","invalid_jsonld");
      documents.push(JSON.stringify(document));collecting=false;
    }
  }
  if(collecting)return fail("html","A JSON-LD script is not closed.","unclosed_script");
  const output: StructuredDataExtractorOutput = {documents};
  if (!matchesToolJsonSchema(output, structuredDataExtractorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const structuredDataExtractorTool = defineTool<StructuredDataExtractorInput, StructuredDataExtractorOutput>({
  id: "web/structured-data-extractor", title: "JSON-LD Structured Data Extractor", description: "Extract valid application/ld+json script documents from HTML as normalized JSON strings, without resolving remote contexts.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateStructuredDataExtractor,
  inputSchema: structuredDataExtractorInputSchema, outputSchema: structuredDataExtractorOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source containing JSON-LD script elements","description":"HTML source containing JSON-LD script elements.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"documents","label":"Normalized JSON-LD document strings","description":"Normalized JSON-LD document strings.","valueType":{"type":"list","items":{"type":"string"}}}]},
});
export const runStructuredDataExtractor = structuredDataExtractorTool.execute;
export const example = {"input":{"html":"<script type=\"application/ld+json\">{ \"@type\": \"Article\", \"name\": \"Example\" }</script>"},"output":{"documents":["{\"@type\":\"Article\",\"name\":\"Example\"}"]}} satisfies ToolExample<StructuredDataExtractorInput, StructuredDataExtractorOutput>;
export default structuredDataExtractorTool;
