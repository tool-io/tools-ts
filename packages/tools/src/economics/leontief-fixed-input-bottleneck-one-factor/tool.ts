import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableInput: number;
  readonly requiredPerOutput: number;
};
export type Output = { readonly outputCap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableInput: { type: "number", minimum: 0 },
    requiredPerOutput: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["availableInput", "requiredPerOutput"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outputCap: { type: "number" } },
  required: ["outputCap"],
} as const;
/** Calculate leontief fixed input bottleneck one factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableInput, requiredPerOutput } = request;
  const compute = (): Output => {
    H.domain(availableInput >= 0);
    H.positive(requiredPerOutput);
    return { outputCap: availableInput / requiredPerOutput };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableInput: 120, requiredPerOutput: 3 },
  output: { outputCap: 40 },
} satisfies ToolExample<Input, Output>;
export const leontiefFixedInputBottleneckOneFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economics/leontief-fixed-input-bottleneck-one-factor",
      title: "Leontief Fixed Input Bottleneck One Factor Tool",
      description:
        "Calculate leontief fixed input bottleneck one factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableInput: { type: "number", minimum: 0 },
          requiredPerOutput: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["availableInput", "requiredPerOutput"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { outputCap: { type: "number" } },
        required: ["outputCap"],
      },
      ports: {
        inputs: [
          {
            id: "availableInput",
            label: "Available Input",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "requiredPerOutput",
            label: "Required Per Output",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "outputCap",
            label: "Output Cap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = leontiefFixedInputBottleneckOneFactorTool.execute;
export default leontiefFixedInputBottleneckOneFactorTool;
