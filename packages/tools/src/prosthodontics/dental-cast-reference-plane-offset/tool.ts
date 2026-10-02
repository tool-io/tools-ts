import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pointNormalCoordinate: number;
  readonly planeNormalCoordinate: number;
  readonly reverseNormal: boolean;
};
export type Output = { readonly signedOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointNormalCoordinate: { type: "number" },
    planeNormalCoordinate: { type: "number" },
    reverseNormal: { type: "boolean" },
  },
  required: ["pointNormalCoordinate", "planeNormalCoordinate", "reverseNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedOffset: { type: "number" } },
  required: ["signedOffset"],
} as const;
/** One-axis signed cast-model distance to an explicit reference plane. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pointNormalCoordinate, planeNormalCoordinate, reverseNormal } =
    request;
  const compute = (): Output => {
    return {
      signedOffset:
        (pointNormalCoordinate - planeNormalCoordinate) *
        (reverseNormal ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pointNormalCoordinate: 8,
    planeNormalCoordinate: 3,
    reverseNormal: true,
  },
  output: { signedOffset: -5 },
} satisfies ToolExample<Input, Output>;
export const dentalCastReferencePlaneOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/dental-cast-reference-plane-offset",
    title: "Dental Cast Reference Plane Offset Tool",
    description:
      "One-axis signed cast-model distance to an explicit reference plane.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointNormalCoordinate: { type: "number" },
        planeNormalCoordinate: { type: "number" },
        reverseNormal: { type: "boolean" },
      },
      required: [
        "pointNormalCoordinate",
        "planeNormalCoordinate",
        "reverseNormal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedOffset: { type: "number" } },
      required: ["signedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "pointNormalCoordinate",
          label: "Point Normal Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "planeNormalCoordinate",
          label: "Plane Normal Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseNormal",
          label: "Reverse Normal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentalCastReferencePlaneOffsetTool.execute;
export default dentalCastReferencePlaneOffsetTool;
