import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forceX: number;
  readonly forceY: number;
  readonly displacementX: number;
  readonly displacementY: number;
};
export type Output = { readonly work: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forceX: { type: "number" },
    forceY: { type: "number" },
    displacementX: { type: "number" },
    displacementY: { type: "number" },
  },
  required: ["forceX", "forceY", "displacementX", "displacementY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { work: { type: "number" } },
  required: ["work"],
} as const;
/** Compute planar work for a constant force over a supplied displacement by the dot product, using consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forceX, forceY, displacementX, displacementY } = request;
  const compute = (): Output => {
    return { work: forceX * displacementX + forceY * displacementY };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forceX: 3, forceY: 4, displacementX: 2, displacementY: -1 },
  output: { work: 2 },
} satisfies ToolExample<Input, Output>;
export const smallDisplacementWorkProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/small-displacement-work-projection",
    title: "Small Displacement Work Projection Tool",
    description:
      "Compute planar work for a constant force over a supplied displacement by the dot product, using consistent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forceX: { type: "number" },
        forceY: { type: "number" },
        displacementX: { type: "number" },
        displacementY: { type: "number" },
      },
      required: ["forceX", "forceY", "displacementX", "displacementY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { work: { type: "number" } },
      required: ["work"],
    },
    ports: {
      inputs: [
        {
          id: "forceX",
          label: "Force X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forceY",
          label: "Force Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacementX",
          label: "Displacement X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacementY",
          label: "Displacement Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "work", label: "Work", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = smallDisplacementWorkProjectionTool.execute;
export default smallDisplacementWorkProjectionTool;
