import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://w3c.github.io/webappsec-csp/#parse-serialized-policy
export type CspParserInput = {
  readonly policy: string;
};
export type CspParserOutput = {
  readonly directives: readonly {readonly name:string;readonly values:readonly string[]}[];
};
export const cspParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"policy":{"type":"string","maxLength":1000000,"description":"One Content-Security-Policy field policy."}},"required":["policy"]} as const satisfies ToolJsonSchema;
export const cspParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"directives":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"values":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000}},"required":["name","values"]},"minItems":0,"maxItems":100000,"description":"Directives in source order."}},"required":["directives"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCspParser = (input: unknown): ToolResult<CspParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = cspParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, cspParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["policy"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CspParserInput = {
    policy: values.policy as string
  };
  const directives:{name:string;values:string[]}[]=[], names=new Set<string>();
  if(/[^\x09\x20-\x7e]/.test(x.policy))return fail("policy","A serialized policy must contain ASCII header characters.","malformed_policy");
  for(const part of x.policy.split(";")) {
    const tokens=part.trim().split(/[\t ]+/),name=tokens[0].toLowerCase();if(!name)continue;
    if(!/^[A-Za-z0-9-]+$/.test(name))return fail("policy","Invalid directive name.","malformed_policy");
    if(!names.has(name)){names.add(name);directives.push({name,values:tokens.slice(1)});}
  }
  const output: CspParserOutput = {directives};
  if (!matchesToolJsonSchema(output, cspParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const cspParserTool = defineTool<CspParserInput, CspParserOutput>({
  id: "web/csp-parser", title: "Content Security Policy Parser", description: "Parse one serialized CSP policy into lowercase directive names and source tokens, keeping the first occurrence of each directive.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCspParser,
  inputSchema: cspParserInputSchema, outputSchema: cspParserOutputSchema,
  ports: {inputs: [{"id":"policy","label":"One Content-Security-Policy field policy","description":"One Content-Security-Policy field policy.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"directives","label":"Directives in source order","description":"Directives in source order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runCspParser = cspParserTool.execute;
export const example = {"input":{"policy":"default-src 'self'; IMG-SRC https: data:; img-src 'none'"},"output":{"directives":[{"name":"default-src","values":["'self'"]},{"name":"img-src","values":["https:","data:"]}]}} satisfies ToolExample<CspParserInput, CspParserOutput>;
export default cspParserTool;
