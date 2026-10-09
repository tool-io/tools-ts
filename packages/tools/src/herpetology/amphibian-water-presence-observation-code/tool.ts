import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: boolean;
  readonly waterPresent: boolean;
  readonly amphibianPresent: boolean;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "boolean" },
    waterPresent: { type: "boolean" },
    amphibianPresent: { type: "boolean" },
  },
  required: ["observed", "waterPresent", "amphibianPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode supplied water and amphibian presence flags while keeping an unobserved visit separate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, waterPresent, amphibianPresent } = request;
  const compute = (): Output => {
    return {
      code: !observed
        ? "not-observed"
        : waterPresent
          ? amphibianPresent
            ? "water-and-amphibian"
            : "water-only"
          : amphibianPresent
            ? "amphibian-without-water"
            : "neither",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: true, waterPresent: true, amphibianPresent: false },
  output: { code: "water-only" },
} satisfies ToolExample<Input, Output>;
export const amphibianWaterPresenceObservationCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["herpetology", "biology"],
        keywords: ["herpetology", "biology"],
      },
      id: "herpetology/amphibian-water-presence-observation-code",
      title: "Amphibian Water Presence Observation Code",
      description:
        "Encode supplied water and amphibian presence flags while keeping an unobserved visit separate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "boolean" },
          waterPresent: { type: "boolean" },
          amphibianPresent: { type: "boolean" },
        },
        required: ["observed", "waterPresent", "amphibianPresent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { code: { type: "string", maxLength: 8192 } },
        required: ["code"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "waterPresent",
            label: "Water Present",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "amphibianPresent",
            label: "Amphibian Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = amphibianWaterPresenceObservationCodeTool.execute;
export default amphibianWaterPresenceObservationCodeTool;
