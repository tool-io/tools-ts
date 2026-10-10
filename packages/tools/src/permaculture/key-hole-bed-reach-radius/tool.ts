import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly accessNotchDepth: number;
  readonly suppliedReach: number;
};
export type Output = {
  readonly remainingRadialDepth: number;
  readonly reachMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number", minimum: 0 },
    accessNotchDepth: { type: "number", minimum: 0 },
    suppliedReach: { type: "number", minimum: 0 },
  },
  required: ["outerRadius", "accessNotchDepth", "suppliedReach"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingRadialDepth: { type: "number" },
    reachMargin: { type: "number" },
  },
  required: ["remainingRadialDepth", "reachMargin"],
} as const;
/** Compare explicit residual radial bed depth with a supplied reach under a one-dimensional notch model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, accessNotchDepth, suppliedReach } = request;
  const compute = (): Output => {
    H.domain(
      outerRadius >= 0 &&
        accessNotchDepth >= 0 &&
        accessNotchDepth <= outerRadius &&
        suppliedReach >= 0,
      "outerRadius",
    );
    return {
      remainingRadialDepth: outerRadius - accessNotchDepth,
      reachMargin: suppliedReach - (outerRadius - accessNotchDepth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerRadius: 2, accessNotchDepth: 0.8, suppliedReach: 1.5 },
  output: { remainingRadialDepth: 1.2, reachMargin: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const keyHoleBedReachRadiusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/key-hole-bed-reach-radius",
    title: "Key Hole BED Reach Radius",
    description:
      "Compare explicit residual radial bed depth with a supplied reach under a one-dimensional notch model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerRadius: { type: "number", minimum: 0 },
        accessNotchDepth: { type: "number", minimum: 0 },
        suppliedReach: { type: "number", minimum: 0 },
      },
      required: ["outerRadius", "accessNotchDepth", "suppliedReach"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingRadialDepth: { type: "number" },
        reachMargin: { type: "number" },
      },
      required: ["remainingRadialDepth", "reachMargin"],
    },
    ports: {
      inputs: [
        {
          id: "outerRadius",
          label: "Outer Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accessNotchDepth",
          label: "Access Notch Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReach",
          label: "Supplied Reach",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingRadialDepth",
          label: "Remaining Radial Depth",
          valueType: { type: "number" },
        },
        {
          id: "reachMargin",
          label: "Reach Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = keyHoleBedReachRadiusTool.execute;
export default keyHoleBedReachRadiusTool;
