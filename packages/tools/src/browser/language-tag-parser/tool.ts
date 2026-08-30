import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://tc39.es/ecma402/#sec-intl-locale
export type LanguageTagParserInput = {
  readonly tag: string;
};
export type LanguageTagParserOutput = {
  readonly canonical: string;
  readonly language: string;
  readonly script: string;
  readonly region: string;
  readonly baseName: string;
};
export const languageTagParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"tag":{"type":"string","maxLength":1000000,"description":"Unicode locale identifier accepted by Intl.Locale."}},"required":["tag"]} as const satisfies ToolJsonSchema;
export const languageTagParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"canonical":{"type":"string","maxLength":1000000,"description":"Canonical locale identifier."},"language":{"type":"string","maxLength":1000000,"description":"Language subtag."},"script":{"type":"string","maxLength":1000000,"description":"Script subtag, empty when absent."},"region":{"type":"string","maxLength":1000000,"description":"Region subtag, empty when absent."},"baseName":{"type":"string","maxLength":1000000,"description":"Locale identifier without extensions."}},"required":["canonical","language","script","region","baseName"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateLanguageTagParser = (input: unknown): ToolResult<LanguageTagParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = languageTagParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, languageTagParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["tag"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: LanguageTagParserInput = {
    tag: values.tag as string
  };
  let locale:Intl.Locale;
  try {locale = new Intl.Locale(x.tag);} catch (error) {if(error instanceof RangeError || error instanceof TypeError) return fail("tag", "Provide a structurally valid Unicode locale identifier.", "invalid_language_tag"); throw error;}
  const output: LanguageTagParserOutput = {canonical:locale.toString(),language:locale.language,script:locale.script ?? "",region:locale.region ?? "",baseName:locale.baseName};
  if (!matchesToolJsonSchema(output, languageTagParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const languageTagParserTool = defineTool<LanguageTagParserInput, LanguageTagParserOutput>({
  id: "browser/language-tag-parser", title: "Language Tag Parser", description: "Canonicalize an ECMA-402 Unicode locale identifier and extract its language, script, region, and base name.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateLanguageTagParser,
  inputSchema: languageTagParserInputSchema, outputSchema: languageTagParserOutputSchema,
  ports: {inputs: [{"id":"tag","label":"Unicode locale identifier accepted by Intl.Locale","description":"Unicode locale identifier accepted by Intl.Locale.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"canonical","label":"Canonical locale identifier","description":"Canonical locale identifier.","valueType":{"type":"string"}},{"id":"language","label":"Language subtag","description":"Language subtag.","valueType":{"type":"string"}},{"id":"script","label":"Script subtag, empty when absent","description":"Script subtag, empty when absent.","valueType":{"type":"string"}},{"id":"region","label":"Region subtag, empty when absent","description":"Region subtag, empty when absent.","valueType":{"type":"string"}},{"id":"baseName","label":"Locale identifier without extensions","description":"Locale identifier without extensions.","valueType":{"type":"string"}}]},
});
export const runLanguageTagParser = languageTagParserTool.execute;
export const example = {"input":{"tag":"zh-hant-tw-u-nu-hanidec"},"output":{"canonical":"zh-Hant-TW-u-nu-hanidec","language":"zh","script":"Hant","region":"TW","baseName":"zh-Hant-TW"}} satisfies ToolExample<LanguageTagParserInput, LanguageTagParserOutput>;
export default languageTagParserTool;
