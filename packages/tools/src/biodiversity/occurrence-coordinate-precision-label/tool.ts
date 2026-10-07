import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceId: string;
  readonly uncertaintyMeters: number;
  readonly publicDecimalPlaces: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
    uncertaintyMeters: { type: "number", minimum: 0 },
    publicDecimalPlaces: { type: "integer", minimum: 0, maximum: 15 },
  },
  required: ["occurrenceId", "uncertaintyMeters", "publicDecimalPlaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly supplied occurrence uncertainty and public coordinate precision without treating decimal places as measured accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceId, uncertaintyMeters, publicDecimalPlaces } = request;
  const compute = (): Output => {
    H.domain(occurrenceId.length > 0 && uncertaintyMeters >= 0, "occurrenceId");
    (H.domain(
      Number.isSafeInteger(publicDecimalPlaces) &&
        publicDecimalPlaces >= 0 &&
        publicDecimalPlaces <= 15,
      "publicDecimalPlaces",
    ),
      publicDecimalPlaces);
    return {
      label:
        occurrenceId +
        "; uncertainty=" +
        uncertaintyMeters +
        " m; public decimal places=" +
        publicDecimalPlaces,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occurrenceId: "O17",
    uncertaintyMeters: 100,
    publicDecimalPlaces: 3,
  },
  output: { label: "O17; uncertainty=100 m; public decimal places=3" },
} satisfies ToolExample<Input, Output>;
export const occurrenceCoordinatePrecisionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/occurrence-coordinate-precision-label",
    title: "Occurrence Coordinate Precision Label",
    description:
      "Label explicitly supplied occurrence uncertainty and public coordinate precision without treating decimal places as measured accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
        uncertaintyMeters: { type: "number", minimum: 0 },
        publicDecimalPlaces: { type: "integer", minimum: 0, maximum: 15 },
      },
      required: ["occurrenceId", "uncertaintyMeters", "publicDecimalPlaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "occurrenceId",
          label: "Occurrence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "uncertaintyMeters",
          label: "Uncertainty Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "publicDecimalPlaces",
          label: "Public Decimal Places",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = occurrenceCoordinatePrecisionLabelTool.execute;
export default occurrenceCoordinatePrecisionLabelTool;
