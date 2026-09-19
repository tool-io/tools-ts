import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ model: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "model", label: "Model", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.model === "GRS80");
  return H.finish({
    equatorialGravityMgal: 978032.67715,
    equatorialGravityMetersPerSecondSquared: 9.7803267715,
    model: "GRS80 normal gravity, rounded",
  });
};
export const example = {
  input: { model: "GRS80" },
  output: {
    result: {
      equatorialGravityMgal: 978032.67715,
      equatorialGravityMetersPerSecondSquared: 9.7803267715,
      model: "GRS80 normal gravity, rounded",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/normal-gravity-equator-sealevel-lookup",
  title: "Normal Gravity at Sea Level Equator 978032 mGal Lookup",
  description:
    "Return rounded GRS80 equatorial sea-level normal gravity; the milestone title 978032 mGal is approximate, not an exact universal observed gravity.",
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
