import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedLength: number;
  readonly referenceLength: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["recordedLength", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied research caliper coordinates without determining instrument working length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedLength, referenceLength } = request;
  const compute = (): Output => {
    H.domain(recordedLength >= 0 && referenceLength >= 0);
    return { gap: recordedLength - referenceLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedLength: 12, referenceLength: 10 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const canalCaliperReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/canal-caliper-reference-gap",
    title: "Canal Caliper Reference Gap Tool",
    description:
      "Compare supplied research caliper coordinates without determining instrument working length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
      },
      required: ["recordedLength", "referenceLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "recordedLength",
          label: "Recorded Length",
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
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = canalCaliperReferenceGapTool.execute;
export default canalCaliperReferenceGapTool;
