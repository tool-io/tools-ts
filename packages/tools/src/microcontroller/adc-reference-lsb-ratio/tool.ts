import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstReference: number;
  readonly secondReference: number;
  readonly firstBits: number;
  readonly secondBits: number;
};
export type Output = { readonly lsbRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReference: { type: "number", exclusiveMinimum: 0 },
    secondReference: { type: "number", exclusiveMinimum: 0 },
    firstBits: { type: "integer", minimum: 1, maximum: 52 },
    secondBits: { type: "integer", minimum: 1, maximum: 52 },
  },
  required: ["firstReference", "secondReference", "firstBits", "secondBits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lsbRatio: { type: "number" } },
  required: ["lsbRatio"],
} as const;
/** Compare ideal ADC quantization widths using reference/2^bits for each converter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstReference, secondReference, firstBits, secondBits } = request;
  const compute = (): Output => {
    H.positive(firstReference);
    H.positive(secondReference);
    H.integer(firstBits, 1, 52);
    H.integer(secondBits, 1, 52);
    return {
      lsbRatio:
        (firstReference / secondReference) * 2 ** (secondBits - firstBits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstReference: 3.3,
    secondReference: 3.3,
    firstBits: 10,
    secondBits: 12,
  },
  output: { lsbRatio: 4 },
} satisfies ToolExample<Input, Output>;
export const adcReferenceLsbRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/adc-reference-lsb-ratio",
    title: "ADC Reference Lsb Ratio Tool",
    description:
      "Compare ideal ADC quantization widths using reference/2^bits for each converter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstReference: { type: "number", exclusiveMinimum: 0 },
        secondReference: { type: "number", exclusiveMinimum: 0 },
        firstBits: { type: "integer", minimum: 1, maximum: 52 },
        secondBits: { type: "integer", minimum: 1, maximum: 52 },
      },
      required: [
        "firstReference",
        "secondReference",
        "firstBits",
        "secondBits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lsbRatio: { type: "number" } },
      required: ["lsbRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstReference",
          label: "First Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReference",
          label: "Second Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBits",
          label: "First Bits",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondBits",
          label: "Second Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lsbRatio", label: "Lsb Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = adcReferenceLsbRatioTool.execute;
export default adcReferenceLsbRatioTool;
