import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly reference: number;
  readonly reverseAxis: boolean;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    reference: { type: "number" },
    reverseAxis: { type: "boolean" },
  },
  required: ["observed", "reference", "reverseAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Translate a supplied pressure-reference difference under an explicit axis sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, reference, reverseAxis } = request;
  const compute = (): Output => {
    return { signedGap: (observed - reference) * (reverseAxis ? -1 : 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: -100, reference: 0, reverseAxis: false },
  output: { signedGap: -100 },
} satisfies ToolExample<Input, Output>;
export const tympanometryReferencePressureSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/tympanometry-reference-pressure-sign",
    title: "Tympanometry Reference Pressure Sign Tool",
    description:
      "Translate a supplied pressure-reference difference under an explicit axis sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        reference: { type: "number" },
        reverseAxis: { type: "boolean" },
      },
      required: ["observed", "reference", "reverseAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tympanometryReferencePressureSignTool.execute;
export default tympanometryReferencePressureSignTool;
