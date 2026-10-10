import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blankDiameter: number;
  readonly requiredDiameter: number;
};
export type Output = {
  readonly diametralMargin: number;
  readonly radialMargin: number;
  readonly fitsUnderInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankDiameter: { type: "number", minimum: 0 },
    requiredDiameter: { type: "number", minimum: 0 },
  },
  required: ["blankDiameter", "requiredDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diametralMargin: { type: "number" },
    radialMargin: { type: "number" },
    fitsUnderInputs: { type: "boolean" },
  },
  required: ["diametralMargin", "radialMargin", "fitsUnderInputs"],
} as const;
/** Compare explicit lens-blank and required diameters without determining frame tracing, optical centering, or dispensing suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blankDiameter, requiredDiameter } = request;
  const compute = (): Output => {
    H.domain(blankDiameter >= 0 && requiredDiameter >= 0, "blankDiameter");
    return {
      diametralMargin: blankDiameter - requiredDiameter,
      radialMargin: (blankDiameter - requiredDiameter) / 2,
      fitsUnderInputs: blankDiameter >= requiredDiameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blankDiameter: 70, requiredDiameter: 64 },
  output: { diametralMargin: 6, radialMargin: 3, fitsUnderInputs: true },
} satisfies ToolExample<Input, Output>;
export const lensBlankEdgeClearanceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["optometry", "health and medicine"],
      keywords: ["optometry", "health and medicine"],
    },
    id: "optometry/lens-blank-edge-clearance-margin",
    title: "Lens Blank Edge Clearance Margin",
    description:
      "Compare explicit lens-blank and required diameters without determining frame tracing, optical centering, or dispensing suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blankDiameter: { type: "number", minimum: 0 },
        requiredDiameter: { type: "number", minimum: 0 },
      },
      required: ["blankDiameter", "requiredDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diametralMargin: { type: "number" },
        radialMargin: { type: "number" },
        fitsUnderInputs: { type: "boolean" },
      },
      required: ["diametralMargin", "radialMargin", "fitsUnderInputs"],
    },
    ports: {
      inputs: [
        {
          id: "blankDiameter",
          label: "Blank Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredDiameter",
          label: "Required Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "diametralMargin",
          label: "Diametral Margin",
          valueType: { type: "number" },
        },
        {
          id: "radialMargin",
          label: "Radial Margin",
          valueType: { type: "number" },
        },
        {
          id: "fitsUnderInputs",
          label: "Fits Under Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensBlankEdgeClearanceMarginTool.execute;
export default lensBlankEdgeClearanceMarginTool;
