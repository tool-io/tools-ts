import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceId: string;
  readonly suppliedSensitivity: string;
  readonly disclosureSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSensitivity: { type: "string", maxLength: 8192, minLength: 1 },
    disclosureSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["occurrenceId", "suppliedSensitivity", "disclosureSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit occurrence coordinate-disclosure label and source without revealing or transforming coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceId, suppliedSensitivity, disclosureSource } = request;
  const compute = (): Output => {
    H.domain(occurrenceId.length > 0, "occurrenceId");
    H.domain(suppliedSensitivity.length > 0, "suppliedSensitivity");
    H.domain(disclosureSource.length > 0, "disclosureSource");
    return {
      token: JSON.stringify([
        occurrenceId,
        suppliedSensitivity,
        disclosureSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occurrenceId: "O17",
    suppliedSensitivity: "generalized",
    disclosureSource: "policy P4",
  },
  output: { token: '["O17","generalized","policy P4"]' },
} satisfies ToolExample<Input, Output>;
export const occurrenceCoordinateSensitivityLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biodiversity", "biology"],
        keywords: ["biodiversity", "biology"],
      },
      id: "biodiversity/occurrence-coordinate-sensitivity-label",
      title: "Occurrence Coordinate Sensitivity Label",
      description:
        "Record an explicit occurrence coordinate-disclosure label and source without revealing or transforming coordinates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedSensitivity: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          disclosureSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["occurrenceId", "suppliedSensitivity", "disclosureSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
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
            id: "suppliedSensitivity",
            label: "Supplied Sensitivity",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "disclosureSource",
            label: "Disclosure Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = occurrenceCoordinateSensitivityLabelTool.execute;
export default occurrenceCoordinateSensitivityLabelTool;
