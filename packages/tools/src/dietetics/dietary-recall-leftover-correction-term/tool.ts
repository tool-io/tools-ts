import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly servedMass: number;
  readonly leftoverMass: number;
};
export type Output = { readonly consumedMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    servedMass: { type: "number", minimum: 0 },
    leftoverMass: { type: "number", minimum: 0 },
  },
  required: ["servedMass", "leftoverMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { consumedMass: { type: "number" } },
  required: ["consumedMass"],
} as const;
/** Subtract explicit leftovers from served food mass, preserving recording discrepancies without estimating intake composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { servedMass, leftoverMass } = request;
  const compute = (): Output => {
    H.domain(servedMass >= 0, "servedMass");
    H.domain(leftoverMass >= 0, "leftoverMass");
    return { consumedMass: servedMass - leftoverMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { servedMass: 250, leftoverMass: 40 },
  output: { consumedMass: 210 },
} satisfies ToolExample<Input, Output>;
export const dietaryRecallLeftoverCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dietetics/dietary-recall-leftover-correction-term",
      title: "Dietary Recall Leftover Correction Term Tool",
      description:
        "Subtract explicit leftovers from served food mass, preserving recording discrepancies without estimating intake composition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          servedMass: { type: "number", minimum: 0 },
          leftoverMass: { type: "number", minimum: 0 },
        },
        required: ["servedMass", "leftoverMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { consumedMass: { type: "number" } },
        required: ["consumedMass"],
      },
      ports: {
        inputs: [
          {
            id: "servedMass",
            label: "Served Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "leftoverMass",
            label: "Leftover Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "consumedMass",
            label: "Consumed Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dietaryRecallLeftoverCorrectionTermTool.execute;
export default dietaryRecallLeftoverCorrectionTermTool;
