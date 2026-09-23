import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAngle: number;
  readonly secondAngle: number;
  readonly clockwise: boolean;
};
export type Output = {
  readonly forwardRadians: number;
  readonly smallestRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAngle: { type: "number" },
    secondAngle: { type: "number" },
    clockwise: { type: "boolean" },
  },
  required: ["firstAngle", "secondAngle", "clockwise"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardRadians: { type: "number" },
    smallestRadians: { type: "number" },
  },
  required: ["forwardRadians", "smallestRadians"],
} as const;
/** Circular divergence between supplied radian leaf angles with an explicit orientation; no phyllotactic sequence is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAngle, secondAngle, clockwise } = request;
  const compute = (): Output => {
    const period = 2 * Math.PI,
      difference = (clockwise ? 1 : -1) * (secondAngle - firstAngle),
      r = difference % period,
      forwardRadians = r < 0 ? r + period : r;
    return {
      forwardRadians,
      smallestRadians: Math.min(forwardRadians, period - forwardRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAngle: 0, secondAngle: 1.5707963267948966, clockwise: true },
  output: {
    forwardRadians: 1.5707963267948966,
    smallestRadians: 1.5707963267948966,
  },
} satisfies ToolExample<Input, Output>;
export const phyllotaxisDivergenceAngleWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/phyllotaxis-divergence-angle-wrap",
    title: "Phyllotaxis Divergence Angle Wrap Tool",
    description:
      "Circular divergence between supplied radian leaf angles with an explicit orientation; no phyllotactic sequence is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAngle: { type: "number" },
        secondAngle: { type: "number" },
        clockwise: { type: "boolean" },
      },
      required: ["firstAngle", "secondAngle", "clockwise"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardRadians: { type: "number" },
        smallestRadians: { type: "number" },
      },
      required: ["forwardRadians", "smallestRadians"],
    },
    ports: {
      inputs: [
        {
          id: "firstAngle",
          label: "First Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAngle",
          label: "Second Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockwise",
          label: "Clockwise",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "forwardRadians",
          label: "Forward Radians",
          valueType: { type: "number", unit: "rad" },
        },
        {
          id: "smallestRadians",
          label: "Smallest Radians",
          valueType: { type: "number", unit: "rad" },
        },
      ],
    },
  },
  calculate,
});
export const run = phyllotaxisDivergenceAngleWrapTool.execute;
export default phyllotaxisDivergenceAngleWrapTool;
