import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
};
export type Output = { readonly slope: number; readonly angleRadians: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
  },
  required: ["firstX", "firstY", "secondX", "secondY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slope: { type: "number" }, angleRadians: { type: "number" } },
  required: ["slope", "angleRadians"],
} as const;
/** Two-point baseline slope with radians measured in the supplied image-axis orientation, without handwriting attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY } = request;
  const compute = (): Output => {
    H.domain(secondX !== firstX);
    return {
      slope: (secondY - firstY) / (secondX - firstX),
      angleRadians: Math.atan2(secondY - firstY, secondX - firstX),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 0, firstY: 1, secondX: 10, secondY: 3 },
  output: { slope: 0.2, angleRadians: 0.19739555984988078 },
} satisfies ToolExample<Input, Output>;
export const questionedDocumentBaselineSlopeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "forensic-science/questioned-document-baseline-slope-term",
      title: "Questioned Document Baseline Slope Term Tool",
      description:
        "Two-point baseline slope with radians measured in the supplied image-axis orientation, without handwriting attribution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstX: { type: "number" },
          firstY: { type: "number" },
          secondX: { type: "number" },
          secondY: { type: "number" },
        },
        required: ["firstX", "firstY", "secondX", "secondY"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          slope: { type: "number" },
          angleRadians: { type: "number" },
        },
        required: ["slope", "angleRadians"],
      },
      ports: {
        inputs: [
          {
            id: "firstX",
            label: "First X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstY",
            label: "First Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondX",
            label: "Second X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondY",
            label: "Second Y",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "slope", label: "Slope", valueType: { type: "number" } },
          {
            id: "angleRadians",
            label: "Angle Radians",
            valueType: { type: "number", unit: "rad" },
          },
        ],
      },
    },
    calculate,
  });
export const run = questionedDocumentBaselineSlopeTermTool.execute;
export default questionedDocumentBaselineSlopeTermTool;
