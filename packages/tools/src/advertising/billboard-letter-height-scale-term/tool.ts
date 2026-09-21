import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly designHeight: number;
  readonly scaleFactor: number;
  readonly panelHeight: number;
};
export type Output = {
  readonly physicalHeight: number;
  readonly panelShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designHeight: { type: "number", minimum: 0 },
    scaleFactor: { type: "number", exclusiveMinimum: 0 },
    panelHeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["designHeight", "scaleFactor", "panelHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalHeight: { type: "number" },
    panelShare: { type: "number" },
  },
  required: ["physicalHeight", "panelShare"],
} as const;
/** Geometric letter scaling, without a viewing-distance legibility claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { designHeight, scaleFactor, panelHeight } = request;
  const compute = (): Output => {
    H.domain(designHeight >= 0);
    H.positive(scaleFactor);
    H.positive(panelHeight);
    return {
      physicalHeight: designHeight * scaleFactor,
      panelShare: (designHeight * scaleFactor) / panelHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { designHeight: 2, scaleFactor: 10, panelHeight: 100 },
  output: { physicalHeight: 20, panelShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const billboardLetterHeightScaleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/billboard-letter-height-scale-term",
    title: "Billboard Letter Height Scale Term Tool",
    description:
      "Geometric letter scaling, without a viewing-distance legibility claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        designHeight: { type: "number", minimum: 0 },
        scaleFactor: { type: "number", exclusiveMinimum: 0 },
        panelHeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["designHeight", "scaleFactor", "panelHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalHeight: { type: "number" },
        panelShare: { type: "number" },
      },
      required: ["physicalHeight", "panelShare"],
    },
    ports: {
      inputs: [
        {
          id: "designHeight",
          label: "Design Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleFactor",
          label: "Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panelHeight",
          label: "Panel Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalHeight",
          label: "Physical Height",
          valueType: { type: "number" },
        },
        {
          id: "panelShare",
          label: "Panel Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = billboardLetterHeightScaleTermTool.execute;
export default billboardLetterHeightScaleTermTool;
