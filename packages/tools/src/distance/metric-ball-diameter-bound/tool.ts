import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly measuredSeparation: number;
};
export type Output = {
  readonly upperBound: number;
  readonly compatible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    measuredSeparation: { type: "number", minimum: 0 },
  },
  required: ["radius", "measuredSeparation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperBound: { type: "number" },
    compatible: { type: "boolean" },
  },
  required: ["upperBound", "compatible"],
} as const;
/** Calculate metric ball diameter bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, measuredSeparation } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && measuredSeparation >= 0);
    const upperBound = 2 * radius;
    return { upperBound, compatible: measuredSeparation <= upperBound };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 3, measuredSeparation: 5 },
  output: { upperBound: 6, compatible: true },
} satisfies ToolExample<Input, Output>;
export const metricBallDiameterBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/metric-ball-diameter-bound",
    title: "Metric Ball Diameter Bound Tool",
    description:
      "Calculate metric ball diameter bound from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        measuredSeparation: { type: "number", minimum: 0 },
      },
      required: ["radius", "measuredSeparation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperBound: { type: "number" },
        compatible: { type: "boolean" },
      },
      required: ["upperBound", "compatible"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredSeparation",
          label: "Measured Separation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "upperBound",
          label: "Upper Bound",
          valueType: { type: "number" },
        },
        {
          id: "compatible",
          label: "Compatible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = metricBallDiameterBoundTool.execute;
export default metricBallDiameterBoundTool;
