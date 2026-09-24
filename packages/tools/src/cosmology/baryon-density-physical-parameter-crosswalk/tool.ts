import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly omegaBaryon: number; readonly h: number };
export type Output = { readonly omegaBaryonH2: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    omegaBaryon: { type: "number", minimum: 0 },
    h: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["omegaBaryon", "h"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { omegaBaryonH2: { type: "number" } },
  required: ["omegaBaryonH2"],
} as const;
/** Calculate baryon density physical parameter crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { omegaBaryon, h } = request;
  const compute = (): Output => {
    H.domain(omegaBaryon >= 0);
    H.positive(h);
    return { omegaBaryonH2: omegaBaryon * h * h };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { omegaBaryon: 0.05, h: 0.7 },
  output: { omegaBaryonH2: 0.024499999999999997 },
} satisfies ToolExample<Input, Output>;
export const baryonDensityPhysicalParameterCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/baryon-density-physical-parameter-crosswalk",
      title: "Baryon Density Physical Parameter Crosswalk Tool",
      description:
        "Calculate baryon density physical parameter crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          omegaBaryon: { type: "number", minimum: 0 },
          h: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["omegaBaryon", "h"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { omegaBaryonH2: { type: "number" } },
        required: ["omegaBaryonH2"],
      },
      ports: {
        inputs: [
          {
            id: "omegaBaryon",
            label: "Omega Baryon",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "h",
            label: "H",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "omegaBaryonH2",
            label: "Omega Baryon H2",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = baryonDensityPhysicalParameterCrosswalkTool.execute;
export default baryonDensityPhysicalParameterCrosswalkTool;
