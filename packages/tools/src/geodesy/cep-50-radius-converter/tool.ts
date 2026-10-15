import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ isotropicSigmaMeters: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "isotropicSigmaMeters",
    label: "Isotropic sigma meters",
    kind: "number",
    unit: "m",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.isotropicSigmaMeters >= 0 && i.isotropicSigmaMeters <= 1e7);
  return H.finish({
    cep50Meters: i.isotropicSigmaMeters * Math.sqrt(2 * Math.log(2)),
    degenerate: i.isotropicSigmaMeters === 0,
  });
};
export const example = {
  input: { isotropicSigmaMeters: 1 },
  output: { result: { cep50Meters: 1.1774100225154747, degenerate: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Circular Error Probable (CEP50) Calculator",
      "CEP Circular Error Probable 50 Percent Radius Converter",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/cep-50-radius-converter",
  title: "Circular Error Probable (CEP50) Calculator",
  description:
    "Compute radial 50th-percentile error for an unbiased independent isotropic two-axis Gaussian; not an anisotropic/bias-bearing CEP approximation or measured positioning guarantee.",
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
          cep50Meters: { type: "number" },
          degenerate: { type: "boolean" },
        },
        required: ["cep50Meters", "degenerate"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
