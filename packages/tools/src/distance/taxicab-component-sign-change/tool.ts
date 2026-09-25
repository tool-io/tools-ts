import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly component: number;
  readonly reverseSign: boolean;
  readonly otherComponent: number;
};
export type Output = {
  readonly distanceBefore: number;
  readonly distanceAfter: number;
  readonly distanceChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "number" },
    reverseSign: { type: "boolean" },
    otherComponent: { type: "number" },
  },
  required: ["component", "reverseSign", "otherComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceBefore: { type: "number" },
    distanceAfter: { type: "number" },
    distanceChange: { type: "number" },
  },
  required: ["distanceBefore", "distanceAfter", "distanceChange"],
} as const;
/** Calculate taxicab component sign change from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { component, reverseSign, otherComponent } = request;
  const compute = (): Output => {
    return {
      distanceBefore: Math.abs(component - otherComponent),
      distanceAfter: Math.abs(
        component * (reverseSign ? -1 : 1) - otherComponent,
      ),
      distanceChange:
        Math.abs(component * (reverseSign ? -1 : 1) - otherComponent) -
        Math.abs(component - otherComponent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { component: 3, reverseSign: true, otherComponent: 2 },
  output: { distanceBefore: 1, distanceAfter: 5, distanceChange: 4 },
} satisfies ToolExample<Input, Output>;
export const taxicabComponentSignChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/taxicab-component-sign-change",
    title: "Taxicab Component Sign Change Tool",
    description:
      "Calculate taxicab component sign change from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        component: { type: "number" },
        reverseSign: { type: "boolean" },
        otherComponent: { type: "number" },
      },
      required: ["component", "reverseSign", "otherComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceBefore: { type: "number" },
        distanceAfter: { type: "number" },
        distanceChange: { type: "number" },
      },
      required: ["distanceBefore", "distanceAfter", "distanceChange"],
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
          id: "reverseSign",
          label: "Reverse Sign",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "otherComponent",
          label: "Other Component",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceBefore",
          label: "Distance Before",
          valueType: { type: "number" },
        },
        {
          id: "distanceAfter",
          label: "Distance After",
          valueType: { type: "number" },
        },
        {
          id: "distanceChange",
          label: "Distance Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxicabComponentSignChangeTool.execute;
export default taxicabComponentSignChangeTool;
