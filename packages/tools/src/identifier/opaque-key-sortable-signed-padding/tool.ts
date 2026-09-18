import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  value: string;
  minimum: string;
  maximum: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "value", kind: "string" },
  { id: "minimum", label: "minimum", kind: "string" },
  { id: "maximum", label: "maximum", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.bigint(i.value),
    min = H.bigint(i.minimum),
    max = H.bigint(i.maximum);
  H.check(max >= min && v >= min && v <= max);
  return H.finish({
    key: String(v - min).padStart(String(max - min).length, "0"),
  });
};
export const example = {
  input: { value: "-2", minimum: "-10", maximum: "10" },
  output: { result: { key: "08" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "identifier/opaque-key-sortable-signed-padding",
  title: "Opaque Key Sortable Signed Padding",
  description:
    "Encode a signed exact integer into lexicographic order by biasing against explicit inclusive range endpoints and fixed decimal width; caller retains endpoints for decoding.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
