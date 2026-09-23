import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly forward: number;
  readonly backward: number;
  readonly abandoned: number;
};
export type Output = { readonly closing: number; readonly netForward: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer", minimum: 0 },
    forward: { type: "integer", minimum: 0 },
    backward: { type: "integer", minimum: 0 },
    abandoned: { type: "integer", minimum: 0 },
  },
  required: ["opening", "forward", "backward", "abandoned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closing: { type: "integer" }, netForward: { type: "integer" } },
  required: ["closing", "netForward"],
} as const;
/** Calculate funnel back track count delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, forward, backward, abandoned } = request;
  const compute = (): Output => {
    H.integer(opening, 0);
    H.integer(forward, 0);
    H.integer(backward, 0);
    H.integer(abandoned, 0);
    H.domain(forward + abandoned <= opening + backward);
    return {
      closing: opening + backward - forward - abandoned,
      netForward: forward - backward,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: 100, forward: 30, backward: 5, abandoned: 10 },
  output: { closing: 65, netForward: 25 },
} satisfies ToolExample<Input, Output>;
export const funnelBackTrackCountDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/funnel-back-track-count-delta",
    title: "Funnel Back Track Count Delta Tool",
    description:
      "Calculate funnel back track count delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "integer", minimum: 0 },
        forward: { type: "integer", minimum: 0 },
        backward: { type: "integer", minimum: 0 },
        abandoned: { type: "integer", minimum: 0 },
      },
      required: ["opening", "forward", "backward", "abandoned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closing: { type: "integer" },
        netForward: { type: "integer" },
      },
      required: ["closing", "netForward"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "forward",
          label: "Forward",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "backward",
          label: "Backward",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "abandoned",
          label: "Abandoned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "closing", label: "Closing", valueType: { type: "integer" } },
        {
          id: "netForward",
          label: "Net Forward",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = funnelBackTrackCountDeltaTool.execute;
export default funnelBackTrackCountDeltaTool;
