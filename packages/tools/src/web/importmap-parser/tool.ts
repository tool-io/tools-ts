import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://html.spec.whatwg.org/multipage/webappapis.html#import-maps
export type ImportmapParserInput = {
  readonly json: string;
};
export type ImportmapParserOutput = {
  readonly imports: readonly {readonly specifier:string;readonly address:string|null}[];
  readonly scopes: readonly {readonly scope:string;readonly imports:readonly {readonly specifier:string;readonly address:string|null}[]}[];
};
export const importmapParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"json":{"type":"string","maxLength":1000000,"description":"Import-map JSON object."}},"required":["json"]} as const satisfies ToolJsonSchema;
export const importmapParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"imports":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"specifier":{"type":"string","maxLength":1000000},"address":{"anyOf":[{"type":"string","maxLength":1000000},{"type":"null"}]}},"required":["specifier","address"]},"minItems":0,"maxItems":100000,"description":"Top-level specifier mappings."},"scopes":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"scope":{"type":"string","maxLength":1000000},"imports":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"specifier":{"type":"string","maxLength":1000000},"address":{"anyOf":[{"type":"string","maxLength":1000000},{"type":"null"}]}},"required":["specifier","address"]},"minItems":0,"maxItems":100000}},"required":["scope","imports"]},"minItems":0,"maxItems":100000,"description":"Scoped specifier mappings."}},"required":["imports","scopes"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateImportmapParser = (input: unknown): ToolResult<ImportmapParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = importmapParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, importmapParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["json"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ImportmapParserInput = {
    json: values.json as string
  };
  let map:unknown;try{map=JSON.parse(x.json);}catch(error){if(error instanceof SyntaxError)return fail("json","Provide valid JSON.","malformed_json");throw error;}
  if(!isRecord(map))return fail("json","Import map must be an object.","object_required");
  const readMappings=(value:unknown):{specifier:string;address:string|null}[]|null=>{
    if(!isRecord(value))return null;const entries:{specifier:string;address:string|null}[]=[];
    for(const [specifier,address] of Object.entries(value)){if(!specifier||address!==null&&typeof address!=="string")return null;entries.push({specifier,address});}return entries;
  };
  const imports=readMappings(map.imports === undefined ? {} : map.imports);if(!imports)return fail("json","Import addresses must be strings or null.","invalid_imports");
  const scopes:{scope:string;imports:{specifier:string;address:string|null}[]}[]=[];
  if(map.scopes!==undefined){if(!isRecord(map.scopes))return fail("json","Scopes must be an object.","invalid_scopes");for(const [scope,value] of Object.entries(map.scopes)){const entries=readMappings(value);if(!entries)return fail("json","Scope mappings must be objects with string or null addresses.","invalid_scopes");scopes.push({scope,imports:entries});}}
  const output: ImportmapParserOutput = {imports,scopes};
  if (!matchesToolJsonSchema(output, importmapParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const importmapParserTool = defineTool<ImportmapParserInput, ImportmapParserOutput>({
  id: "web/importmap-parser", title: "Import Map Parser", description: "Parse imports and scopes from import-map JSON into portable entries, preserving null addresses and leaving URL resolution to the caller.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateImportmapParser,
  inputSchema: importmapParserInputSchema, outputSchema: importmapParserOutputSchema,
  ports: {inputs: [{"id":"json","label":"Import-map JSON object","description":"Import-map JSON object.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"imports","label":"Top-level specifier mappings","description":"Top-level specifier mappings.","valueType":{"type":"list","items":{"type":"object"}}},{"id":"scopes","label":"Scoped specifier mappings","description":"Scoped specifier mappings.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runImportmapParser = importmapParserTool.execute;
export const example = {"input":{"json":"{\"imports\":{\"lib\":\"/lib.js\",\"blocked\":null},\"scopes\":{\"/app/\":{\"lib\":\"/v2.js\"}}}"},"output":{"imports":[{"specifier":"lib","address":"/lib.js"},{"specifier":"blocked","address":null}],"scopes":[{"scope":"/app/","imports":[{"specifier":"lib","address":"/v2.js"}]}]}} satisfies ToolExample<ImportmapParserInput, ImportmapParserOutput>;
export default importmapParserTool;
