import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly current: string;
  readonly left: string;
  readonly right: string;
};
export type Output = { readonly residual: string; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "string", maxLength: 8192 },
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
  },
  required: ["current", "left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "string", maxLength: 8192 },
    valid: { type: "boolean" },
  },
  required: ["residual", "valid"],
} as const;
/** Compute binomial pascal single recurrence residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { current, left, right } = input;
  const compute = (): Output => {
    const residual = decimal(current) - decimal(left) - decimal(right);
    return { residual: residual.toString(), valid: residual === 0n };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { current: "10", left: "4", right: "6" },
  output: { residual: "0", valid: true },
} satisfies ToolExample<Input, Output>;
export const binomialPascalSingleRecurrenceResidualTool =
  defineSchemaCalculation<Input, Output>({
    id: "combinatorics/binomial-pascal-single-recurrence-residual",
    title: "Binomial Pascal Single Recurrence Residual Tool",
    description:
      "Compute binomial pascal single recurrence residual from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "string" } },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = binomialPascalSingleRecurrenceResidualTool.execute;
export default binomialPascalSingleRecurrenceResidualTool;
