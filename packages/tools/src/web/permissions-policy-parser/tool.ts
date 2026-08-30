import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitHeaderValue} from "../../http/content-type-parser/tool.js";
// Method reference: https://www.w3.org/TR/permissions-policy/#structured-header
export type PermissionsPolicyParserInput = {
  readonly header: string;
};
export type PermissionsPolicyParserOutput = {
  readonly features: readonly {readonly feature:string;readonly allowlist:readonly string[]}[];
};
export const permissionsPolicyParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Permissions-Policy field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const permissionsPolicyParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"features":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"feature":{"type":"string","maxLength":1000000},"allowlist":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000}},"required":["feature","allowlist"]},"minItems":0,"maxItems":100000,"description":"Declared feature allowlists."}},"required":["features"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculatePermissionsPolicyParser = (input: unknown): ToolResult<PermissionsPolicyParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = permissionsPolicyParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, permissionsPolicyParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: PermissionsPolicyParserInput = {
    header: values.header as string
  };
  const features:{feature:string;allowlist:string[]}[]=[],names=new Set<string>();
  const groups=splitHeaderValue(x.header,",");if(!groups)return fail("header","Unbalanced policy header.","malformed_policy");
  for(const group of groups){if(!group)continue;const match=/^([a-z][a-z0-9_-]*)\s*=\s*(\*|\([\s\S]*\))$/.exec(group);if(!match)return fail("header","Unsupported feature policy syntax.","malformed_policy");
    const feature=match[1],allowlist:string[]=[];
    if(names.has(feature))return fail("header","Feature names must be unique.","duplicate_feature");names.add(feature);
    if(match[2]==="*")allowlist.push("*");else{let rest=match[2].slice(1,-1).trim();while(rest){const token=/^(self|"(?:[^"\\\r\n]|\\["\\])*")(?=[\t ]|$)/.exec(rest);if(!token)return fail("header","Allowlists must contain self or quoted origins.","malformed_policy");allowlist.push(token[1].startsWith('"')?token[1].slice(1,-1).replace(/\\(["\\])/g,"$1"):token[1]);rest=rest.slice(token[0].length).trim();}}
    features.push({feature,allowlist});
  }
  const output: PermissionsPolicyParserOutput = {features};
  if (!matchesToolJsonSchema(output, permissionsPolicyParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const permissionsPolicyParserTool = defineTool<PermissionsPolicyParserInput, PermissionsPolicyParserOutput>({
  id: "web/permissions-policy-parser", title: "Permissions Policy Parser", description: "Parse feature allowlists from Permissions-Policy dictionary syntax, supporting wildcard, self, and quoted origins without evaluating permissions.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculatePermissionsPolicyParser,
  inputSchema: permissionsPolicyParserInputSchema, outputSchema: permissionsPolicyParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Permissions-Policy field value","description":"Permissions-Policy field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"features","label":"Declared feature allowlists","description":"Declared feature allowlists.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runPermissionsPolicyParser = permissionsPolicyParserTool.execute;
export const example = {"input":{"header":"camera=(), geolocation=(self \"https://maps.example\"), fullscreen=*"},"output":{"features":[{"feature":"camera","allowlist":[]},{"feature":"geolocation","allowlist":["self","https://maps.example"]},{"feature":"fullscreen","allowlist":["*"]}]}} satisfies ToolExample<PermissionsPolicyParserInput, PermissionsPolicyParserOutput>;
export default permissionsPolicyParserTool;
