import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  semiMinorMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "semiMinorMeters",
    label: "Semi minor meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.axes(i.semiMajorMeters, i.semiMinorMeters);
  return H.finish({ secondEccentricitySquared: p.e2 / (1 - p.e2) });
};
export const example = {
  input: { semiMajorMeters: 10, semiMinorMeters: 9 },
  output: { result: { secondEccentricitySquared: 0.2345679012345679 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Second Eccentricity Squared Calculator", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/second-eccentricity-squared",
  title: "Second Eccentricity Squared Calculator",
  description:
    "Compute second geometric eccentricity squared (a^2-b^2)/b^2 for an oblate/spherical ellipsoid; do not confuse e-prime squared with e squared.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { secondEccentricitySquared: { type: "number" } },
        required: ["secondEccentricitySquared"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
