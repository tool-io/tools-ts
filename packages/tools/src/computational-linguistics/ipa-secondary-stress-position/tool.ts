import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly transcription: string };
export type Output = {
  readonly codePointIndices: readonly number[];
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transcription: { type: "string", maxLength: 8192 } },
  required: ["transcription"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codePointIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    count: { type: "integer" },
  },
  required: ["codePointIndices", "count"],
} as const;
/** Locate literal U+02CC secondary-stress markers using Unicode code-point indices; no phonological analysis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transcription } = request;
  const compute = (): Output => {
    const codePointIndices = [...transcription].flatMap((x, i) =>
      x === "ˌ" ? [i] : [],
    );
    return { codePointIndices, count: codePointIndices.length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transcription: "ˌalphaˈbeta" },
  output: { codePointIndices: [0], count: 1 },
} satisfies ToolExample<Input, Output>;
export const ipaSecondaryStressPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-linguistics/ipa-secondary-stress-position",
    title: "IPA Secondary Stress Position Tool",
    description:
      "Locate literal U+02CC secondary-stress markers using Unicode code-point indices; no phonological analysis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transcription: { type: "string", maxLength: 8192 } },
      required: ["transcription"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codePointIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        count: { type: "integer" },
      },
      required: ["codePointIndices", "count"],
    },
    ports: {
      inputs: [
        {
          id: "transcription",
          label: "Transcription",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "codePointIndices",
          label: "Code Point Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = ipaSecondaryStressPositionTool.execute;
export default ipaSecondaryStressPositionTool;
