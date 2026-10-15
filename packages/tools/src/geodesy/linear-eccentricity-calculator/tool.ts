import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ semiMajorMeters: number; eccentricity: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  { id: "eccentricity", label: "Eccentricity", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.semiMajorMeters >= 1 &&
      i.semiMajorMeters <= 1e8 &&
      i.eccentricity >= 0 &&
      i.eccentricity < 1,
  );
  return H.finish({
    linearEccentricityMeters: i.semiMajorMeters * i.eccentricity,
  });
};
export const example = {
  input: { semiMajorMeters: 10, eccentricity: 0.1 },
  output: { result: { linearEccentricityMeters: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Linear Eccentricity c from a and e Calculator", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/linear-eccentricity-calculator",
  title: "Linear Eccentricity c from a and e Calculator",
  description:
    "Compute ellipsoid focal linear eccentricity c=a*e in meters from a dimensionless first eccentricity, requiring 0<=e<1.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { linearEccentricityMeters: { type: "number" } },
        required: ["linearEccentricityMeters"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
