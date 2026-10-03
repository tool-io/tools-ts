import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concession: number;
  readonly totalMonths: number;
  readonly elapsedMonths: number;
};
export type Output = {
  readonly remainingMonths: number;
  readonly clawback: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concession: { type: "number", minimum: 0 },
    totalMonths: { type: "integer", minimum: 1 },
    elapsedMonths: { type: "integer", minimum: 0 },
  },
  required: ["concession", "totalMonths", "elapsedMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingMonths: { type: "integer" },
    clawback: { type: "number" },
  },
  required: ["remainingMonths", "clawback"],
} as const;
/** Straight-line unamortized concession using an explicit term, without interpreting lease enforceability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concession, totalMonths, elapsedMonths } = request;
  const compute = (): Output => {
    H.domain(concession >= 0);
    H.integer(totalMonths, 1);
    H.integer(elapsedMonths, 0, totalMonths);
    return {
      remainingMonths: totalMonths - elapsedMonths,
      clawback: (concession * (totalMonths - elapsedMonths)) / totalMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concession: 1200, totalMonths: 12, elapsedMonths: 3 },
  output: { remainingMonths: 9, clawback: 900 },
} satisfies ToolExample<Input, Output>;
export const rentConcessionClawbackRemainingTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "real-estate/rent-concession-clawback-remaining-term",
      title: "Rent Concession Clawback Remaining Term Tool",
      description:
        "Straight-line unamortized concession using an explicit term, without interpreting lease enforceability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concession: { type: "number", minimum: 0 },
          totalMonths: { type: "integer", minimum: 1 },
          elapsedMonths: { type: "integer", minimum: 0 },
        },
        required: ["concession", "totalMonths", "elapsedMonths"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingMonths: { type: "integer" },
          clawback: { type: "number" },
        },
        required: ["remainingMonths", "clawback"],
      },
      ports: {
        inputs: [
          {
            id: "concession",
            label: "Concession",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalMonths",
            label: "Total Months",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "elapsedMonths",
            label: "Elapsed Months",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "remainingMonths",
            label: "Remaining Months",
            valueType: { type: "integer" },
          },
          { id: "clawback", label: "Clawback", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = rentConcessionClawbackRemainingTermTool.execute;
export default rentConcessionClawbackRemainingTermTool;
