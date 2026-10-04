import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly structuralSlabLevel: number;
  readonly finishThickness: number;
};
export type Output = { readonly finishedFloorLevel: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    structuralSlabLevel: { type: "number" },
    finishThickness: { type: "number", minimum: 0 },
  },
  required: ["structuralSlabLevel", "finishThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { finishedFloorLevel: { type: "number" } },
  required: ["finishedFloorLevel"],
} as const;
/** Add a nonnegative finish build-up to a structural slab elevation in consistent vertical units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { structuralSlabLevel, finishThickness } = request;
  const compute = (): Output => {
    H.domain(finishThickness >= 0, "finishThickness");
    return { finishedFloorLevel: structuralSlabLevel + finishThickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { structuralSlabLevel: 3.2, finishThickness: 0.08 },
  output: { finishedFloorLevel: 3.2800000000000002 },
} satisfies ToolExample<Input, Output>;
export const slabLevelFinishBuildUpTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/slab-level-finish-build-up",
    title: "Slab Level Finish Build Up Tool",
    description:
      "Add a nonnegative finish build-up to a structural slab elevation in consistent vertical units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        structuralSlabLevel: { type: "number" },
        finishThickness: { type: "number", minimum: 0 },
      },
      required: ["structuralSlabLevel", "finishThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { finishedFloorLevel: { type: "number" } },
      required: ["finishedFloorLevel"],
    },
    ports: {
      inputs: [
        {
          id: "structuralSlabLevel",
          label: "Structural Slab Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finishThickness",
          label: "Finish Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finishedFloorLevel",
          label: "Finished Floor Level",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = slabLevelFinishBuildUpTool.execute;
export default slabLevelFinishBuildUpTool;
