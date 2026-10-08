import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: number;
  readonly measurement: number;
  readonly convention: string;
};
export type Output = { readonly error: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "number" },
    measurement: { type: "number" },
    convention: {
      type: "string",
      maxLength: 8192,
      enum: ["reference-minus-measurement", "measurement-minus-reference"],
    },
  },
  required: ["reference", "measurement", "convention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { error: { type: "number" } },
  required: ["error"],
} as const;
/** Compute a scalar control error using an explicit subtraction convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, measurement, convention } = request;
  const compute = (): Output => {
    H.domain(
      ["reference-minus-measurement", "measurement-minus-reference"].includes(
        convention,
      ),
      "convention",
    );
    return {
      error:
        convention === "reference-minus-measurement"
          ? reference - measurement
          : measurement - reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reference: 10,
    measurement: 8,
    convention: "reference-minus-measurement",
  },
  output: { error: 2 },
} satisfies ToolExample<Input, Output>;
export const errorReferenceMeasurementSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/error-reference-measurement-sign",
    title: "Error Reference Measurement Sign",
    description:
      "Compute a scalar control error using an explicit subtraction convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "number" },
        measurement: { type: "number" },
        convention: {
          type: "string",
          maxLength: 8192,
          enum: ["reference-minus-measurement", "measurement-minus-reference"],
        },
      },
      required: ["reference", "measurement", "convention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { error: { type: "number" } },
      required: ["error"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurement",
          label: "Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convention",
          label: "Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "error", label: "Error", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = errorReferenceMeasurementSignTool.execute;
export default errorReferenceMeasurementSignTool;
