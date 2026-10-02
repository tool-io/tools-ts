import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly joint: number; readonly conditioning: number };
export type Output = { readonly odds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    joint: { type: "number", minimum: 0, maximum: 1 },
    conditioning: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["joint", "conditioning"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { odds: { type: "number" } },
  required: ["odds"],
} as const;
/** Calculate conditional odds joint cell crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { joint, conditioning } = request;
  const compute = (): Output => {
    H.probability(joint);
    H.probability(conditioning);
    H.domain(conditioning > joint);
    return { odds: joint / (conditioning - joint) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { joint: 0.2, conditioning: 0.5 },
  output: { odds: 0.6666666666666667 },
} satisfies ToolExample<Input, Output>;
export const conditionalOddsJointCellCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/conditional-odds-joint-cell-crosswalk",
    title: "Conditional Odds Joint Cell Crosswalk Tool",
    description:
      "Calculate conditional odds joint cell crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        joint: { type: "number", minimum: 0, maximum: 1 },
        conditioning: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["joint", "conditioning"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { odds: { type: "number" } },
      required: ["odds"],
    },
    ports: {
      inputs: [
        {
          id: "joint",
          label: "Joint",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conditioning",
          label: "Conditioning",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "odds", label: "Odds", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = conditionalOddsJointCellCrosswalkTool.execute;
export default conditionalOddsJointCellCrosswalkTool;
