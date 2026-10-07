import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldValue: number;
  readonly candidateValue: number;
  readonly relaxationFactor: number;
};
export type Output = { readonly updatedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldValue: { type: "number" },
    candidateValue: { type: "number" },
    relaxationFactor: { type: "number", minimum: 0 },
  },
  required: ["oldValue", "candidateValue", "relaxationFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updatedValue: { type: "number" } },
  required: ["updatedValue"],
} as const;
/** Apply an explicit nonnegative scalar relaxation factor to a candidate update, including zero and over-relaxation, without asserting solver convergence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldValue, candidateValue, relaxationFactor } = request;
  const compute = (): Output => {
    H.domain(relaxationFactor >= 0, "relaxationFactor");
    return {
      updatedValue: oldValue + relaxationFactor * (candidateValue - oldValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldValue: 2, candidateValue: 6, relaxationFactor: 0.5 },
  output: { updatedValue: 4 },
} satisfies ToolExample<Input, Output>;
export const relaxationUpdateGridCellTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/relaxation-update-grid-cell",
    title: "Relaxation Update Grid Cell",
    description:
      "Apply an explicit nonnegative scalar relaxation factor to a candidate update, including zero and over-relaxation, without asserting solver convergence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldValue: { type: "number" },
        candidateValue: { type: "number" },
        relaxationFactor: { type: "number", minimum: 0 },
      },
      required: ["oldValue", "candidateValue", "relaxationFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { updatedValue: { type: "number" } },
      required: ["updatedValue"],
    },
    ports: {
      inputs: [
        {
          id: "oldValue",
          label: "Old Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "candidateValue",
          label: "Candidate Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "relaxationFactor",
          label: "Relaxation Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "updatedValue",
          label: "Updated Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = relaxationUpdateGridCellTool.execute;
export default relaxationUpdateGridCellTool;
