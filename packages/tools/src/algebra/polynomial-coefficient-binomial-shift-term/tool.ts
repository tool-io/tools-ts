import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly coefficient: number;
  readonly sourcePower: number;
  readonly targetPower: number;
  readonly shift: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "number" },
    sourcePower: { type: "integer", minimum: 0, maximum: 128 },
    targetPower: { type: "integer", minimum: 0 },
    shift: { type: "number" },
  },
  required: ["coefficient", "sourcePower", "targetPower", "shift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Compute polynomial coefficient binomial shift term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { coefficient, sourcePower, targetPower, shift } = input;
  const compute = (): Output => {
    integer(sourcePower, 0, 128);
    integer(targetPower, 0, sourcePower);
    let choose = 1;
    for (let i = 1; i <= targetPower; i++)
      choose = (choose * (sourcePower - i + 1)) / i;
    return {
      contribution: coefficient * choose * shift ** (sourcePower - targetPower),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { coefficient: 2, sourcePower: 3, targetPower: 1, shift: 2 },
  output: { contribution: 24 },
} satisfies ToolExample<Input, Output>;
export const polynomialCoefficientBinomialShiftTermTool =
  defineSchemaCalculation<Input, Output>({
    id: "algebra/polynomial-coefficient-binomial-shift-term",
    title: "Polynomial Coefficient Binomial Shift Term Tool",
    description:
      "Compute polynomial coefficient binomial shift term from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourcePower",
          label: "Source Power",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetPower",
          label: "Target Power",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shift",
          label: "Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  });
export const run = polynomialCoefficientBinomialShiftTermTool.execute;
export default polynomialCoefficientBinomialShiftTermTool;
