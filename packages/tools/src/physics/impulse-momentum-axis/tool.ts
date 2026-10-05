import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMomentum: number;
  readonly impulse: number;
};
export type Output = { readonly finalMomentum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMomentum: { type: "number" },
    impulse: { type: "number" },
  },
  required: ["initialMomentum", "impulse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { finalMomentum: { type: "number" } },
  required: ["finalMomentum"],
} as const;
/** Apply one signed axial impulse to the initial momentum in consistent momentum units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMomentum, impulse } = request;
  const compute = (): Output => {
    return { finalMomentum: initialMomentum + impulse };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialMomentum: 12, impulse: -5 },
  output: { finalMomentum: 7 },
} satisfies ToolExample<Input, Output>;
export const impulseMomentumAxisTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "physics/impulse-momentum-axis",
      title: "Impulse Momentum Axis Tool",
      description:
        "Apply one signed axial impulse to the initial momentum in consistent momentum units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialMomentum: { type: "number" },
          impulse: { type: "number" },
        },
        required: ["initialMomentum", "impulse"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { finalMomentum: { type: "number" } },
        required: ["finalMomentum"],
      },
      ports: {
        inputs: [
          {
            id: "initialMomentum",
            label: "Initial Momentum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "impulse",
            label: "Impulse",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "finalMomentum",
            label: "Final Momentum",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = impulseMomentumAxisTool.execute;
export default impulseMomentumAxisTool;
