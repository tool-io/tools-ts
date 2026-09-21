import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binMass: number;
  readonly totalMass: number;
  readonly excludedMass: number;
};
export type Output = { readonly eligibleMass: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binMass: { type: "number", minimum: 0 },
    totalMass: { type: "number" },
    excludedMass: { type: "number", minimum: 0 },
  },
  required: ["binMass", "totalMass", "excludedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eligibleMass: { type: "number" }, share: { type: "number" } },
  required: ["eligibleMass", "share"],
} as const;
/** Calculate aggregate size bin share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { binMass, totalMass, excludedMass } = request;
  const compute = (): Output => {
    H.domain(
      totalMass > excludedMass &&
        excludedMass >= 0 &&
        binMass >= 0 &&
        binMass <= totalMass - excludedMass,
    );
    return {
      eligibleMass: totalMass - excludedMass,
      share: binMass / (totalMass - excludedMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { binMass: 20, totalMass: 100, excludedMass: 20 },
  output: { eligibleMass: 80, share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const aggregateSizeBinShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/aggregate-size-bin-share",
    title: "Aggregate Size Bin Share Tool",
    description:
      "Calculate aggregate size bin share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binMass: { type: "number", minimum: 0 },
        totalMass: { type: "number" },
        excludedMass: { type: "number", minimum: 0 },
      },
      required: ["binMass", "totalMass", "excludedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleMass: { type: "number" },
        share: { type: "number" },
      },
      required: ["eligibleMass", "share"],
    },
    ports: {
      inputs: [
        {
          id: "binMass",
          label: "Bin Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedMass",
          label: "Excluded Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleMass",
          label: "Eligible Mass",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = aggregateSizeBinShareTool.execute;
export default aggregateSizeBinShareTool;
