import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{ readonly folioReference: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "folioReference", label: "Folio reference", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  const m =
    /^f(?:ol)?\.?\s*([1-9]\d{0,5})\s*(r|v|recto|verso)$(?![\s\S])/i.exec(
      i.folioReference.trim(),
    );
  if (!m) simpleError("folio", "Explicit fol/ f integer and r/v/recto/verso.");
  return {
    normalizedReference:
      "f. " + m[1] + (m[2].toLowerCase().startsWith("r") ? "r" : "v"),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { folioReference: "fol. 12 verso" },
  output: { result: { normalizedReference: "f. 12v" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleography/folio-rv-notation-normalizer",
  title: "Folio Reference Recto-Verso Notation Normalizer (r/v)",
  description:
    "Normalize a single positive folio recto/verso notation; no foliation/pagination conversion or damaged-number inference.",
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
