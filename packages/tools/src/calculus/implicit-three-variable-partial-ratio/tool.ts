import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly fx: number;
  readonly fy: number;
  readonly fz: number;
};
export type Output = { readonly dzdx: number; readonly dzdy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fx: { type: "number" },
    fy: { type: "number" },
    fz: { type: "number" },
  },
  required: ["fx", "fy", "fz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dzdx: { type: "number" }, dzdy: { type: "number" } },
  required: ["dzdx", "dzdy"],
} as const;
/** Compute implicit three variable partial ratio from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { fx, fy, fz } = input;
  const compute = (): Output => {
    domain(fz !== 0);
    return { dzdx: -fx / fz, dzdy: -fy / fz };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { fx: 2, fy: 6, fz: 2 },
  output: { dzdx: -1, dzdy: -3 },
} satisfies ToolExample<Input, Output>;
export const implicitThreeVariablePartialRatioTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/implicit-three-variable-partial-ratio",
  title: "Implicit Three Variable Partial Ratio Tool",
  description:
    "Compute implicit three variable partial ratio from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      { id: "fx", label: "Fx", required: true, valueType: { type: "number" } },
      { id: "fy", label: "Fy", required: true, valueType: { type: "number" } },
      { id: "fz", label: "Fz", required: true, valueType: { type: "number" } },
    ],
    outputs: [
      { id: "dzdx", label: "Dzdx", valueType: { type: "number" } },
      { id: "dzdy", label: "Dzdy", valueType: { type: "number" } },
    ],
  },
});
export const run = implicitThreeVariablePartialRatioTool.execute;
export default implicitThreeVariablePartialRatioTool;
