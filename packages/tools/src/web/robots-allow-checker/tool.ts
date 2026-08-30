import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { utf8Encode } from "../../core/encoding.js";

// Method reference: https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2
export type RobotsAllowCheckerInput = {
  readonly robots: string;
  readonly productToken: string;
  readonly path: string;
};
export type RobotsAllowCheckerOutput = {
  readonly allowed: boolean;
  readonly matchedRule: string;
};
export const robotsAllowCheckerInputSchema = {"type":"object","additionalProperties":false,"properties":{"robots":{"type":"string","maxLength":1000000,"description":"robots.txt contents already acquired by the caller."},"productToken":{"type":"string","maxLength":1000000,"description":"Crawler product token, containing letters, underscores, and hyphens."},"path":{"type":"string","maxLength":1000000,"description":"URL path and optional query, beginning with a slash."}},"required":["robots","productToken","path"]} as const satisfies ToolJsonSchema;
export const robotsAllowCheckerOutputSchema = {"type":"object","additionalProperties":false,"properties":{"allowed":{"type":"boolean","description":"Whether the selected rules permit the path."},"matchedRule":{"type":"string","maxLength":1000000,"description":"Winning rule text, empty when no rule matches."}},"required":["allowed","matchedRule"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

const normalizedPath = (path:string):string => {
  let result="";for(let i=0;i<path.length;i++){
    const c=path[i];if(c==="%"&&/^[0-9a-fA-F]{2}$/.test(path.slice(i+1,i+3))){const byte=Number.parseInt(path.slice(i+1,i+3),16);result+=/^[A-Za-z0-9._~-]$/.test(String.fromCharCode(byte))?String.fromCharCode(byte):"%"+path.slice(i+1,i+3).toUpperCase();i+=2;}
    else {const point=path.codePointAt(i);if(point===undefined)break;if(point>127){result+=utf8Encode(String.fromCodePoint(point)).map(byte=>"%"+byte.toString(16).toUpperCase().padStart(2,"0")).join("");if(point>0xffff)i++;}else result+=c;}
  }return result;
};
const matchesRobotsPattern=(path:string,pattern:string):boolean=>{
  const anchored=pattern.endsWith("$");if(anchored)pattern=pattern.slice(0,-1);
  if(!anchored)pattern+="*";
  let p=0,t=0,star=-1,retry=0;
  while(t<path.length){if(p<pattern.length&&pattern[p]===path[t]){p++;t++;}else if(pattern[p]==="*"){star=p++;retry=t;}else if(star>=0){p=star+1;t=++retry;}else return false;}
  while(pattern[p]==="*")p++;return p===pattern.length;
};

export const calculateRobotsAllowChecker = (input: unknown): ToolResult<RobotsAllowCheckerOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = robotsAllowCheckerInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, robotsAllowCheckerInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["robots","productToken","path"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: RobotsAllowCheckerInput = {
    robots: values.robots as string,
    productToken: values.productToken as string,
    path: values.path as string
  };
  if(!/^[A-Za-z_-]+$/.test(x.productToken))return fail("productToken","Provide one crawler product token.","invalid_product_token");
  if(!x.path.startsWith("/"))return fail("path","The path must begin with a slash.","invalid_path");
  const groups:{agents:string[];rules:{allow:boolean;path:string}[]}[]=[];let current:{agents:string[];rules:{allow:boolean;path:string}[]}|null=null,startedRules=false;
  for(const line of x.robots.replace(/^\ufeff/,"").split(/\r\n|\r|\n/)){
    const raw=line.split("#")[0],colon=raw.indexOf(":");if(colon<0)continue;const name=raw.slice(0,colon).trim().toLowerCase(),value=raw.slice(colon+1).trim();
    if(name==="user-agent"){
      if(!/^(?:\*|[A-Za-z_-]+)$/.test(value))continue;
      if(!current||startedRules){current={agents:[],rules:[]};groups.push(current);startedRules=false;}current.agents.push(value.toLowerCase());
    }else if((name==="allow"||name==="disallow")&&current){startedRules=true;if(value.startsWith("/"))current.rules.push({allow:name==="allow",path:value});}
  }
  const exact=groups.filter(group=>group.agents.includes(x.productToken.toLowerCase()));
  const selected=exact.length>0?exact:groups.filter(group=>group.agents.includes("*"));
  let best=-1,allowed=true,matchedRule="";const path=normalizedPath(x.path);
  for(const group of selected)for(const rule of group.rules){const pattern=normalizedPath(rule.path);if(!matchesRobotsPattern(path,pattern))continue;
    const literals=pattern.replace(/\*/g,"").replace(/\$$/,"");const length=literals.replace(/%[0-9A-F]{2}/g,"x").length;
    if(length>best||length===best&&rule.allow&&!allowed){best=length;allowed=rule.allow;matchedRule=(rule.allow?"Allow: ":"Disallow: ")+rule.path;}
  }
  const output: RobotsAllowCheckerOutput = {allowed,matchedRule};
  if (!matchesToolJsonSchema(output, robotsAllowCheckerOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const robotsAllowCheckerTool = defineTool<RobotsAllowCheckerInput, RobotsAllowCheckerOutput>({
  id: "web/robots-allow-checker", title: "Robots Allow Checker", description: "Evaluate supplied robots.txt groups for an exact crawler product token and path using RFC 9309 wildcard, longest-rule, and allow-tie semantics.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateRobotsAllowChecker,
  inputSchema: robotsAllowCheckerInputSchema, outputSchema: robotsAllowCheckerOutputSchema,
  ports: {inputs: [{"id":"robots","label":"robots.txt contents already acquired by the caller","description":"robots.txt contents already acquired by the caller.","valueType":{"type":"string"},"required":true},{"id":"productToken","label":"Crawler product token, containing letters, underscores, and hyphens","description":"Crawler product token, containing letters, underscores, and hyphens.","valueType":{"type":"string"},"required":true},{"id":"path","label":"URL path and optional query, beginning with a slash","description":"URL path and optional query, beginning with a slash.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"allowed","label":"Whether the selected rules permit the path","description":"Whether the selected rules permit the path.","valueType":{"type":"boolean"}},{"id":"matchedRule","label":"Winning rule text, empty when no rule matches","description":"Winning rule text, empty when no rule matches.","valueType":{"type":"string"}}]},
});
export const runRobotsAllowChecker = robotsAllowCheckerTool.execute;
export const example = {"input":{"robots":"User-agent: *\nDisallow: /private\nAllow: /private/public\n","productToken":"ExampleBot","path":"/private/public/article"},"output":{"allowed":true,"matchedRule":"Allow: /private/public"}} satisfies ToolExample<RobotsAllowCheckerInput, RobotsAllowCheckerOutput>;
export default robotsAllowCheckerTool;
