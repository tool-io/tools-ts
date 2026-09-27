import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialWetMass: number;
  readonly finalWetMass: number;
  readonly initialDryFraction: number;
  readonly finalDryFraction: number;
};
export type Output = {
  readonly initialDryMass: number;
  readonly finalDryMass: number;
  readonly dryMassLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialWetMass: { type: "number", minimum: 0 },
    finalWetMass: { type: "number", minimum: 0 },
    initialDryFraction: { type: "number", minimum: 0, maximum: 1 },
    finalDryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "initialWetMass",
    "finalWetMass",
    "initialDryFraction",
    "finalDryFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialDryMass: { type: "number" },
    finalDryMass: { type: "number" },
    dryMassLoss: { type: "number" },
  },
  required: ["initialDryMass", "finalDryMass", "dryMassLoss"],
} as const;
/** Calculate storage loss moisture term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialWetMass, finalWetMass, initialDryFraction, finalDryFraction } =
    request;
  const compute = (): Output => {
    H.domain(initialWetMass >= 0 && finalWetMass >= 0);
    H.probability(initialDryFraction);
    H.probability(finalDryFraction);
    return {
      initialDryMass: initialWetMass * initialDryFraction,
      finalDryMass: finalWetMass * finalDryFraction,
      dryMassLoss:
        initialWetMass * initialDryFraction - finalWetMass * finalDryFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialWetMass: 100,
    finalWetMass: 80,
    initialDryFraction: 0.8,
    finalDryFraction: 0.9,
  },
  output: { initialDryMass: 80, finalDryMass: 72, dryMassLoss: 8 },
} satisfies ToolExample<Input, Output>;
export const storageLossMoistureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/storage-loss-moisture-term",
    title: "Storage Loss Moisture Term Tool",
    description:
      "Calculate storage loss moisture term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialWetMass: { type: "number", minimum: 0 },
        finalWetMass: { type: "number", minimum: 0 },
        initialDryFraction: { type: "number", minimum: 0, maximum: 1 },
        finalDryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "initialWetMass",
        "finalWetMass",
        "initialDryFraction",
        "finalDryFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialDryMass: { type: "number" },
        finalDryMass: { type: "number" },
        dryMassLoss: { type: "number" },
      },
      required: ["initialDryMass", "finalDryMass", "dryMassLoss"],
    },
    ports: {
      inputs: [
        {
          id: "initialWetMass",
          label: "Initial Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalWetMass",
          label: "Final Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialDryFraction",
          label: "Initial Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalDryFraction",
          label: "Final Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "initialDryMass",
          label: "Initial Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "finalDryMass",
          label: "Final Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "dryMassLoss",
          label: "Dry Mass Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = storageLossMoistureTermTool.execute;
export default storageLossMoistureTermTool;
