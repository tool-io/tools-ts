import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashAvailable: number;
  readonly periodicBurn: number;
  readonly committedCash: number;
};
export type Output = {
  readonly uncommittedCash: number;
  readonly committedShare: number;
  readonly uncommittedRunway: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashAvailable: { type: "number", exclusiveMinimum: 0 },
    periodicBurn: { type: "number", exclusiveMinimum: 0 },
    committedCash: { type: "number", minimum: 0 },
  },
  required: ["cashAvailable", "periodicBurn", "committedCash"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncommittedCash: { type: "number" },
    committedShare: { type: "number" },
    uncommittedRunway: { type: "number" },
  },
  required: ["uncommittedCash", "committedShare", "uncommittedRunway"],
} as const;
/** Calculate startup burn commitment share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashAvailable, periodicBurn, committedCash } = request;
  const compute = (): Output => {
    H.positive(cashAvailable);
    H.positive(periodicBurn);
    H.domain(committedCash >= 0);
    return {
      uncommittedCash: cashAvailable - committedCash,
      committedShare: committedCash / cashAvailable,
      uncommittedRunway: (cashAvailable - committedCash) / periodicBurn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cashAvailable: 100, periodicBurn: 10, committedCash: 30 },
  output: { uncommittedCash: 70, committedShare: 0.3, uncommittedRunway: 7 },
} satisfies ToolExample<Input, Output>;
export const startupBurnCommitmentShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-burn-commitment-share",
    title: "Startup Burn Commitment Share Tool",
    description:
      "Calculate startup burn commitment share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashAvailable: { type: "number", exclusiveMinimum: 0 },
        periodicBurn: { type: "number", exclusiveMinimum: 0 },
        committedCash: { type: "number", minimum: 0 },
      },
      required: ["cashAvailable", "periodicBurn", "committedCash"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncommittedCash: { type: "number" },
        committedShare: { type: "number" },
        uncommittedRunway: { type: "number" },
      },
      required: ["uncommittedCash", "committedShare", "uncommittedRunway"],
    },
    ports: {
      inputs: [
        {
          id: "cashAvailable",
          label: "Cash Available",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodicBurn",
          label: "Periodic Burn",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committedCash",
          label: "Committed Cash",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncommittedCash",
          label: "Uncommitted Cash",
          valueType: { type: "number" },
        },
        {
          id: "committedShare",
          label: "Committed Share",
          valueType: { type: "number" },
        },
        {
          id: "uncommittedRunway",
          label: "Uncommitted Runway",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = startupBurnCommitmentShareTool.execute;
export default startupBurnCommitmentShareTool;
