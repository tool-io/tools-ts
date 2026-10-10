import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly dilutionExponent: number;
  readonly radix: number;
};
export type Output = {
  readonly label: string;
  readonly dilutionFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    dilutionExponent: { type: "integer", minimum: 0 },
    radix: { type: "integer", minimum: 2 },
  },
  required: ["sampleId", "dilutionExponent", "radix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    dilutionFraction: { type: "number" },
  },
  required: ["label", "dilutionFraction"],
} as const;
/** Label an explicitly supplied serial-dilution radix and exponent without assuming a laboratory transfer procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, dilutionExponent, radix } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    (H.domain(
      Number.isSafeInteger(dilutionExponent) &&
        dilutionExponent >= 0 &&
        dilutionExponent <= Number.MAX_SAFE_INTEGER,
      "dilutionExponent",
    ),
      dilutionExponent);
    (H.domain(
      Number.isSafeInteger(radix) &&
        radix >= 2 &&
        radix <= Number.MAX_SAFE_INTEGER,
      "radix",
    ),
      radix);
    const dilutionFraction = radix ** -dilutionExponent;
    H.domain(
      dilutionFraction > 0,
      "dilutionExponent",
      "The dilution fraction is below the representable numeric range.",
    );
    return {
      label: sampleId + "; dilution=" + radix + "^(-" + dilutionExponent + ")",
      dilutionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", dilutionExponent: 3, radix: 10 },
  output: { label: "S17; dilution=10^(-3)", dilutionFraction: 0.001 },
} satisfies ToolExample<Input, Output>;
export const microbiologyDilutionLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/microbiology-dilution-label-token",
    title: "Microbiology Dilution Label Token",
    description:
      "Label an explicitly supplied serial-dilution radix and exponent without assuming a laboratory transfer procedure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        dilutionExponent: { type: "integer", minimum: 0 },
        radix: { type: "integer", minimum: 2 },
      },
      required: ["sampleId", "dilutionExponent", "radix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        dilutionFraction: { type: "number" },
      },
      required: ["label", "dilutionFraction"],
    },
    ports: {
      inputs: [
        {
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dilutionExponent",
          label: "Dilution Exponent",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "radix",
          label: "Radix",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "dilutionFraction",
          label: "Dilution Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = microbiologyDilutionLabelTokenTool.execute;
export default microbiologyDilutionLabelTokenTool;
