import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly finalMass: number;
  readonly excludedInitialMass: number;
  readonly excludedFinalMass: number;
};
export type Output = {
  readonly eligibleInitial: number;
  readonly eligibleFinal: number;
  readonly lossFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number" },
    finalMass: { type: "number" },
    excludedInitialMass: { type: "number", minimum: 0 },
    excludedFinalMass: { type: "number", minimum: 0 },
  },
  required: [
    "initialMass",
    "finalMass",
    "excludedInitialMass",
    "excludedFinalMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleInitial: { type: "number" },
    eligibleFinal: { type: "number" },
    lossFraction: { type: "number" },
  },
  required: ["eligibleInitial", "eligibleFinal", "lossFraction"],
} as const;
/** Calculate tablet friability bench mass loss term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, finalMass, excludedInitialMass, excludedFinalMass } =
    request;
  const compute = (): Output => {
    H.domain(
      initialMass > excludedInitialMass &&
        excludedInitialMass >= 0 &&
        finalMass >= excludedFinalMass &&
        excludedFinalMass >= 0,
    );
    return {
      eligibleInitial: initialMass - excludedInitialMass,
      eligibleFinal: finalMass - excludedFinalMass,
      lossFraction:
        1 -
        (finalMass - excludedFinalMass) / (initialMass - excludedInitialMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialMass: 100,
    finalMass: 98,
    excludedInitialMass: 10,
    excludedFinalMass: 9,
  },
  output: {
    eligibleInitial: 90,
    eligibleFinal: 89,
    lossFraction: 0.011111111111111072,
  },
} satisfies ToolExample<Input, Output>;
export const tabletFriabilityBenchMassLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/tablet-friability-bench-mass-loss-term",
    title: "Tablet Friability Bench Mass Loss Term Tool",
    description:
      "Calculate tablet friability bench mass loss term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number" },
        finalMass: { type: "number" },
        excludedInitialMass: { type: "number", minimum: 0 },
        excludedFinalMass: { type: "number", minimum: 0 },
      },
      required: [
        "initialMass",
        "finalMass",
        "excludedInitialMass",
        "excludedFinalMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleInitial: { type: "number" },
        eligibleFinal: { type: "number" },
        lossFraction: { type: "number" },
      },
      required: ["eligibleInitial", "eligibleFinal", "lossFraction"],
    },
    ports: {
      inputs: [
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalMass",
          label: "Final Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedInitialMass",
          label: "Excluded Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedFinalMass",
          label: "Excluded Final Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleInitial",
          label: "Eligible Initial",
          valueType: { type: "number" },
        },
        {
          id: "eligibleFinal",
          label: "Eligible Final",
          valueType: { type: "number" },
        },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tabletFriabilityBenchMassLossTermTool.execute;
export default tabletFriabilityBenchMassLossTermTool;
