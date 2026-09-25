import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliest: number;
  readonly latest: number;
  readonly reference: number;
};
export type Output = {
  readonly width: number;
  readonly midpoint: number;
  readonly containsReference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliest: { type: "number" },
    latest: { type: "number" },
    reference: { type: "number" },
  },
  required: ["earliest", "latest", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    midpoint: { type: "number" },
    containsReference: { type: "boolean" },
  },
  required: ["width", "midpoint", "containsReference"],
} as const;
/** Calculate developmental stage uncertainty bracket from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliest, latest, reference } = request;
  const compute = (): Output => {
    H.domain(latest >= earliest);
    return {
      width: latest - earliest,
      midpoint: (earliest + latest) / 2,
      containsReference: reference >= earliest && reference <= latest,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliest: 10, latest: 16, reference: 12 },
  output: { width: 6, midpoint: 13, containsReference: true },
} satisfies ToolExample<Input, Output>;
export const developmentalStageUncertaintyBracketTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/developmental-stage-uncertainty-bracket",
      title: "Developmental Stage Uncertainty Bracket Tool",
      description:
        "Calculate developmental stage uncertainty bracket from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          earliest: { type: "number" },
          latest: { type: "number" },
          reference: { type: "number" },
        },
        required: ["earliest", "latest", "reference"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          width: { type: "number" },
          midpoint: { type: "number" },
          containsReference: { type: "boolean" },
        },
        required: ["width", "midpoint", "containsReference"],
      },
      ports: {
        inputs: [
          {
            id: "earliest",
            label: "Earliest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "latest",
            label: "Latest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reference",
            label: "Reference",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "width", label: "Width", valueType: { type: "number" } },
          { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
          {
            id: "containsReference",
            label: "Contains Reference",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalStageUncertaintyBracketTool.execute;
export default developmentalStageUncertaintyBracketTool;
