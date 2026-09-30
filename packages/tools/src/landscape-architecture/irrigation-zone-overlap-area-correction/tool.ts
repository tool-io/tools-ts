import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstArea: number;
  readonly secondArea: number;
  readonly overlap: number;
};
export type Output = {
  readonly unionArea: number;
  readonly doubleCountFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstArea: { type: "number", minimum: 0 },
    secondArea: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["firstArea", "secondArea", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionArea: { type: "number" },
    doubleCountFraction: { type: "number" },
  },
  required: ["unionArea", "doubleCountFraction"],
} as const;
/** Calculate irrigation zone overlap area correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstArea, secondArea, overlap } = request;
  const compute = (): Output => {
    H.domain(
      firstArea >= 0 &&
        secondArea >= 0 &&
        firstArea + secondArea > 0 &&
        overlap >= 0 &&
        overlap <= Math.min(firstArea, secondArea),
    );
    return {
      unionArea: firstArea + secondArea - overlap,
      doubleCountFraction: overlap / (firstArea + secondArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstArea: 60, secondArea: 50, overlap: 10 },
  output: { unionArea: 100, doubleCountFraction: 0.09090909090909091 },
} satisfies ToolExample<Input, Output>;
export const irrigationZoneOverlapAreaCorrectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "landscape-architecture/irrigation-zone-overlap-area-correction",
      title: "Irrigation Zone Overlap Area Correction Tool",
      description:
        "Calculate irrigation zone overlap area correction from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstArea: { type: "number", minimum: 0 },
          secondArea: { type: "number", minimum: 0 },
          overlap: { type: "number", minimum: 0 },
        },
        required: ["firstArea", "secondArea", "overlap"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unionArea: { type: "number" },
          doubleCountFraction: { type: "number" },
        },
        required: ["unionArea", "doubleCountFraction"],
      },
      ports: {
        inputs: [
          {
            id: "firstArea",
            label: "First Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondArea",
            label: "Second Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlap",
            label: "Overlap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unionArea",
            label: "Union Area",
            valueType: { type: "number" },
          },
          {
            id: "doubleCountFraction",
            label: "Double Count Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = irrigationZoneOverlapAreaCorrectionTool.execute;
export default irrigationZoneOverlapAreaCorrectionTool;
