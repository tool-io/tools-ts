import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerDistance: number;
  readonly firstRadius: number;
  readonly secondRadius: number;
};
export type Output = {
  readonly edgeGap: number;
  readonly touchingOrOverlapping: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerDistance: { type: "number", minimum: 0 },
    firstRadius: { type: "number", minimum: 0 },
    secondRadius: { type: "number", minimum: 0 },
  },
  required: ["centerDistance", "firstRadius", "secondRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeGap: { type: "number" },
    touchingOrOverlapping: { type: "boolean" },
  },
  required: ["edgeGap", "touchingOrOverlapping"],
} as const;
/** Circular-patch geometric gap only; not an ecological dispersal or connectivity prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerDistance, firstRadius, secondRadius } = request;
  const compute = (): Output => {
    H.domain(centerDistance >= 0 && firstRadius >= 0 && secondRadius >= 0);
    return {
      edgeGap: Math.max(0, centerDistance - firstRadius - secondRadius),
      touchingOrOverlapping: centerDistance <= firstRadius + secondRadius,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerDistance: 10, firstRadius: 2, secondRadius: 3 },
  output: { edgeGap: 5, touchingOrOverlapping: false },
} satisfies ToolExample<Input, Output>;
export const landscapeConnectivityGapTwoPatchesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/landscape-connectivity-gap-two-patches",
    title: "Landscape Connectivity Gap Two Patches Tool",
    description:
      "Circular-patch geometric gap only; not an ecological dispersal or connectivity prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerDistance: { type: "number", minimum: 0 },
        firstRadius: { type: "number", minimum: 0 },
        secondRadius: { type: "number", minimum: 0 },
      },
      required: ["centerDistance", "firstRadius", "secondRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeGap: { type: "number" },
        touchingOrOverlapping: { type: "boolean" },
      },
      required: ["edgeGap", "touchingOrOverlapping"],
    },
    ports: {
      inputs: [
        {
          id: "centerDistance",
          label: "Center Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRadius",
          label: "First Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRadius",
          label: "Second Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "edgeGap", label: "Edge Gap", valueType: { type: "number" } },
        {
          id: "touchingOrOverlapping",
          label: "Touching Or Overlapping",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = landscapeConnectivityGapTwoPatchesTool.execute;
export default landscapeConnectivityGapTwoPatchesTool;
