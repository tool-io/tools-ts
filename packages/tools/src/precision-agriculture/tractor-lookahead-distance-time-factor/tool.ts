import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speed: number;
  readonly delay: number;
  readonly acceleration: number;
};
export type Output = { readonly lookaheadDistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speed: { type: "number" },
    delay: { type: "number", minimum: 0 },
    acceleration: { type: "number" },
  },
  required: ["speed", "delay", "acceleration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lookaheadDistance: { type: "number" } },
  required: ["lookaheadDistance"],
} as const;
/** Calculate tractor lookahead distance time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speed, delay, acceleration } = request;
  const compute = (): Output => {
    H.domain(delay >= 0);
    return {
      lookaheadDistance: speed * delay + (acceleration * delay ** 2) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speed: 3, delay: 2, acceleration: 0.5 },
  output: { lookaheadDistance: 7 },
} satisfies ToolExample<Input, Output>;
export const tractorLookaheadDistanceTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/tractor-lookahead-distance-time-factor",
    title: "Tractor Lookahead Distance Time Factor Tool",
    description:
      "Calculate tractor lookahead distance time factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speed: { type: "number" },
        delay: { type: "number", minimum: 0 },
        acceleration: { type: "number" },
      },
      required: ["speed", "delay", "acceleration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lookaheadDistance: { type: "number" } },
      required: ["lookaheadDistance"],
    },
    ports: {
      inputs: [
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceleration",
          label: "Acceleration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lookaheadDistance",
          label: "Lookahead Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tractorLookaheadDistanceTimeFactorTool.execute;
export default tractorLookaheadDistanceTimeFactorTool;
