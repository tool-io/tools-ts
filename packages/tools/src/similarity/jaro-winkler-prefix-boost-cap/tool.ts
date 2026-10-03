import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jaro: number;
  readonly prefixLength: number;
  readonly scaling: number;
  readonly threshold: number;
};
export type Output = { readonly score: number; readonly usedPrefix: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jaro: { type: "number", minimum: 0, maximum: 1 },
    prefixLength: { type: "integer", minimum: 0 },
    scaling: { type: "number", minimum: 0, maximum: 0.25 },
    threshold: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["jaro", "prefixLength", "scaling", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { score: { type: "number" }, usedPrefix: { type: "integer" } },
  required: ["score", "usedPrefix"],
} as const;
/** Calculate jaro winkler prefix boost cap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jaro, prefixLength, scaling, threshold } = request;
  const compute = (): Output => {
    H.probability(jaro);
    H.integer(prefixLength, 0);
    H.domain(scaling >= 0 && scaling <= 0.25);
    H.probability(threshold);
    const usedPrefix = Math.min(4, prefixLength);
    return {
      score: jaro > threshold ? jaro + usedPrefix * scaling * (1 - jaro) : jaro,
      usedPrefix,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jaro: 0.8, prefixLength: 6, scaling: 0.1, threshold: 0.7 },
  output: { score: 0.88, usedPrefix: 4 },
} satisfies ToolExample<Input, Output>;
export const jaroWinklerPrefixBoostCapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/jaro-winkler-prefix-boost-cap",
    title: "Jaro Winkler Prefix Boost Cap Tool",
    description:
      "Calculate jaro winkler prefix boost cap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jaro: { type: "number", minimum: 0, maximum: 1 },
        prefixLength: { type: "integer", minimum: 0 },
        scaling: { type: "number", minimum: 0, maximum: 0.25 },
        threshold: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["jaro", "prefixLength", "scaling", "threshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        usedPrefix: { type: "integer" },
      },
      required: ["score", "usedPrefix"],
    },
    ports: {
      inputs: [
        {
          id: "jaro",
          label: "Jaro",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "prefixLength",
          label: "Prefix Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "scaling",
          label: "Scaling",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "score", label: "Score", valueType: { type: "number" } },
        {
          id: "usedPrefix",
          label: "Used Prefix",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jaroWinklerPrefixBoostCapTool.execute;
export default jaroWinklerPrefixBoostCapTool;
