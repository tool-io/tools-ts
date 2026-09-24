import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scores: readonly number[];
  readonly targetMass: number;
};
export type Output = { readonly mass: number; readonly deficit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    targetMass: { type: "number", minimum: 0 },
  },
  required: ["scores", "targetMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mass: { type: "number" }, deficit: { type: "number" } },
  required: ["mass", "deficit"],
} as const;
/** Compare supplied nonnegative class masses with an explicit target without normalizing or asserting calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scores, targetMass } = request;
  const compute = (): Output => {
    H.domain(targetMass >= 0 && scores.every((x) => x >= 0));
    return {
      mass: scores.reduce((a, b) => a + b, 0),
      deficit: targetMass - scores.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scores: [0.2, 0.3], targetMass: 1 },
  output: { mass: 0.5, deficit: 0.5 },
} satisfies ToolExample<Input, Output>;
export const multiclassScoreMassDeficitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/multiclass-score-mass-deficit",
    title: "Multiclass Score Mass Deficit Tool",
    description:
      "Compare supplied nonnegative class masses with an explicit target without normalizing or asserting calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scores: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        targetMass: { type: "number", minimum: 0 },
      },
      required: ["scores", "targetMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mass: { type: "number" }, deficit: { type: "number" } },
      required: ["mass", "deficit"],
    },
    ports: {
      inputs: [
        {
          id: "scores",
          label: "Scores",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "targetMass",
          label: "Target Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "mass", label: "Mass", valueType: { type: "number" } },
        { id: "deficit", label: "Deficit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = multiclassScoreMassDeficitTool.execute;
export default multiclassScoreMassDeficitTool;
