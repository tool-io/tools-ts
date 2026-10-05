import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly reference: number;
  readonly scale: number;
};
export type Output = { readonly deviation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    reference: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "reference", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { deviation: { type: "number" } },
  required: ["deviation"],
} as const;
/** Scale a signed deviation from an explicit reference by a positive supplied scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, reference, scale } = request;
  const compute = (): Output => {
    (H.domain(scale > 0, "scale"), scale);
    return { deviation: (value - reference) / scale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 14, reference: 10, scale: 2 },
  output: { deviation: 2 },
} satisfies ToolExample<Input, Output>;
export const signedReferenceDeviationScalarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/signed-reference-deviation-scalar",
    title: "Signed Reference Deviation Scalar Tool",
    description:
      "Scale a signed deviation from an explicit reference by a positive supplied scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        reference: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "reference", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { deviation: { type: "number" } },
      required: ["deviation"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
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
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deviation", label: "Deviation", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = signedReferenceDeviationScalarTool.execute;
export default signedReferenceDeviationScalarTool;
