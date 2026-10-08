import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothIdentifier: string;
  readonly firstSite: string;
  readonly secondSite: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
    firstSite: { type: "string", maxLength: 8192, minLength: 1 },
    secondSite: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["toothIdentifier", "firstSite", "secondSite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an ordered pair of explicit dental site labels under a supplied tooth identifier without interpreting a tooth-numbering system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothIdentifier, firstSite, secondSite } = request;
  const compute = (): Output => {
    H.domain(toothIdentifier.length > 0, "toothIdentifier");
    H.domain(firstSite.length > 0, "firstSite");
    H.domain(secondSite.length > 0, "secondSite");
    return { token: JSON.stringify([toothIdentifier, firstSite, secondSite]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { toothIdentifier: "T17", firstSite: "mesial", secondSite: "distal" },
  output: { token: '["T17","mesial","distal"]' },
} satisfies ToolExample<Input, Output>;
export const interdentalSitePairToothLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/interdental-site-pair-tooth-label",
    title: "Interdental Site Pair Tooth Label Tool",
    description:
      "Encode an ordered pair of explicit dental site labels under a supplied tooth identifier without interpreting a tooth-numbering system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
        firstSite: { type: "string", maxLength: 8192, minLength: 1 },
        secondSite: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["toothIdentifier", "firstSite", "secondSite"],
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
          id: "toothIdentifier",
          label: "Tooth Identifier",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstSite",
          label: "First Site",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondSite",
          label: "Second Site",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = interdentalSitePairToothLabelTool.execute;
export default interdentalSitePairToothLabelTool;
