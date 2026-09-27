import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exactInterest: number;
  readonly bookedInterest: number;
  readonly priorReserve: number;
};
export type Output = { readonly reserve: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exactInterest: { type: "number" },
    bookedInterest: { type: "number" },
    priorReserve: { type: "number" },
  },
  required: ["exactInterest", "bookedInterest", "priorReserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reserve: { type: "number" } },
  required: ["reserve"],
} as const;
/** Carry an unrounded-minus-booked interest residual into a supplied prior reserve. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { exactInterest, bookedInterest, priorReserve } = input;
  const compute = (): Output => {
    return { reserve: priorReserve + exactInterest - bookedInterest };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { exactInterest: 10.125, bookedInterest: 10.12, priorReserve: 0.005 },
  output: { reserve: 0.010000000000001563 },
} satisfies ToolExample<Input, Output>;
export const interestCapitalizationRoundingReserveTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/interest-capitalization-rounding-reserve",
      title: "Interest Capitalization Rounding Reserve Tool",
      description:
        "Carry an unrounded-minus-booked interest residual into a supplied prior reserve.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exactInterest: { type: "number" },
          bookedInterest: { type: "number" },
          priorReserve: { type: "number" },
        },
        required: ["exactInterest", "bookedInterest", "priorReserve"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { reserve: { type: "number" } },
        required: ["reserve"],
      },
      ports: {
        inputs: [
          {
            id: "exactInterest",
            label: "Exact Interest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bookedInterest",
            label: "Booked Interest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "priorReserve",
            label: "Prior Reserve",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "reserve", label: "Reserve", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = interestCapitalizationRoundingReserveTool.execute;
export default interestCapitalizationRoundingReserveTool;
