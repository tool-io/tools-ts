import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ projection: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "projection", label: "Projection", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.projection === "UTM");
  return H.finish({ centralMeridianScale: 0.9996, projection: "UTM" });
};
export const example = {
  input: { projection: "UTM" },
  output: { result: { centralMeridianScale: 0.9996, projection: "UTM" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/utm-scale-factor-central-meridian-lookup",
  title: "UTM Scale Factor at Central Meridian 0.9996 Lookup",
  description:
    "Return the defining UTM central-meridian scale k0=0.9996 for either hemisphere; no zone selection, point scale, convergence or coordinate projection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
