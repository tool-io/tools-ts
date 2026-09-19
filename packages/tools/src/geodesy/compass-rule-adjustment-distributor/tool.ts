import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  lengthsMeters: readonly number[];
  azimuthsDegrees: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "lengthsMeters",
    label: "Lengths meters",
    kind: "numberList",
    unit: "m",
  },
  {
    id: "azimuthsDegrees",
    label: "Azimuths degrees",
    kind: "numberList",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish(H.adjustTraverse(i.lengthsMeters, i.azimuthsDegrees, false));
};
export const example = {
  input: { lengthsMeters: [1, 1], azimuthsDegrees: [0, 0] },
  output: {
    result: {
      originalClosureNorthMeters: 2,
      originalClosureEastMeters: 0,
      correctionsNorthMeters: [-1, -1],
      correctionsEastMeters: [0, 0],
      northMeters: [0, 0],
      eastMeters: [0, 0],
      coordinatesEastNorthMeters: [
        [0, 0],
        [0, 0],
        [0, 0],
      ],
      residualMeters: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/compass-rule-adjustment-distributor",
  title: "Compass Rule Adjustment Distributor for Traverse",
  description:
    "Apply the local Bowditch/compass rule, distributing closure proportional to leg lengths; returns component corrections and adjusted coordinates, not least-squares network accuracy.",
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
