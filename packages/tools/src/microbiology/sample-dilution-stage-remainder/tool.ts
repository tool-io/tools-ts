import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialAmount: number;
  readonly stageFractions: readonly number[];
  readonly finalWithdrawn: number;
};
export type Output = {
  readonly retainedAmount: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialAmount: { type: "number", minimum: 0 },
    stageFractions: { type: "array", maxItems: 256, items: { type: "number" } },
    finalWithdrawn: { type: "number", minimum: 0 },
  },
  required: ["initialAmount", "stageFractions", "finalWithdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedAmount: { type: "number" },
    remainder: { type: "number" },
  },
  required: ["retainedAmount", "remainder"],
} as const;
/** Arithmetic for already supplied fraction stages and withdrawal, without laboratory procedure or organism parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialAmount, stageFractions, finalWithdrawn } = request;
  const compute = (): Output => {
    H.domain(
      initialAmount >= 0 &&
        stageFractions.every((x) => x >= 0 && x <= 1) &&
        finalWithdrawn >= 0 &&
        finalWithdrawn <=
          initialAmount * stageFractions.reduce((a, b) => a * b, 1),
    );
    return {
      retainedAmount: initialAmount * stageFractions.reduce((a, b) => a * b, 1),
      remainder:
        initialAmount * stageFractions.reduce((a, b) => a * b, 1) -
        finalWithdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialAmount: 100, stageFractions: [0.5, 0.2], finalWithdrawn: 3 },
  output: { retainedAmount: 10, remainder: 7 },
} satisfies ToolExample<Input, Output>;
export const sampleDilutionStageRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/sample-dilution-stage-remainder",
    title: "Sample Dilution Stage Remainder Tool",
    description:
      "Arithmetic for already supplied fraction stages and withdrawal, without laboratory procedure or organism parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialAmount: { type: "number", minimum: 0 },
        stageFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        finalWithdrawn: { type: "number", minimum: 0 },
      },
      required: ["initialAmount", "stageFractions", "finalWithdrawn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedAmount: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["retainedAmount", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "initialAmount",
          label: "Initial Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stageFractions",
          label: "Stage Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "finalWithdrawn",
          label: "Final Withdrawn",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedAmount",
          label: "Retained Amount",
          valueType: { type: "number" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleDilutionStageRemainderTool.execute;
export default sampleDilutionStageRemainderTool;
