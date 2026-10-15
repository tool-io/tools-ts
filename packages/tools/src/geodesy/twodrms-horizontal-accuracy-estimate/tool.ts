import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  eastSigmaMeters: number;
  northSigmaMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "eastSigmaMeters",
    label: "East sigma meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "northSigmaMeters",
    label: "North sigma meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.eastSigmaMeters >= 0 &&
      i.northSigmaMeters >= 0 &&
      Math.max(i.eastSigmaMeters, i.northSigmaMeters) <= 1e7,
  );
  return H.finish({
    twoDrmsMeters: 2 * Math.hypot(i.eastSigmaMeters, i.northSigmaMeters),
    isotropicGaussianCoverage:
      i.eastSigmaMeters === i.northSigmaMeters && i.eastSigmaMeters > 0
        ? 1 - Math.exp(-4)
        : null,
  });
};
export const example = {
  input: { eastSigmaMeters: 3, northSigmaMeters: 4 },
  output: { result: { twoDrmsMeters: 10, isotropicGaussianCoverage: null } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "2DRMS Horizontal Accuracy Calculator",
      "2DRMS Horizontal Accuracy Estimate Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/twodrms-horizontal-accuracy-estimate",
  title: "2DRMS Horizontal Accuracy Calculator",
  description:
    "Compute 2DRMS from supplied horizontal standard deviations, exposing its approximately 98.17% radial coverage only in the unbiased isotropic Gaussian case; not universally 95% accuracy.",
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
          twoDrmsMeters: { type: "number" },
          isotropicGaussianCoverage: {
            anyOf: [{ type: "number" }, { type: "null" }],
          },
        },
        required: ["twoDrmsMeters", "isotropicGaussianCoverage"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
