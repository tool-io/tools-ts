import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitCssTopLevel} from "../variable-parser/tool.js";
// Method reference: https://drafts.csswg.org/selectors-4/#specificity-rules
export type SelectorSpecificityInput = {
  readonly selectors: string;
};
export type SelectorSpecificityOutput = {
  readonly selectors: readonly {readonly selector:string;readonly specificity:{readonly ids:number;readonly classes:number;readonly types:number}}[];
};
export const selectorSpecificityInputSchema = {"type":"object","additionalProperties":false,"properties":{"selectors":{"type":"string","maxLength":1000000,"description":"Comma-separated selector list without CSS nesting ampersands."}},"required":["selectors"]} as const satisfies ToolJsonSchema;
export const selectorSpecificityOutputSchema = {"type":"object","additionalProperties":false,"properties":{"selectors":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"selector":{"type":"string","maxLength":1000000},"specificity":{"type":"object","additionalProperties":false,"properties":{"ids":{"type":"integer"},"classes":{"type":"integer"},"types":{"type":"integer"}},"required":["ids","classes","types"]}},"required":["selector","specificity"]},"minItems":0,"maxItems":100000,"description":"Selector-specific ID, class, and type counts."}},"required":["selectors"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

type Specificity = {ids:number;classes:number;types:number};
const plus = (a:Specificity,b:Specificity):Specificity => ({ids:a.ids+b.ids,classes:a.classes+b.classes,types:a.types+b.types});
const maximum = (values:readonly Specificity[]):Specificity => values.reduce((a,b) => b.ids>a.ids||b.ids===a.ids&&b.classes>a.classes||b.ids===a.ids&&b.classes===a.classes&&b.types>a.types?b:a,{ids:0,classes:0,types:0});
const identifier = /^(?:[-_A-Za-z\u0080-\uffff]|\\(?:[0-9a-fA-F]{1,6}[\t\n\f\r ]?|[^\n\r\f]))(?:[-_A-Za-z0-9\u0080-\uffff]|\\(?:[0-9a-fA-F]{1,6}[\t\n\f\r ]?|[^\n\r\f]))*/;
const closingIndex = (value:string,start:number):number => {
  let quote="",depth=0;const open=value[start],close=open==="["?"]":")";
  for(let i=start;i<value.length;i++){const c=value[i];if(c==="\\"){i++;continue;}if(quote){if(c===quote)quote="";continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c===open)depth++;else if(c===close&&--depth===0)return i;}return -1;
};
export const selectorSpecificity = (selector:string,depth=0):Specificity|null => {
  if(depth>100)return null;
  let sum:Specificity={ids:0,classes:0,types:0},i=0;
  while(i<selector.length){const c=selector[i];
    if(/[\t\n\f\r >+~]/.test(c)){i++;continue;}
    if(c==="|"&&selector[i+1]==="|"){i+=2;continue;}
    if(c==="&")return null;
    if(c==="#"||c==="."){const name=identifier.exec(selector.slice(i+1));if(!name)return null;if(c==="#")sum.ids++;else sum.classes++;i+=name[0].length+1;continue;}
    if(c==="["){const end=closingIndex(selector,i);if(end<0)return null;sum.classes++;i=end+1;continue;}
    if(c===":"){
      const element=selector[i+1]===":";i+=element?2:1;const name=identifier.exec(selector.slice(i));if(!name)return null;i+=name[0].length;
      const pseudo=name[0].toLowerCase(),legacy=["before","after","first-line","first-letter"].includes(pseudo);
      if(element||legacy)sum.types++;else if(pseudo!=="where"&&!["is","not","has"].includes(pseudo))sum.classes++;
      if(selector[i]==="("){
        const end=closingIndex(selector,i);if(end<0)return null;const argument=selector.slice(i+1,end);
        let nested:string|null=null;
        if(["is","not","has","host","host-context"].includes(pseudo)||element&&pseudo==="slotted")nested=argument;
        else if(["nth-child","nth-last-child"].includes(pseudo)){const of=/\s+of\s+/i.exec(argument);if(of)nested=argument.slice(of.index+of[0].length);}
        if(nested!==null){const list=splitCssTopLevel(nested,",");if(!list)return null;const values:Specificity[]=[];for(const part of list){if(!part)return null;const value=selectorSpecificity(part,depth+1);if(!value)return null;values.push(value);}sum=plus(sum,maximum(values));}
        i=end+1;
      }
      continue;
    }
    if(c==="*"||c==="|") {
      if(c==="*")i++;
      if(selector[i]==="|"&&selector[i+1]!=="|"){i++;if(selector[i]==="*")i++;else{const type=identifier.exec(selector.slice(i));if(!type)return null;sum.types++;i+=type[0].length;}}
      continue;
    }
    const type=identifier.exec(selector.slice(i));if(!type)return null;i+=type[0].length;
    if(selector[i]==="|"&&selector[i+1]!=="|"){i++;if(selector[i]==="*")i++;else{const local=identifier.exec(selector.slice(i));if(!local)return null;sum.types++;i+=local[0].length;}}
    else sum.types++;
  }
  return sum;
};

export const calculateSelectorSpecificity = (input: unknown): ToolResult<SelectorSpecificityOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = selectorSpecificityInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, selectorSpecificityInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["selectors"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SelectorSpecificityInput = {
    selectors: values.selectors as string
  };
  const parts=splitCssTopLevel(x.selectors,",");if(!parts||parts.some(part=>!part))return fail("selectors","Provide balanced, nonempty selectors.","malformed_selector");
  const selectors:{selector:string;specificity:Specificity}[]=[];
  for(const selector of parts){const specificity=selectorSpecificity(selector);if(!specificity)return fail("selectors","Unsupported or unbalanced selector syntax.","malformed_selector");selectors.push({selector,specificity});}
  const output: SelectorSpecificityOutput = {selectors};
  if (!matchesToolJsonSchema(output, selectorSpecificityOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const selectorSpecificityTool = defineTool<SelectorSpecificityInput, SelectorSpecificityOutput>({
  id: "css/selector-specificity", title: "CSS Selector Specificity", description: "Calculate Level 4 specificity triples for selector lists, including is, not, has, where, and nth-child of; unresolved nesting selectors are rejected.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSelectorSpecificity,
  inputSchema: selectorSpecificityInputSchema, outputSchema: selectorSpecificityOutputSchema,
  ports: {inputs: [{"id":"selectors","label":"Comma-separated selector list without CSS nesting ampersands","description":"Comma-separated selector list without CSS nesting ampersands.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"selectors","label":"Selector-specific ID, class, and type counts","description":"Selector-specific ID, class, and type counts.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runSelectorSpecificity = selectorSpecificityTool.execute;
export const example = {"input":{"selectors":"#app .card > a:hover, :where(#zero) :is(p, #chosen)"},"output":{"selectors":[{"selector":"#app .card > a:hover","specificity":{"ids":1,"classes":2,"types":1}},{"selector":":where(#zero) :is(p, #chosen)","specificity":{"ids":1,"classes":0,"types":0}}]}} satisfies ToolExample<SelectorSpecificityInput, SelectorSpecificityOutput>;
export default selectorSpecificityTool;
