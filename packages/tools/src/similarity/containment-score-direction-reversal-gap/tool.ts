import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intersection: number;
  readonly firstSize: number;
  readonly secondSize: number;
};
export type Output = {
  readonly firstContainment: number;
  readonly secondContainment: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    firstSize: { type: "integer", minimum: 1 },
    secondSize: { type: "integer", minimum: 1 },
  },
  required: ["intersection", "firstSize", "secondSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstContainment: { type: "number" },
    secondContainment: { type: "number" },
    gap: { type: "number" },
  },
  required: ["firstContainment", "secondContainment", "gap"],
} as const;
/** Calculate containment score direction reversal gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, firstSize, secondSize } = request;
  const compute = (): Output => {
    H.integer(firstSize, 1);
    H.integer(secondSize, 1);
    H.integer(intersection, 0, Math.min(firstSize, secondSize));
    const firstContainment = intersection / firstSize,
      secondContainment = intersection / secondSize;
    return {
      firstContainment,
      secondContainment,
      gap: firstContainment - secondContainment,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 3, firstSize: 3, secondSize: 6 },
  output: { firstContainment: 1, secondContainment: 0.5, gap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const containmentScoreDirectionReversalGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/containment-score-direction-reversal-gap",
      title: "Containment Score Direction Reversal Gap Tool",
      description:
        "Calculate containment score direction reversal gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intersection: { type: "integer", minimum: 0 },
          firstSize: { type: "integer", minimum: 1 },
          secondSize: { type: "integer", minimum: 1 },
        },
        required: ["intersection", "firstSize", "secondSize"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstContainment: { type: "number" },
          secondContainment: { type: "number" },
          gap: { type: "number" },
        },
        required: ["firstContainment", "secondContainment", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "intersection",
            label: "Intersection",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstSize",
            label: "First Size",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "secondSize",
            label: "Second Size",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "firstContainment",
            label: "First Containment",
            valueType: { type: "number" },
          },
          {
            id: "secondContainment",
            label: "Second Containment",
            valueType: { type: "number" },
          },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = containmentScoreDirectionReversalGapTool.execute;
export default containmentScoreDirectionReversalGapTool;
