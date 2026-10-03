import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: number;
  readonly firstUpper: number;
  readonly secondLower: number;
  readonly secondUpper: number;
  readonly firstRightClosed: boolean;
  readonly secondLeftClosed: boolean;
};
export type Output = {
  readonly touches: boolean;
  readonly intersectsAtJoin: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "number" },
    firstUpper: { type: "number" },
    secondLower: { type: "number" },
    secondUpper: { type: "number" },
    firstRightClosed: { type: "boolean" },
    secondLeftClosed: { type: "boolean" },
  },
  required: [
    "firstLower",
    "firstUpper",
    "secondLower",
    "secondUpper",
    "firstRightClosed",
    "secondLeftClosed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    touches: { type: "boolean" },
    intersectsAtJoin: { type: "boolean" },
  },
  required: ["touches", "intersectsAtJoin"],
} as const;
/** Calculate interval set touching endpoint policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstLower,
    firstUpper,
    secondLower,
    secondUpper,
    firstRightClosed,
    secondLeftClosed,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstLower < firstUpper &&
        secondLower < secondUpper &&
        firstUpper <= secondLower,
    );
    const touches = firstUpper === secondLower;
    return {
      touches,
      intersectsAtJoin: touches && firstRightClosed && secondLeftClosed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLower: 0,
    firstUpper: 2,
    secondLower: 2,
    secondUpper: 4,
    firstRightClosed: true,
    secondLeftClosed: false,
  },
  output: { touches: true, intersectsAtJoin: false },
} satisfies ToolExample<Input, Output>;
export const intervalSetTouchingEndpointPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/interval-set-touching-endpoint-policy",
    title: "Interval Set Touching Endpoint Policy Tool",
    description:
      "Calculate interval set touching endpoint policy from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLower: { type: "number" },
        firstUpper: { type: "number" },
        secondLower: { type: "number" },
        secondUpper: { type: "number" },
        firstRightClosed: { type: "boolean" },
        secondLeftClosed: { type: "boolean" },
      },
      required: [
        "firstLower",
        "firstUpper",
        "secondLower",
        "secondUpper",
        "firstRightClosed",
        "secondLeftClosed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        touches: { type: "boolean" },
        intersectsAtJoin: { type: "boolean" },
      },
      required: ["touches", "intersectsAtJoin"],
    },
    ports: {
      inputs: [
        {
          id: "firstLower",
          label: "First Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstUpper",
          label: "First Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondLower",
          label: "Second Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondUpper",
          label: "Second Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRightClosed",
          label: "First Right Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondLeftClosed",
          label: "Second Left Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "touches", label: "Touches", valueType: { type: "boolean" } },
        {
          id: "intersectsAtJoin",
          label: "Intersects At Join",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = intervalSetTouchingEndpointPolicyTool.execute;
export default intervalSetTouchingEndpointPolicyTool;
