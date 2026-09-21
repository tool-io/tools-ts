import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dryMass: number; readonly coreVolume: number };
export type Output = { readonly density: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    coreVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryMass", "coreVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { density: { type: "number" } },
  required: ["density"],
} as const;
/** Calculate core density dry mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, coreVolume } = request;
  const compute = (): Output => {
    H.domain(dryMass >= 0);
    H.positive(coreVolume);
    return { density: dryMass / coreVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 120, coreVolume: 100 },
  output: { density: 1.2 },
} satisfies ToolExample<Input, Output>;
export const coreDensityDryMassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/core-density-dry-mass-term",
    title: "Core Density Dry Mass Term Tool",
    description:
      "Calculate core density dry mass term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", minimum: 0 },
        coreVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryMass", "coreVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { density: { type: "number" } },
      required: ["density"],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coreVolume",
          label: "Core Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coreDensityDryMassTermTool.execute;
export default coreDensityDryMassTermTool;
