import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTop: number;
  readonly firstBottom: number;
  readonly secondTop: number;
  readonly secondBottom: number;
};
export type Output = {
  readonly topSeparation: number;
  readonly bottomSeparation: number;
  readonly convergence: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTop: { type: "number" },
    firstBottom: { type: "number" },
    secondTop: { type: "number" },
    secondBottom: { type: "number" },
  },
  required: ["firstTop", "firstBottom", "secondTop", "secondBottom"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topSeparation: { type: "number" },
    bottomSeparation: { type: "number" },
    convergence: { type: "number" },
  },
  required: ["topSeparation", "bottomSeparation", "convergence"],
} as const;
/** Compare horizontal separation of two marked rays at two distinct supplied image rows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTop, firstBottom, secondTop, secondBottom } = request;
  const compute = (): Output => {
    return {
      topSeparation: Math.abs(secondTop - firstTop),
      bottomSeparation: Math.abs(secondBottom - firstBottom),
      convergence:
        Math.abs(secondBottom - firstBottom) - Math.abs(secondTop - firstTop),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTop: 4, firstBottom: 0, secondTop: 6, secondBottom: 10 },
  output: { topSeparation: 2, bottomSeparation: 10, convergence: 8 },
} satisfies ToolExample<Input, Output>;
export const perspectiveExerciseMeasuredConvergenceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-education/perspective-exercise-measured-convergence-gap",
      title: "Perspective Exercise Measured Convergence Gap Tool",
      description:
        "Compare horizontal separation of two marked rays at two distinct supplied image rows.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstTop: { type: "number" },
          firstBottom: { type: "number" },
          secondTop: { type: "number" },
          secondBottom: { type: "number" },
        },
        required: ["firstTop", "firstBottom", "secondTop", "secondBottom"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          topSeparation: { type: "number" },
          bottomSeparation: { type: "number" },
          convergence: { type: "number" },
        },
        required: ["topSeparation", "bottomSeparation", "convergence"],
      },
      ports: {
        inputs: [
          {
            id: "firstTop",
            label: "First Top",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstBottom",
            label: "First Bottom",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondTop",
            label: "Second Top",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondBottom",
            label: "Second Bottom",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "topSeparation",
            label: "Top Separation",
            valueType: { type: "number" },
          },
          {
            id: "bottomSeparation",
            label: "Bottom Separation",
            valueType: { type: "number" },
          },
          {
            id: "convergence",
            label: "Convergence",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = perspectiveExerciseMeasuredConvergenceGapTool.execute;
export default perspectiveExerciseMeasuredConvergenceGapTool;
