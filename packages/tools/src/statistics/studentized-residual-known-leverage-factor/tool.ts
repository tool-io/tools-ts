import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residual: number;
  readonly standardDeviation: number;
  readonly leverage: number;
};
export type Output = { readonly studentized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    standardDeviation: { type: "number", exclusiveMinimum: 0 },
    leverage: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["residual", "standardDeviation", "leverage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { studentized: { type: "number" } },
  required: ["studentized"],
} as const;
/** Calculate studentized residual known leverage factor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { residual, standardDeviation, leverage } = input;
  const compute = (): Output => {
    H.positive(standardDeviation);
    H.domain(leverage >= 0 && leverage < 1);
    return {
      studentized: residual / (standardDeviation * Math.sqrt(1 - leverage)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { residual: 3, standardDeviation: 2, leverage: 0.75 },
  output: { studentized: 3 },
} satisfies ToolExample<Input, Output>;
export const studentizedResidualKnownLeverageFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/studentized-residual-known-leverage-factor",
      title: "Studentized Residual Known Leverage Factor Tool",
      description:
        "Calculate studentized residual known leverage factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          residual: { type: "number" },
          standardDeviation: { type: "number", exclusiveMinimum: 0 },
          leverage: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        },
        required: ["residual", "standardDeviation", "leverage"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { studentized: { type: "number" } },
        required: ["studentized"],
      },
      ports: {
        inputs: [
          {
            id: "residual",
            label: "Residual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "standardDeviation",
            label: "Standard Deviation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leverage",
            label: "Leverage",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "studentized",
            label: "Studentized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = studentizedResidualKnownLeverageFactorTool.execute;
export default studentizedResidualKnownLeverageFactorTool;
