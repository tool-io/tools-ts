import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly velocity: number;
  readonly leftValue: number;
  readonly rightValue: number;
};
export type Output = { readonly upwindValue: number; readonly flux: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    velocity: { type: "number" },
    leftValue: { type: "number" },
    rightValue: { type: "number" },
  },
  required: ["velocity", "leftValue", "rightValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { upwindValue: { type: "number" }, flux: { type: "number" } },
  required: ["upwindValue", "flux"],
} as const;
/** First-order scalar upwind advective flux on a left-to-right interface normal; zero velocity selects the left state with zero flux. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { velocity, leftValue, rightValue } = request;
  const compute = (): Output => {
    return {
      upwindValue: velocity >= 0 ? leftValue : rightValue,
      flux: velocity * (velocity >= 0 ? leftValue : rightValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { velocity: 2, leftValue: 3, rightValue: 5 },
  output: { upwindValue: 3, flux: 6 },
} satisfies ToolExample<Input, Output>;
export const upwindAdvectionOneInterfaceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/upwind-advection-one-interface-term",
    title: "Upwind Advection One Interface Term Tool",
    description:
      "First-order scalar upwind advective flux on a left-to-right interface normal; zero velocity selects the left state with zero flux.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        velocity: { type: "number" },
        leftValue: { type: "number" },
        rightValue: { type: "number" },
      },
      required: ["velocity", "leftValue", "rightValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { upwindValue: { type: "number" }, flux: { type: "number" } },
      required: ["upwindValue", "flux"],
    },
    ports: {
      inputs: [
        {
          id: "velocity",
          label: "Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "upwindValue",
          label: "Upwind Value",
          valueType: { type: "number" },
        },
        { id: "flux", label: "Flux", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = upwindAdvectionOneInterfaceTermTool.execute;
export default upwindAdvectionOneInterfaceTermTool;
