import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.sitemaps.org/protocol.html
export type SitemapCounterInput = {
  readonly xml: string;
};
export type SitemapCounterOutput = {
  readonly urls: number;
  readonly sitemaps: number;
  readonly kind: "urlset" | "sitemapindex";
};
export const sitemapCounterInputSchema = {"type":"object","additionalProperties":false,"properties":{"xml":{"type":"string","maxLength":1000000,"description":"Sitemap XML source."}},"required":["xml"]} as const satisfies ToolJsonSchema;
export const sitemapCounterOutputSchema = {"type":"object","additionalProperties":false,"properties":{"urls":{"type":"integer","minimum":0,"description":"Direct URL entries."},"sitemaps":{"type":"integer","minimum":0,"description":"Direct sitemap entries."},"kind":{"type":"string","enum":["urlset","sitemapindex"],"description":"Sitemap document kind."}},"required":["urls","sitemaps","kind"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

const XML_NS="http://www.sitemaps.org/schemas/sitemap/0.9";
export const countSitemapEntries=(xml:string): {readonly urls:number;readonly sitemaps:number;readonly kind:"urlset"|"sitemapindex"}|null=>{
  let i=0,root="",rootPrefix="",kind:"urlset"|"sitemapindex"="urlset",urls=0,sitemaps=0,finished=false;
  const stack:string[]=[];
  while(i<xml.length){const lt=xml.indexOf("<",i);const text=xml.slice(i,lt<0?xml.length:lt);if(stack.length===0&&text.trim()!=="")return null;if(lt<0)break;i=lt;
    if(xml.startsWith("<!--",i)){const end=xml.indexOf("-->",i+4);if(end<0)return null;i=end+3;continue;}
    if(xml.startsWith("<?",i)){const end=xml.indexOf("?>",i+2);if(end<0)return null;i=end+2;continue;}
    if(xml.startsWith("<![CDATA[",i)){if(stack.length===0)return null;const end=xml.indexOf("]]>",i+9);if(end<0)return null;i=end+3;continue;}
    if(xml.startsWith("<!",i))return null;
    let quote="",end=i+1;for(;end<xml.length;end++){const c=xml[end];if(quote){if(c===quote)quote="";}else if(c==='"'||c==="'")quote=c;else if(c===">")break;}if(end===xml.length)return null;
    const raw=xml.slice(i,end+1);i=end+1;
    const close=/^<\/([A-Za-z_][A-Za-z0-9_.:-]*)\s*>$/.exec(raw);
    if(close){if(stack.pop()!==close[1])return null;if(stack.length===0)finished=true;continue;}
    const name=/^<([A-Za-z_][A-Za-z0-9_.:-]*)/.exec(raw);if(!name)return null;
    const attrs=raw.slice(name[0].length).replace(/\/?\s*>$/,"");
    let rest=attrs;const parsed:{name:string;value:string}[]=[],seen=new Set<string>();
    while(rest.trim()!==""){const attr=/^\s+([A-Za-z_][A-Za-z0-9_.:-]*)\s*=\s*(?:"([^"<]*)"|'([^'<]*)')/.exec(rest);if(!attr||seen.has(attr[1]))return null;seen.add(attr[1]);parsed.push({name:attr[1],value:attr[2]??attr[3]});rest=rest.slice(attr[0].length);}
    if(stack.length===0){if(root||finished)return null;root=name[1];const parts=root.split(":");rootPrefix=parts.length===2?parts[0]+":":"";const local=parts[parts.length-1];if(local!=="urlset"&&local!=="sitemapindex")return null;kind=local;
      const ns=parsed.find(attr=>attr.name===(rootPrefix?"xmlns:"+rootPrefix.slice(0,-1):"xmlns"));if(!ns||ns.value!==XML_NS)return null;
    }else{
      // Reject rebinding rather than silently interpreting an entry in a wrong namespace.
      if(parsed.some(attr=>attr.name==="xmlns"||attr.name.startsWith("xmlns:")))return null;
      if(stack.length===1&&name[1]===rootPrefix+(kind==="urlset"?"url":"sitemap")){if(kind==="urlset")urls++;else sitemaps++;}
    }
    if(/\/\s*>$/.test(raw)){if(stack.length===0)finished=true;}else stack.push(name[1]);
  }
  return root!==""&&stack.length===0&&finished?{urls,sitemaps,kind}:null;
};

export const calculateSitemapCounter = (input: unknown): ToolResult<SitemapCounterOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = sitemapCounterInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, sitemapCounterInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["xml"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SitemapCounterInput = {
    xml: values.xml as string
  };
  const output=countSitemapEntries(x.xml);
  if(!output)return fail("xml","Provide a balanced sitemap XML document using the standard namespace; DTDs and nested namespace rebinding are unsupported.","malformed_sitemap");
  if (!matchesToolJsonSchema(output, sitemapCounterOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const sitemapCounterTool = defineTool<SitemapCounterInput, SitemapCounterOutput>({
  id: "web/sitemap-counter", title: "Sitemap Entry Counter", description: "Count direct entries in a balanced XML sitemap or sitemap index with the standard namespace, rejecting DTDs and nested namespace rebinding.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSitemapCounter,
  inputSchema: sitemapCounterInputSchema, outputSchema: sitemapCounterOutputSchema,
  ports: {inputs: [{"id":"xml","label":"Sitemap XML source","description":"Sitemap XML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"urls","label":"Direct URL entries","description":"Direct URL entries.","valueType":{"type":"integer"}},{"id":"sitemaps","label":"Direct sitemap entries","description":"Direct sitemap entries.","valueType":{"type":"integer"}},{"id":"kind","label":"Sitemap document kind","description":"Sitemap document kind.","valueType":{"type":"string"}}]},
});
export const runSitemapCounter = sitemapCounterTool.execute;
export const example = {"input":{"xml":"<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>https://example.com/</loc></url><url><loc>https://example.com/about</loc></url></urlset>"},"output":{"urls":2,"sitemaps":0,"kind":"urlset"}} satisfies ToolExample<SitemapCounterInput, SitemapCounterOutput>;
export default sitemapCounterTool;
