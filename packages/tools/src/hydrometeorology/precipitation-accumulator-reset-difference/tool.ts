import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousTotal: number;
  readonly currentTotal: number;
  readonly knownResetToZero: boolean;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousTotal: { type: "number", minimum: 0 },
    currentTotal: { type: "number", minimum: 0 },
    knownResetToZero: { type: "boolean" },
  },
  required: ["previousTotal", "currentTotal", "knownResetToZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "number" } },
  required: ["increment"],
} as const;
/** Calculate one explicit precipitation accumulator increment, using current total after a caller-confirmed zero reset and preserving signed discrepancies otherwise. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousTotal, currentTotal, knownResetToZero } = request;
  const compute = (): Output => {
    H.domain(previousTotal >= 0, "previousTotal");
    H.domain(currentTotal >= 0, "currentTotal");
    return {
      increment: knownResetToZero ? currentTotal : currentTotal - previousTotal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousTotal: 12, currentTotal: 3, knownResetToZero: true },
  output: { increment: 3 },
} satisfies ToolExample<Input, Output>;
export const precipitationAccumulatorResetDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/precipitation-accumulator-reset-difference",
      title: "Precipitation Accumulator Reset Difference Tool",
      description:
        "Calculate one explicit precipitation accumulator increment, using current total after a caller-confirmed zero reset and preserving signed discrepancies otherwise.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousTotal: { type: "number", minimum: 0 },
          currentTotal: { type: "number", minimum: 0 },
          knownResetToZero: { type: "boolean" },
        },
        required: ["previousTotal", "currentTotal", "knownResetToZero"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { increment: { type: "number" } },
        required: ["increment"],
      },
      ports: {
        inputs: [
          {
            id: "previousTotal",
            label: "Previous Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentTotal",
            label: "Current Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "knownResetToZero",
            label: "Known Reset To Zero",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "increment",
            label: "Increment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = precipitationAccumulatorResetDifferenceTool.execute;
export default precipitationAccumulatorResetDifferenceTool;
