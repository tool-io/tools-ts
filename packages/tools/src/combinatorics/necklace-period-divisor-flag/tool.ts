import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly proposedPeriod: number;
};
export type Output = {
  readonly divides: boolean;
  readonly repetitions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    proposedPeriod: { type: "integer", minimum: 1 },
  },
  required: ["length", "proposedPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    divides: { type: "boolean" },
    repetitions: { type: "integer" },
  },
  required: ["divides", "repetitions"],
} as const;
/** Necessary divisor condition for a cyclic word period; repetitions is the integer quotient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, proposedPeriod } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(proposedPeriod, 1, length);
    return {
      divides: length % proposedPeriod === 0,
      repetitions: Math.floor(length / proposedPeriod),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 12, proposedPeriod: 3 },
  output: { divides: true, repetitions: 4 },
} satisfies ToolExample<Input, Output>;
export const necklacePeriodDivisorFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/necklace-period-divisor-flag",
    title: "Necklace Period Divisor Flag Tool",
    description:
      "Necessary divisor condition for a cyclic word period; repetitions is the integer quotient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        proposedPeriod: { type: "integer", minimum: 1 },
      },
      required: ["length", "proposedPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        divides: { type: "boolean" },
        repetitions: { type: "integer" },
      },
      required: ["divides", "repetitions"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "proposedPeriod",
          label: "Proposed Period",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "divides", label: "Divides", valueType: { type: "boolean" } },
        {
          id: "repetitions",
          label: "Repetitions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = necklacePeriodDivisorFlagTool.execute;
export default necklacePeriodDivisorFlagTool;
