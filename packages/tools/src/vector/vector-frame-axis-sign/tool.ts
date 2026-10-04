import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly component: number;
  readonly axisOrientation: number;
};
export type Output = {
  readonly signedComponent: number;
  readonly sign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "number" },
    axisOrientation: { type: "integer" },
  },
  required: ["component", "axisOrientation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedComponent: { type: "number" },
    sign: { type: "integer" },
  },
  required: ["signedComponent", "sign"],
} as const;
/** Calculate vector frame axis sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { component, axisOrientation } = request;
  const compute = (): Output => {
    H.domain(axisOrientation === 1 || axisOrientation === -1);
    return {
      signedComponent: component * axisOrientation,
      sign: Math.sign(component * axisOrientation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { component: -3, axisOrientation: -1 },
  output: { signedComponent: 3, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const vectorFrameAxisSignTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "vector/vector-frame-axis-sign",
      title: "Vector Frame Axis Sign Tool",
      description:
        "Calculate vector frame axis sign from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          component: { type: "number" },
          axisOrientation: { type: "integer" },
        },
        required: ["component", "axisOrientation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedComponent: { type: "number" },
          sign: { type: "integer" },
        },
        required: ["signedComponent", "sign"],
      },
      ports: {
        inputs: [
          {
            id: "component",
            label: "Component",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "axisOrientation",
            label: "Axis Orientation",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "signedComponent",
            label: "Signed Component",
            valueType: { type: "number" },
          },
          { id: "sign", label: "Sign", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  },
);
export const run = vectorFrameAxisSignTool.execute;
export default vectorFrameAxisSignTool;
