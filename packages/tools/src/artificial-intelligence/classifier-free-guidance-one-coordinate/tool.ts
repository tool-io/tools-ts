import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unconditional: number;
  readonly conditional: number;
  readonly scale: number;
};
export type Output = {
  readonly guided: number;
  readonly conditionalIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unconditional: { type: "number" },
    conditional: { type: "number" },
    scale: { type: "number" },
  },
  required: ["unconditional", "conditional", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    guided: { type: "number" },
    conditionalIncrement: { type: "number" },
  },
  required: ["guided", "conditionalIncrement"],
} as const;
/** Use unconditional + scale*(conditional-unconditional); scale 1 reproduces the conditional prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unconditional, conditional, scale } = request;
  const compute = (): Output => {
    return {
      guided: unconditional + scale * (conditional - unconditional),
      conditionalIncrement: scale * (conditional - unconditional),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unconditional: 2, conditional: 5, scale: 3 },
  output: { guided: 11, conditionalIncrement: 9 },
} satisfies ToolExample<Input, Output>;
export const classifierFreeGuidanceOneCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "artificial-intelligence/classifier-free-guidance-one-coordinate",
      title: "Classifier Free Guidance One Coordinate Tool",
      description:
        "Use unconditional + scale*(conditional-unconditional); scale 1 reproduces the conditional prediction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unconditional: { type: "number" },
          conditional: { type: "number" },
          scale: { type: "number" },
        },
        required: ["unconditional", "conditional", "scale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          guided: { type: "number" },
          conditionalIncrement: { type: "number" },
        },
        required: ["guided", "conditionalIncrement"],
      },
      ports: {
        inputs: [
          {
            id: "unconditional",
            label: "Unconditional",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conditional",
            label: "Conditional",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "scale",
            label: "Scale",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "guided", label: "Guided", valueType: { type: "number" } },
          {
            id: "conditionalIncrement",
            label: "Conditional Increment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = classifierFreeGuidanceOneCoordinateTool.execute;
export default classifierFreeGuidanceOneCoordinateTool;
