import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ ellipsoid: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ellipsoid", label: "Ellipsoid", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.ellipsoid === "GRS80");
  return H.finish({
    flattening: 1 / 298.257222101,
    inverseFlattening: 298.257222101,
    reference: "GRS80, rounded geometric inverse flattening",
  });
};
export const example = {
  input: { ellipsoid: "GRS80" },
  output: {
    result: {
      flattening: 0.003352810681182319,
      inverseFlattening: 298.257222101,
      reference: "GRS80, rounded geometric inverse flattening",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["GRS80 Flattening Parameter Lookup", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/grs80-flattening-lookup",
  title: "GRS80 Flattening Parameter Lookup",
  description:
    "Return the published rounded GRS80 geometric flattening, distinct from WGS84 and dynamical J2; not a datum realization transform.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          flattening: { type: "number" },
          inverseFlattening: { type: "number" },
          reference: { type: "string" },
        },
        required: ["flattening", "inverseFlattening", "reference"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
