import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceThickness: number;
  readonly measuredThickness: number;
};
export type Output = { readonly fractionalChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceThickness: { type: "number", exclusiveMinimum: 0 },
    measuredThickness: { type: "number", minimum: 0 },
  },
  required: ["referenceThickness", "measuredThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fractionalChange: { type: "number" } },
  required: ["fractionalChange"],
} as const;
/** Calculate signed paper thickness change relative to an explicit positive reference thickness without inferring damage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceThickness, measuredThickness } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(referenceThickness) && referenceThickness > 0,
      "referenceThickness",
    ),
      referenceThickness);
    H.domain(measuredThickness >= 0, "measuredThickness");
    return {
      fractionalChange:
        (measuredThickness - referenceThickness) / referenceThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceThickness: 0.2, measuredThickness: 0.25 },
  output: { fractionalChange: 0.24999999999999994 },
} satisfies ToolExample<Input, Output>;
export const paperRelativeThicknessChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/paper-relative-thickness-change",
    title: "Paper Relative Thickness Change",
    description:
      "Calculate signed paper thickness change relative to an explicit positive reference thickness without inferring damage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceThickness: { type: "number", exclusiveMinimum: 0 },
        measuredThickness: { type: "number", minimum: 0 },
      },
      required: ["referenceThickness", "measuredThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fractionalChange: { type: "number" } },
      required: ["fractionalChange"],
    },
    ports: {
      inputs: [
        {
          id: "referenceThickness",
          label: "Reference Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredThickness",
          label: "Measured Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionalChange",
          label: "Fractional Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paperRelativeThicknessChangeTool.execute;
export default paperRelativeThicknessChangeTool;
