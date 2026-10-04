import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCenter: number;
  readonly matCenter: number;
  readonly suppliedOpticalOffset: number;
};
export type Output = {
  readonly geometricOffset: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCenter: { type: "number" },
    matCenter: { type: "number" },
    suppliedOpticalOffset: { type: "number" },
  },
  required: ["openingCenter", "matCenter", "suppliedOpticalOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geometricOffset: { type: "number" },
    residual: { type: "number" },
  },
  required: ["geometricOffset", "residual"],
} as const;
/** Compare supplied centers with an explicit optical adjustment; no aesthetic optimum is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCenter, matCenter, suppliedOpticalOffset } = request;
  const compute = (): Output => {
    return {
      geometricOffset: openingCenter - matCenter,
      residual: openingCenter - matCenter - suppliedOpticalOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCenter: 52, matCenter: 50, suppliedOpticalOffset: 1 },
  output: { geometricOffset: 2, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const printMatAsymmetricOpticalOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/print-mat-asymmetric-optical-offset",
    title: "Print Mat Asymmetric Optical Offset Tool",
    description:
      "Compare supplied centers with an explicit optical adjustment; no aesthetic optimum is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCenter: { type: "number" },
        matCenter: { type: "number" },
        suppliedOpticalOffset: { type: "number" },
      },
      required: ["openingCenter", "matCenter", "suppliedOpticalOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        geometricOffset: { type: "number" },
        residual: { type: "number" },
      },
      required: ["geometricOffset", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "openingCenter",
          label: "Opening Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "matCenter",
          label: "Mat Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOpticalOffset",
          label: "Supplied Optical Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "geometricOffset",
          label: "Geometric Offset",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = printMatAsymmetricOpticalOffsetTool.execute;
export default printMatAsymmetricOpticalOffsetTool;
