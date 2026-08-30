import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {parseHtmlStartTag, type ParsedHtmlTag} from "../attribute-parser/tool.js";
// Method reference: https://html.spec.whatwg.org/multipage/parsing.html#tokenization
export type TagCounterInput = {
  readonly html: string;
};
export type TagCounterOutput = {
  readonly count: number;
};
export const tagCounterInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source to scan."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const tagCounterOutputSchema = {"type":"object","additionalProperties":false,"properties":{"count":{"type":"integer","minimum":0,"description":"Number of start tags."}},"required":["count"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export type HtmlToken = {readonly kind:"text"|"start"|"end"|"comment"|"declaration";readonly raw:string;readonly name:string;readonly tag:ParsedHtmlTag|null};
export const scanHtmlTokens = (html: string): readonly HtmlToken[] => {
  const tokens: HtmlToken[] = []; let i = 0, rawTag = "";
  const text = (raw:string) => {if (raw) tokens.push({kind:"text",raw,name:"",tag:null});};
  while (i < html.length) {
    if (rawTag) {
      const pattern = new RegExp(`</${rawTag}(?=[\\t\\n\\f\\r />])`,"ig"); pattern.lastIndex=i;
      const close = pattern.exec(html);
      if (!close) {text(html.slice(i));break;}
      text(html.slice(i,close.index));i=close.index;rawTag="";
    }
    const lt = html.indexOf("<",i);
    if (lt < 0) {text(html.slice(i));break;} text(html.slice(i,lt)); i=lt;
    if (html.startsWith("<!--",i)) {
      const end = html.indexOf("-->",i+4), finish = end < 0 ? html.length : end+3;
      tokens.push({kind:"comment",raw:html.slice(i,finish),name:"",tag:null});i=finish;continue;
    }
    if (/^<![^-]|^<\?/.test(html.slice(i,i+3))) {
      const end = html.indexOf(">",i+2); if(end<0) {text(html.slice(i));break;}
      tokens.push({kind:"declaration",raw:html.slice(i,end+1),name:"",tag:null}); i=end+1;continue;
    }
    let end=i+1, quote="";
    for(;end<html.length;end++) {
      const c=html[end]; if(quote) {if(c===quote)quote="";} else if(c==='"'||c==="'")quote=c;else if(c===">")break;
    }
    if(end===html.length) {text(html.slice(i));break;}
    const raw=html.slice(i,end+1), closing=/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>$/.exec(raw), tag=parseHtmlStartTag(raw);
    if(closing) {tokens.push({kind:"end",raw,name:closing[1].toLowerCase(),tag:null});i=end+1;}
    else if(tag) {tokens.push({kind:"start",raw,name:tag.name,tag});i=end+1;if(["script","style","textarea","title","xmp","iframe","noembed","noframes"].includes(tag.name))rawTag=tag.name;}
    else {text("<");i++;}
  }
  return tokens;
};

export const calculateTagCounter = (input: unknown): ToolResult<TagCounterOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = tagCounterInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, tagCounterInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: TagCounterInput = {
    html: values.html as string
  };
  const output: TagCounterOutput = {count:scanHtmlTokens(x.html).filter(token => token.kind === "start").length};
  if (!matchesToolJsonSchema(output, tagCounterOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const tagCounterTool = defineTool<TagCounterInput, TagCounterOutput>({
  id: "html/tag-counter", title: "HTML Tag Counter", description: "Count lexical HTML start tags while ignoring comments, declarations, closing tags, and apparent tags inside raw-text elements.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateTagCounter,
  inputSchema: tagCounterInputSchema, outputSchema: tagCounterOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source to scan","description":"HTML source to scan.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"count","label":"Number of start tags","description":"Number of start tags.","valueType":{"type":"integer"}}]},
});
export const runTagCounter = tagCounterTool.execute;
export const example = {"input":{"html":"<p>Hello <b>world</b></p><!-- <i>ignored</i> --><script>\"<div>\"</script>"},"output":{"count":3}} satisfies ToolExample<TagCounterInput, TagCounterOutput>;
export default tagCounterTool;
