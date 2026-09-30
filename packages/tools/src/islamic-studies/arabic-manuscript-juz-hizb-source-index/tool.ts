import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly juz: number;
  readonly hizbWithinJuz: number;
  readonly subdivisionsPerHizb: number;
  readonly subdivision: number;
};
export type Output = {
  readonly hizbIndex: number;
  readonly subdivisionIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    juz: { type: "integer", minimum: 1, maximum: 30 },
    hizbWithinJuz: { type: "integer", minimum: 1, maximum: 2 },
    subdivisionsPerHizb: { type: "integer", minimum: 1 },
    subdivision: { type: "integer", minimum: 1 },
  },
  required: ["juz", "hizbWithinJuz", "subdivisionsPerHizb", "subdivision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hizbIndex: { type: "integer" },
    subdivisionIndex: { type: "integer" },
  },
  required: ["hizbIndex", "subdivisionIndex"],
} as const;
/** Ordinal indexing under the explicit 30-juz, two-hizb-per-juz structure and a supplied subdivision count, without mapping to verses or manuscript pages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { juz, hizbWithinJuz, subdivisionsPerHizb, subdivision } = request;
  const compute = (): Output => {
    H.integer(juz, 1, 30);
    H.integer(hizbWithinJuz, 1, 2);
    H.integer(subdivisionsPerHizb, 1);
    H.integer(subdivision, 1, subdivisionsPerHizb);
    return {
      hizbIndex: 2 * (juz - 1) + hizbWithinJuz,
      subdivisionIndex:
        (2 * (juz - 1) + hizbWithinJuz - 1) * subdivisionsPerHizb + subdivision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { juz: 2, hizbWithinJuz: 1, subdivisionsPerHizb: 4, subdivision: 3 },
  output: { hizbIndex: 3, subdivisionIndex: 11 },
} satisfies ToolExample<Input, Output>;
export const arabicManuscriptJuzHizbSourceIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "islamic-studies/arabic-manuscript-juz-hizb-source-index",
    title: "Arabic Manuscript Juz Hizb Source Index Tool",
    description:
      "Ordinal indexing under the explicit 30-juz, two-hizb-per-juz structure and a supplied subdivision count, without mapping to verses or manuscript pages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        juz: { type: "integer", minimum: 1, maximum: 30 },
        hizbWithinJuz: { type: "integer", minimum: 1, maximum: 2 },
        subdivisionsPerHizb: { type: "integer", minimum: 1 },
        subdivision: { type: "integer", minimum: 1 },
      },
      required: ["juz", "hizbWithinJuz", "subdivisionsPerHizb", "subdivision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hizbIndex: { type: "integer" },
        subdivisionIndex: { type: "integer" },
      },
      required: ["hizbIndex", "subdivisionIndex"],
    },
    ports: {
      inputs: [
        {
          id: "juz",
          label: "Juz",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hizbWithinJuz",
          label: "Hizb Within Juz",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subdivisionsPerHizb",
          label: "Subdivisions Per Hizb",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "subdivision",
          label: "Subdivision",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "hizbIndex",
          label: "Hizb Index",
          valueType: { type: "integer" },
        },
        {
          id: "subdivisionIndex",
          label: "Subdivision Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = arabicManuscriptJuzHizbSourceIndexTool.execute;
export default arabicManuscriptJuzHizbSourceIndexTool;
