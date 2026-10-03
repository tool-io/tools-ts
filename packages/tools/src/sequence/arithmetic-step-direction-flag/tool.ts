import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly step: number };
export type Output = { readonly direction: string; readonly constant: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { step: { type: "number" } },
  required: ["step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    direction: { type: "string", maxLength: 8192 },
    constant: { type: "boolean" },
  },
  required: ["direction", "constant"],
} as const;
/** Calculate arithmetic step direction flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { step } = request;
  const compute = (): Output => {
    return {
      direction: step > 0 ? "increasing" : step < 0 ? "decreasing" : "constant",
      constant: step === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { step: -2 },
  output: { direction: "decreasing", constant: false },
} satisfies ToolExample<Input, Output>;
export const arithmeticStepDirectionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/arithmetic-step-direction-flag",
    title: "Arithmetic Step Direction Flag Tool",
    description:
      "Calculate arithmetic step direction flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { step: { type: "number" } },
      required: ["step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        direction: { type: "string", maxLength: 8192 },
        constant: { type: "boolean" },
      },
      required: ["direction", "constant"],
    },
    ports: {
      inputs: [
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "direction", label: "Direction", valueType: { type: "string" } },
        { id: "constant", label: "Constant", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = arithmeticStepDirectionFlagTool.execute;
export default arithmeticStepDirectionFlagTool;
