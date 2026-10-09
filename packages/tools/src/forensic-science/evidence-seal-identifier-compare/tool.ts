import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSeal: string;
  readonly observedSeal: string;
  readonly caseSensitive: boolean;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSeal: { type: "string", maxLength: 8192, minLength: 1 },
    observedSeal: { type: "string", maxLength: 8192, minLength: 1 },
    caseSensitive: { type: "boolean" },
  },
  required: ["recordedSeal", "observedSeal", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare literal evidence-seal identifiers under an explicit case policy without authenticating a seal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSeal, observedSeal, caseSensitive } = request;
  const compute = (): Output => {
    H.domain(
      recordedSeal.length > 0 && observedSeal.length > 0,
      "recordedSeal",
    );
    return {
      matches: caseSensitive
        ? recordedSeal === observedSeal
        : recordedSeal.toLowerCase() === observedSeal.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedSeal: "SEAL17",
    observedSeal: "seal17",
    caseSensitive: false,
  },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const evidenceSealIdentifierCompareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/evidence-seal-identifier-compare",
    title: "Evidence Seal Identifier Compare",
    description:
      "Compare literal evidence-seal identifiers under an explicit case policy without authenticating a seal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSeal: { type: "string", maxLength: 8192, minLength: 1 },
        observedSeal: { type: "string", maxLength: 8192, minLength: 1 },
        caseSensitive: { type: "boolean" },
      },
      required: ["recordedSeal", "observedSeal", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "recordedSeal",
          label: "Recorded Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observedSeal",
          label: "Observed Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = evidenceSealIdentifierCompareTool.execute;
export default evidenceSealIdentifierCompareTool;
