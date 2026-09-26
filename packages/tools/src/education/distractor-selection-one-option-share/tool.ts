import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selected: number;
  readonly totalResponses: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selected: { type: "integer", minimum: 0 },
    totalResponses: { type: "integer", minimum: 1 },
  },
  required: ["selected", "totalResponses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate distractor selection one option share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selected, totalResponses } = request;
  const compute = (): Output => {
    H.integer(totalResponses, 1);
    H.integer(selected, 0, totalResponses);
    return { share: selected / totalResponses };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { selected: 6, totalResponses: 30 },
  output: { share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const distractorSelectionOneOptionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/distractor-selection-one-option-share",
    title: "Distractor Selection One Option Share Tool",
    description:
      "Calculate distractor selection one option share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selected: { type: "integer", minimum: 0 },
        totalResponses: { type: "integer", minimum: 1 },
      },
      required: ["selected", "totalResponses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalResponses",
          label: "Total Responses",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = distractorSelectionOneOptionShareTool.execute;
export default distractorSelectionOneOptionShareTool;
