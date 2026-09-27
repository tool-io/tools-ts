import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distribution: number;
  readonly recallableFraction: number;
};
export type Output = {
  readonly recallable: number;
  readonly permanent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distribution: { type: "number", minimum: 0 },
    recallableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["distribution", "recallableFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recallable: { type: "number" }, permanent: { type: "number" } },
  required: ["recallable", "permanent"],
} as const;
/** Calculate fund distribution recallable share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distribution, recallableFraction } = request;
  const compute = (): Output => {
    H.domain(distribution >= 0);
    H.probability(recallableFraction);
    const recallable = distribution * recallableFraction;
    return { recallable, permanent: distribution - recallable };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distribution: 1000, recallableFraction: 0.25 },
  output: { recallable: 250, permanent: 750 },
} satisfies ToolExample<Input, Output>;
export const fundDistributionRecallableShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/fund-distribution-recallable-share",
    title: "Fund Distribution Recallable Share Tool",
    description:
      "Calculate fund distribution recallable share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distribution: { type: "number", minimum: 0 },
        recallableFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["distribution", "recallableFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recallable: { type: "number" },
        permanent: { type: "number" },
      },
      required: ["recallable", "permanent"],
    },
    ports: {
      inputs: [
        {
          id: "distribution",
          label: "Distribution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recallableFraction",
          label: "Recallable Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recallable",
          label: "Recallable",
          valueType: { type: "number" },
        },
        { id: "permanent", label: "Permanent", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fundDistributionRecallableShareTool.execute;
export default fundDistributionRecallableShareTool;
