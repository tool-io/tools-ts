import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bodyPixels: number;
  readonly referencePixels: number;
  readonly referenceLength: number;
};
export type Output = { readonly bodyLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyPixels: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["bodyPixels", "referencePixels", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bodyLength: { type: "number" } },
  required: ["bodyLength"],
} as const;
/** Scale an explicit arthropod image body length by a supplied compatible same-plane reference without recognizing landmarks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bodyPixels, referencePixels, referenceLength } = request;
  const compute = (): Output => {
    H.domain(bodyPixels >= 0, "bodyPixels");
    (H.domain(
      Number.isFinite(referencePixels) && referencePixels > 0,
      "referencePixels",
    ),
      referencePixels);
    H.domain(referenceLength >= 0, "referenceLength");
    return { bodyLength: (bodyPixels / referencePixels) * referenceLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bodyPixels: 120, referencePixels: 60, referenceLength: 5 },
  output: { bodyLength: 10 },
} satisfies ToolExample<Input, Output>;
export const arthropodBodyLengthCalibrationPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/arthropod-body-length-calibration-pair",
    title: "Arthropod Body Length Calibration Pair Tool",
    description:
      "Scale an explicit arthropod image body length by a supplied compatible same-plane reference without recognizing landmarks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyPixels: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["bodyPixels", "referencePixels", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bodyLength: { type: "number" } },
      required: ["bodyLength"],
    },
    ports: {
      inputs: [
        {
          id: "bodyPixels",
          label: "Body Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePixels",
          label: "Reference Pixels",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bodyLength",
          label: "Body Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = arthropodBodyLengthCalibrationPairTool.execute;
export default arthropodBodyLengthCalibrationPairTool;
