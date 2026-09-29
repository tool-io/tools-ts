import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sweepRadius: number;
  readonly availableRadius: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sweepRadius: { type: "number", minimum: 0 },
    availableRadius: { type: "number", minimum: 0 },
  },
  required: ["sweepRadius", "availableRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied radial envelopes without collision detection or hardware recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sweepRadius, availableRadius } = request;
  const compute = (): Output => {
    H.domain(sweepRadius >= 0 && availableRadius >= 0);
    return { gap: availableRadius - sweepRadius };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sweepRadius: 8, availableRadius: 10 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const hingeSweepRadiusGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "industrial-design/hinge-sweep-radius-gap",
      title: "Hinge Sweep Radius Gap Tool",
      description:
        "Compare supplied radial envelopes without collision detection or hardware recommendations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sweepRadius: { type: "number", minimum: 0 },
          availableRadius: { type: "number", minimum: 0 },
        },
        required: ["sweepRadius", "availableRadius"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { gap: { type: "number" } },
        required: ["gap"],
      },
      ports: {
        inputs: [
          {
            id: "sweepRadius",
            label: "Sweep Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availableRadius",
            label: "Available Radius",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
      },
    },
    calculate,
  },
);
export const run = hingeSweepRadiusGapTool.execute;
export default hingeSweepRadiusGapTool;
