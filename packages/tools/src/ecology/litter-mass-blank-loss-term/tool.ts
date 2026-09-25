import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly remainingMass: number;
  readonly blankInitial: number;
  readonly blankRemaining: number;
};
export type Output = {
  readonly rawLoss: number;
  readonly correctedLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", minimum: 0 },
    remainingMass: { type: "number", minimum: 0 },
    blankInitial: { type: "number", minimum: 0 },
    blankRemaining: { type: "number", minimum: 0 },
  },
  required: ["initialMass", "remainingMass", "blankInitial", "blankRemaining"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawLoss: { type: "number" },
    correctedLoss: { type: "number" },
  },
  required: ["rawLoss", "correctedLoss"],
} as const;
/** Subtract the supplied blank mass loss while retaining signed results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, remainingMass, blankInitial, blankRemaining } = request;
  const compute = (): Output => {
    H.domain(
      initialMass >= 0 &&
        remainingMass >= 0 &&
        blankInitial >= 0 &&
        blankRemaining >= 0,
    );
    return {
      rawLoss: initialMass - remainingMass,
      correctedLoss:
        initialMass - remainingMass - (blankInitial - blankRemaining),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialMass: 10,
    remainingMass: 6,
    blankInitial: 2,
    blankRemaining: 1,
  },
  output: { rawLoss: 4, correctedLoss: 3 },
} satisfies ToolExample<Input, Output>;
export const litterMassBlankLossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/litter-mass-blank-loss-term",
    title: "Litter Mass Blank Loss Term Tool",
    description:
      "Subtract the supplied blank mass loss while retaining signed results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number", minimum: 0 },
        remainingMass: { type: "number", minimum: 0 },
        blankInitial: { type: "number", minimum: 0 },
        blankRemaining: { type: "number", minimum: 0 },
      },
      required: [
        "initialMass",
        "remainingMass",
        "blankInitial",
        "blankRemaining",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawLoss: { type: "number" },
        correctedLoss: { type: "number" },
      },
      required: ["rawLoss", "correctedLoss"],
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
          id: "remainingMass",
          label: "Remaining Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankInitial",
          label: "Blank Initial",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankRemaining",
          label: "Blank Remaining",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rawLoss", label: "Raw Loss", valueType: { type: "number" } },
        {
          id: "correctedLoss",
          label: "Corrected Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = litterMassBlankLossTermTool.execute;
export default litterMassBlankLossTermTool;
