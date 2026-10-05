import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredComponentMass: number;
  readonly availableComponentMass: number;
};
export type Output = {
  readonly shortfallMass: number;
  readonly surplusMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredComponentMass: { type: "number", minimum: 0 },
    availableComponentMass: { type: "number", minimum: 0 },
  },
  required: ["requiredComponentMass", "availableComponentMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfallMass: { type: "number" },
    surplusMass: { type: "number" },
  },
  required: ["shortfallMass", "surplusMass"],
} as const;
/** Separate the nonnegative shortfall and surplus for one required mixture component mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredComponentMass, availableComponentMass } = request;
  const compute = (): Output => {
    H.domain(
      requiredComponentMass >= 0 && availableComponentMass >= 0,
      "requiredComponentMass",
    );
    return {
      shortfallMass: Math.max(
        0,
        requiredComponentMass - availableComponentMass,
      ),
      surplusMass: Math.max(0, availableComponentMass - requiredComponentMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredComponentMass: 8, availableComponentMass: 5 },
  output: { shortfallMass: 3, surplusMass: 0 },
} satisfies ToolExample<Input, Output>;
export const mixtureSingleComponentShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/mixture-single-component-shortfall",
    title: "Mixture Single Component Shortfall Tool",
    description:
      "Separate the nonnegative shortfall and surplus for one required mixture component mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredComponentMass: { type: "number", minimum: 0 },
        availableComponentMass: { type: "number", minimum: 0 },
      },
      required: ["requiredComponentMass", "availableComponentMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfallMass: { type: "number" },
        surplusMass: { type: "number" },
      },
      required: ["shortfallMass", "surplusMass"],
    },
    ports: {
      inputs: [
        {
          id: "requiredComponentMass",
          label: "Required Component Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "availableComponentMass",
          label: "Available Component Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shortfallMass",
          label: "Shortfall Mass",
          valueType: { type: "number" },
        },
        {
          id: "surplusMass",
          label: "Surplus Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mixtureSingleComponentShortfallTool.execute;
export default mixtureSingleComponentShortfallTool;
