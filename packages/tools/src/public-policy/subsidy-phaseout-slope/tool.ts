import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startingSubsidy: number;
  readonly endingSubsidy: number;
  readonly startingIncome: number;
  readonly endingIncome: number;
};
export type Output = { readonly subsidyChangePerIncome: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startingSubsidy: { type: "number", minimum: 0 },
    endingSubsidy: { type: "number", minimum: 0 },
    startingIncome: { type: "number" },
    endingIncome: { type: "number" },
  },
  required: [
    "startingSubsidy",
    "endingSubsidy",
    "startingIncome",
    "endingIncome",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { subsidyChangePerIncome: { type: "number" } },
  required: ["subsidyChangePerIncome"],
} as const;
/** Describe the signed linear subsidy change per income unit between two supplied policy schedule points. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startingSubsidy, endingSubsidy, startingIncome, endingIncome } =
    request;
  const compute = (): Output => {
    H.domain(
      startingSubsidy >= 0 &&
        endingSubsidy >= 0 &&
        endingIncome > startingIncome,
      "startingSubsidy",
    );
    return {
      subsidyChangePerIncome:
        (endingSubsidy - startingSubsidy) / (endingIncome - startingIncome),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startingSubsidy: 1000,
    endingSubsidy: 0,
    startingIncome: 20000,
    endingIncome: 30000,
  },
  output: { subsidyChangePerIncome: -0.1 },
} satisfies ToolExample<Input, Output>;
export const subsidyPhaseoutSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/subsidy-phaseout-slope",
    title: "Subsidy Phaseout Slope Tool",
    description:
      "Describe the signed linear subsidy change per income unit between two supplied policy schedule points.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startingSubsidy: { type: "number", minimum: 0 },
        endingSubsidy: { type: "number", minimum: 0 },
        startingIncome: { type: "number" },
        endingIncome: { type: "number" },
      },
      required: [
        "startingSubsidy",
        "endingSubsidy",
        "startingIncome",
        "endingIncome",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { subsidyChangePerIncome: { type: "number" } },
      required: ["subsidyChangePerIncome"],
    },
    ports: {
      inputs: [
        {
          id: "startingSubsidy",
          label: "Starting Subsidy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endingSubsidy",
          label: "Ending Subsidy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startingIncome",
          label: "Starting Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endingIncome",
          label: "Ending Income",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "subsidyChangePerIncome",
          label: "Subsidy Change Per Income",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsidyPhaseoutSlopeTool.execute;
export default subsidyPhaseoutSlopeTool;
