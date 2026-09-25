import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentOutput: number;
  readonly proportional: number;
  readonly derivative: number;
  readonly feedforward: number;
};
export type Output = { readonly requiredIntegral: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentOutput: { type: "number" },
    proportional: { type: "number" },
    derivative: { type: "number" },
    feedforward: { type: "number" },
  },
  required: ["currentOutput", "proportional", "derivative", "feedforward"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredIntegral: { type: "number" } },
  required: ["requiredIntegral"],
} as const;
/** Calculate controller bumpless transfer integral offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentOutput, proportional, derivative, feedforward } = request;
  const compute = (): Output => {
    return {
      requiredIntegral: currentOutput - proportional - derivative - feedforward,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentOutput: 20, proportional: 5, derivative: 2, feedforward: 3 },
  output: { requiredIntegral: 10 },
} satisfies ToolExample<Input, Output>;
export const controllerBumplessTransferIntegralOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cybernetics/controller-bumpless-transfer-integral-offset",
      title: "Controller Bumpless Transfer Integral Offset Tool",
      description:
        "Calculate controller bumpless transfer integral offset from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          currentOutput: { type: "number" },
          proportional: { type: "number" },
          derivative: { type: "number" },
          feedforward: { type: "number" },
        },
        required: [
          "currentOutput",
          "proportional",
          "derivative",
          "feedforward",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { requiredIntegral: { type: "number" } },
        required: ["requiredIntegral"],
      },
      ports: {
        inputs: [
          {
            id: "currentOutput",
            label: "Current Output",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "proportional",
            label: "Proportional",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "derivative",
            label: "Derivative",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feedforward",
            label: "Feedforward",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "requiredIntegral",
            label: "Required Integral",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = controllerBumplessTransferIntegralOffsetTool.execute;
export default controllerBumplessTransferIntegralOffsetTool;
