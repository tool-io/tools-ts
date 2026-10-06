import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisId: string;
  readonly positiveDirection: string;
  readonly side: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisId: { type: "string", maxLength: 8192, minLength: 1 },
    positiveDirection: {
      type: "string",
      maxLength: 8192,
      enum: ["lateral", "medial"],
    },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
  },
  required: ["axisId", "positiveDirection", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied lateral/medial coordinate convention without deriving anatomical direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisId, positiveDirection, side } = request;
  const compute = (): Output => {
    H.domain(axisId.length > 0, "axisId");
    H.domain(
      ["lateral", "medial"].includes(positiveDirection),
      "positiveDirection",
    );
    H.domain(["left", "right", "unspecified"].includes(side), "side");
    return {
      label: axisId + "; positive=" + positiveDirection + " [" + side + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisId: "AX17", positiveDirection: "lateral", side: "left" },
  output: { label: "AX17; positive=lateral [left]" },
} satisfies ToolExample<Input, Output>;
export const anatomicalLateralMedialAxisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anatomy", "health and medicine"],
      keywords: ["anatomy", "health and medicine"],
    },
    id: "anatomy/anatomical-lateral-medial-axis-label",
    title: "Anatomical Lateral Medial Axis Label",
    description:
      "Label an explicitly supplied lateral/medial coordinate convention without deriving anatomical direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisId: { type: "string", maxLength: 8192, minLength: 1 },
        positiveDirection: {
          type: "string",
          maxLength: 8192,
          enum: ["lateral", "medial"],
        },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
      },
      required: ["axisId", "positiveDirection", "side"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "axisId",
          label: "Axis Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "positiveDirection",
          label: "Positive Direction",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = anatomicalLateralMedialAxisLabelTool.execute;
export default anatomicalLateralMedialAxisLabelTool;
