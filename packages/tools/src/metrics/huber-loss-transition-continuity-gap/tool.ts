import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly delta: number };
export type Output = {
  readonly quadraticLimit: number;
  readonly linearLimit: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "number", exclusiveMinimum: 0 } },
  required: ["delta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quadraticLimit: { type: "number" },
    linearLimit: { type: "number" },
    gap: { type: "number" },
  },
  required: ["quadraticLimit", "linearLimit", "gap"],
} as const;
/** Calculate huber loss transition continuity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delta } = request;
  const compute = (): Output => {
    H.positive(delta);
    const limit = 0.5 * delta * delta;
    return { quadraticLimit: limit, linearLimit: limit, gap: 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delta: 2 },
  output: { quadraticLimit: 2, linearLimit: 2, gap: 0 },
} satisfies ToolExample<Input, Output>;
export const huberLossTransitionContinuityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/huber-loss-transition-continuity-gap",
    title: "Huber Loss Transition Continuity Gap Tool",
    description:
      "Calculate huber loss transition continuity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delta: { type: "number", exclusiveMinimum: 0 } },
      required: ["delta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quadraticLimit: { type: "number" },
        linearLimit: { type: "number" },
        gap: { type: "number" },
      },
      required: ["quadraticLimit", "linearLimit", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "delta",
          label: "Delta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "quadraticLimit",
          label: "Quadratic Limit",
          valueType: { type: "number" },
        },
        {
          id: "linearLimit",
          label: "Linear Limit",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = huberLossTransitionContinuityGapTool.execute;
export default huberLossTransitionContinuityGapTool;
