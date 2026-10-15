import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  topographicHeightMeters: number;
  crustDensityKgPerM3: number;
  mantleDensityKgPerM3: number;
  referenceCrustThicknessMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "topographicHeightMeters",
    label: "Topographic height meters",
    kind: "number",
    unit: "m",
  },
  {
    id: "crustDensityKgPerM3",
    label: "Crust density kg per m3",
    kind: "number",
  },
  {
    id: "mantleDensityKgPerM3",
    label: "Mantle density kg per m3",
    kind: "number",
  },
  {
    id: "referenceCrustThicknessMeters",
    label: "Reference crust thickness meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.topographicHeightMeters >= 0 &&
      i.topographicHeightMeters <= 1e4 &&
      i.crustDensityKgPerM3 > 0 &&
      i.mantleDensityKgPerM3 > i.crustDensityKgPerM3 &&
      i.mantleDensityKgPerM3 <= 10000 &&
      i.referenceCrustThicknessMeters > 0 &&
      i.referenceCrustThicknessMeters <= 1e5,
  );
  const root =
    (i.crustDensityKgPerM3 * i.topographicHeightMeters) /
    (i.mantleDensityKgPerM3 - i.crustDensityKgPerM3);
  return H.finish({
    rootThicknessMeters: root,
    compensationDepthBelowReferenceMeters:
      i.referenceCrustThicknessMeters + root,
  });
};
export const example = {
  input: {
    topographicHeightMeters: 1000,
    crustDensityKgPerM3: 2700,
    mantleDensityKgPerM3: 3300,
    referenceCrustThicknessMeters: 30000,
  },
  output: {
    result: {
      rootThicknessMeters: 4500,
      compensationDepthBelowReferenceMeters: 34500,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Isostatic Compensation Depth Airy Heiskanen Estimate Calculator",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/isostatic-compensation-depth-airy",
  title: "Isostatic Compensation Depth Airy Heiskanen Estimate Calculator",
  description:
    "Estimate an Airy-Heiskanen local root from crust/mantle density contrast and positive relief, returning depth below the reference datum; ignores flexure, lateral density changes and real crustal structure.",
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
          rootThicknessMeters: { type: "number" },
          compensationDepthBelowReferenceMeters: { type: "number" },
        },
        required: [
          "rootThicknessMeters",
          "compensationDepthBelowReferenceMeters",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
