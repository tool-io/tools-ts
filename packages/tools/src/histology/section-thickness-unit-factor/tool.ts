import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredThickness: number;
  readonly sourceUnitInMicrometers: number;
  readonly targetUnitInMicrometers: number;
};
export type Output = { readonly convertedThickness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredThickness: { type: "number", minimum: 0 },
    sourceUnitInMicrometers: { type: "number", exclusiveMinimum: 0 },
    targetUnitInMicrometers: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measuredThickness",
    "sourceUnitInMicrometers",
    "targetUnitInMicrometers",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedThickness: { type: "number" } },
  required: ["convertedThickness"],
} as const;
/** Convert explicit measured section thickness between supplied length units; no slice-spacing substitution or nominal protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredThickness,
    sourceUnitInMicrometers,
    targetUnitInMicrometers,
  } = request;
  const compute = (): Output => {
    H.domain(measuredThickness >= 0);
    H.positive(sourceUnitInMicrometers);
    H.positive(targetUnitInMicrometers);
    return {
      convertedThickness:
        (measuredThickness * sourceUnitInMicrometers) / targetUnitInMicrometers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredThickness: 0.005,
    sourceUnitInMicrometers: 1000,
    targetUnitInMicrometers: 1,
  },
  output: { convertedThickness: 5 },
} satisfies ToolExample<Input, Output>;
export const sectionThicknessUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/section-thickness-unit-factor",
    title: "Section Thickness Unit Factor Tool",
    description:
      "Convert explicit measured section thickness between supplied length units; no slice-spacing substitution or nominal protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredThickness: { type: "number", minimum: 0 },
        sourceUnitInMicrometers: { type: "number", exclusiveMinimum: 0 },
        targetUnitInMicrometers: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "measuredThickness",
        "sourceUnitInMicrometers",
        "targetUnitInMicrometers",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedThickness: { type: "number" } },
      required: ["convertedThickness"],
    },
    ports: {
      inputs: [
        {
          id: "measuredThickness",
          label: "Measured Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceUnitInMicrometers",
          label: "Source Unit In Micrometers",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetUnitInMicrometers",
          label: "Target Unit In Micrometers",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedThickness",
          label: "Converted Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sectionThicknessUnitFactorTool.execute;
export default sectionThicknessUnitFactorTool;
