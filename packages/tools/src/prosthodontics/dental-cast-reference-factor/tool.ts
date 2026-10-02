import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLength: number;
  readonly referenceLength: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLength: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["measuredLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Calculate dental cast reference factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLength, referenceLength } = request;
  const compute = (): Output => {
    H.positive(measuredLength);
    H.domain(referenceLength >= 0);
    return { factor: referenceLength / measuredLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredLength: 12, referenceLength: 10 },
  output: { factor: 0.8333333333333334 },
} satisfies ToolExample<Input, Output>;
export const dentalCastReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/dental-cast-reference-factor",
    title: "Dental Cast Reference Factor Tool",
    description:
      "Calculate dental cast reference factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLength: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["measuredLength", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLength",
          label: "Measured Length",
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
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dentalCastReferenceFactorTool.execute;
export default dentalCastReferenceFactorTool;
