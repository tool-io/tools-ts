import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asReceivedMarkerFraction: number;
  readonly moistureFraction: number;
};
export type Output = { readonly dryBasisMarkerFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asReceivedMarkerFraction: { type: "number", minimum: 0, maximum: 1 },
    moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["asReceivedMarkerFraction", "moistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryBasisMarkerFraction: { type: "number" } },
  required: ["dryBasisMarkerFraction"],
} as const;
/** Convert an explicit as-received marker mass fraction to dry basis under a supplied wet-basis moisture fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asReceivedMarkerFraction, moistureFraction } = request;
  const compute = (): Output => {
    (H.domain(
      asReceivedMarkerFraction >= 0 && asReceivedMarkerFraction <= 1,
      "asReceivedMarkerFraction",
    ),
      asReceivedMarkerFraction);
    H.domain(moistureFraction >= 0 && moistureFraction < 1, "moistureFraction");
    H.domain(
      asReceivedMarkerFraction <= 1 - moistureFraction,
      "asReceivedMarkerFraction",
    );
    return {
      dryBasisMarkerFraction: asReceivedMarkerFraction / (1 - moistureFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asReceivedMarkerFraction: 0.02, moistureFraction: 0.2 },
  output: { dryBasisMarkerFraction: 0.024999999999999998 },
} satisfies ToolExample<Input, Output>;
export const herbalmarkerDryMassCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/herbal-marker-dry-mass-correction",
    title: "Herbal Marker Dry Mass Correction",
    description:
      "Convert an explicit as-received marker mass fraction to dry basis under a supplied wet-basis moisture fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asReceivedMarkerFraction: { type: "number", minimum: 0, maximum: 1 },
        moistureFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["asReceivedMarkerFraction", "moistureFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryBasisMarkerFraction: { type: "number" } },
      required: ["dryBasisMarkerFraction"],
    },
    ports: {
      inputs: [
        {
          id: "asReceivedMarkerFraction",
          label: "As Received Marker Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryBasisMarkerFraction",
          label: "Dry Basis Marker Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = herbalmarkerDryMassCorrectionTool.execute;
export default herbalmarkerDryMassCorrectionTool;
