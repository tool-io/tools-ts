import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly structuralSpan: number;
  readonly firstFinishBuildUp: number;
  readonly secondFinishBuildUp: number;
};
export type Output = { readonly clearSpan: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    structuralSpan: { type: "number", minimum: 0 },
    firstFinishBuildUp: { type: "number", minimum: 0 },
    secondFinishBuildUp: { type: "number", minimum: 0 },
  },
  required: ["structuralSpan", "firstFinishBuildUp", "secondFinishBuildUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearSpan: { type: "number" } },
  required: ["clearSpan"],
} as const;
/** Subtract explicit opposing finish build-ups from a structural span, preserving over-occupation as a negative clear span. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { structuralSpan, firstFinishBuildUp, secondFinishBuildUp } = request;
  const compute = (): Output => {
    H.domain(
      structuralSpan >= 0 &&
        firstFinishBuildUp >= 0 &&
        secondFinishBuildUp >= 0,
      "structuralSpan",
    );
    return {
      clearSpan: structuralSpan - firstFinishBuildUp - secondFinishBuildUp,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    structuralSpan: 4000,
    firstFinishBuildUp: 25,
    secondFinishBuildUp: 15,
  },
  output: { clearSpan: 3960 },
} satisfies ToolExample<Input, Output>;
export const roomDimensionClearStructuralCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["architecture", "arts and design"],
        keywords: ["architecture", "arts and design"],
      },
      id: "architecture/room-dimension-clear-structural-crosswalk",
      title: "Room Dimension Clear Structural Crosswalk",
      description:
        "Subtract explicit opposing finish build-ups from a structural span, preserving over-occupation as a negative clear span.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          structuralSpan: { type: "number", minimum: 0 },
          firstFinishBuildUp: { type: "number", minimum: 0 },
          secondFinishBuildUp: { type: "number", minimum: 0 },
        },
        required: [
          "structuralSpan",
          "firstFinishBuildUp",
          "secondFinishBuildUp",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { clearSpan: { type: "number" } },
        required: ["clearSpan"],
      },
      ports: {
        inputs: [
          {
            id: "structuralSpan",
            label: "Structural Span",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstFinishBuildUp",
            label: "First Finish Build Up",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondFinishBuildUp",
            label: "Second Finish Build Up",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "clearSpan",
            label: "Clear Span",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = roomDimensionClearStructuralCrosswalkTool.execute;
export default roomDimensionClearStructuralCrosswalkTool;
