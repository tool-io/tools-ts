import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ centralAngleRadians: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "centralAngleRadians",
    label: "Central angle radians",
    kind: "number",
    unit: "rad",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.centralAngleRadians, 0, Math.PI);
  return H.finish({
    arcToChordRatio:
      i.centralAngleRadians === 0
        ? 1
        : i.centralAngleRadians / (2 * Math.sin(i.centralAngleRadians / 2)),
  });
};
export const example = {
  input: { centralAngleRadians: 3.141592653589793 },
  output: { result: { arcToChordRatio: 1.5707963267948966 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/spherical-arc-chord-ratio",
  title: "Distance: Spherical Arc Chord Ratio Tool",
  description:
    "Compute spherical minor-arc to chord length ratio with the continuous zero-angle limit; independent of radius and restricted to [0,pi].",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { arcToChordRatio: { type: "number" } },
        required: ["arcToChordRatio"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
