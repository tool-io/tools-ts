import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, languageTagShape } from "../batch52-shared.js";
export type Input = Readonly<{ readonly languageTag: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "languageTag", label: "Language tag", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return languageTagShape(i.languageTag);
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { languageTag: "en-US" },
  output: {
    result: { wellFormedSyntax: true, registeredSubtagsVerified: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/lang-attribute-bcp47-checker",
  title: "lang Attribute BCP-47 Checker",
  description:
    "Bounded BCP47 syntax including extlangs, scripts/regions, variants, extensions/private use and grandfathered tags; no IANA registration or content-language detection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
