import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldHubble: number;
  readonly newHubble: number;
  readonly oldModulus: number;
};
export type Output = {
  readonly distanceFactor: number;
  readonly modulusShift: number;
  readonly newModulus: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldHubble: { type: "number", exclusiveMinimum: 0 },
    newHubble: { type: "number", exclusiveMinimum: 0 },
    oldModulus: { type: "number" },
  },
  required: ["oldHubble", "newHubble", "oldModulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distanceFactor: { type: "number" },
    modulusShift: { type: "number" },
    newModulus: { type: "number" },
  },
  required: ["distanceFactor", "modulusShift", "newModulus"],
} as const;
/** Hold dimensionless expansion history and observed redshift fixed while distances scale inversely with H0. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldHubble, newHubble, oldModulus } = request;
  const compute = (): Output => {
    H.positive(oldHubble);
    H.positive(newHubble);
    return {
      distanceFactor: oldHubble / newHubble,
      modulusShift: 5 * Math.log10(oldHubble / newHubble),
      newModulus: oldModulus + 5 * Math.log10(oldHubble / newHubble),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldHubble: 70, newHubble: 140, oldModulus: 40 },
  output: {
    distanceFactor: 0.5,
    modulusShift: -1.505149978319906,
    newModulus: 38.494850021680094,
  },
} satisfies ToolExample<Input, Output>;
export const distanceModulusHubbleRescaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/distance-modulus-hubble-rescale-term",
    title: "Distance Modulus Hubble Rescale Term Tool",
    description:
      "Hold dimensionless expansion history and observed redshift fixed while distances scale inversely with H0.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldHubble: { type: "number", exclusiveMinimum: 0 },
        newHubble: { type: "number", exclusiveMinimum: 0 },
        oldModulus: { type: "number" },
      },
      required: ["oldHubble", "newHubble", "oldModulus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distanceFactor: { type: "number" },
        modulusShift: { type: "number" },
        newModulus: { type: "number" },
      },
      required: ["distanceFactor", "modulusShift", "newModulus"],
    },
    ports: {
      inputs: [
        {
          id: "oldHubble",
          label: "Old Hubble",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newHubble",
          label: "New Hubble",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldModulus",
          label: "Old Modulus",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceFactor",
          label: "Distance Factor",
          valueType: { type: "number" },
        },
        {
          id: "modulusShift",
          label: "Modulus Shift",
          valueType: { type: "number" },
        },
        {
          id: "newModulus",
          label: "New Modulus",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = distanceModulusHubbleRescaleTermTool.execute;
export default distanceModulusHubbleRescaleTermTool;
