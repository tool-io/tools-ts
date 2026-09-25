import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleDegrees: number;
  readonly referenceIsVertical: boolean;
};
export type Output = { readonly angleFromHorizontal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number", minimum: 0, maximum: 90 },
    referenceIsVertical: { type: "boolean" },
  },
  required: ["angleDegrees", "referenceIsVertical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleFromHorizontal: { type: "number" } },
  required: ["angleFromHorizontal"],
} as const;
/** Complement an acute bed-dip angle measured from vertical; orientation and geological interpretation remain caller supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleDegrees, referenceIsVertical } = request;
  const compute = (): Output => {
    H.domain(angleDegrees >= 0 && angleDegrees <= 90);
    return {
      angleFromHorizontal: referenceIsVertical
        ? 90 - angleDegrees
        : angleDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleDegrees: 30, referenceIsVertical: true },
  output: { angleFromHorizontal: 60 },
} satisfies ToolExample<Input, Output>;
export const beddipReferencePlaneFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/beddip-reference-plane-flag",
    title: "Beddip Reference Plane Flag Tool",
    description:
      "Complement an acute bed-dip angle measured from vertical; orientation and geological interpretation remain caller supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number", minimum: 0, maximum: 90 },
        referenceIsVertical: { type: "boolean" },
      },
      required: ["angleDegrees", "referenceIsVertical"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angleFromHorizontal: { type: "number" } },
      required: ["angleFromHorizontal"],
    },
    ports: {
      inputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceIsVertical",
          label: "Reference Is Vertical",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "angleFromHorizontal",
          label: "Angle From Horizontal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = beddipReferencePlaneFlagTool.execute;
export default beddipReferencePlaneFlagTool;
