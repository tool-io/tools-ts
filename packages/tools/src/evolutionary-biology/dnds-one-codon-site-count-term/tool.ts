import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nonsynonymousChanges: number;
  readonly nonsynonymousSites: number;
  readonly synonymousChanges: number;
  readonly synonymousSites: number;
};
export type Output = {
  readonly dN: number;
  readonly dS: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonsynonymousChanges: { type: "number", minimum: 0 },
    nonsynonymousSites: { type: "number", exclusiveMinimum: 0 },
    synonymousChanges: { type: "number", exclusiveMinimum: 0 },
    synonymousSites: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "nonsynonymousChanges",
    "nonsynonymousSites",
    "synonymousChanges",
    "synonymousSites",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dN: { type: "number" },
    dS: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["dN", "dS", "ratio"],
} as const;
/** Uncorrected changes per opportunity from supplied effective site counts; no codon-model or multiple-hit estimation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    nonsynonymousChanges,
    nonsynonymousSites,
    synonymousChanges,
    synonymousSites,
  } = request;
  const compute = (): Output => {
    H.domain(nonsynonymousChanges >= 0);
    H.positive(nonsynonymousSites);
    H.positive(synonymousChanges);
    H.positive(synonymousSites);
    return {
      dN: nonsynonymousChanges / nonsynonymousSites,
      dS: synonymousChanges / synonymousSites,
      ratio:
        (nonsynonymousChanges * synonymousSites) /
        (nonsynonymousSites * synonymousChanges),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nonsynonymousChanges: 12,
    nonsynonymousSites: 600,
    synonymousChanges: 4,
    synonymousSites: 200,
  },
  output: { dN: 0.02, dS: 0.02, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const dndsOneCodonSiteCountTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/dnds-one-codon-site-count-term",
    title: "dN/dS One Codon Site Count Term Tool",
    description:
      "Uncorrected changes per opportunity from supplied effective site counts; no codon-model or multiple-hit estimation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonsynonymousChanges: { type: "number", minimum: 0 },
        nonsynonymousSites: { type: "number", exclusiveMinimum: 0 },
        synonymousChanges: { type: "number", exclusiveMinimum: 0 },
        synonymousSites: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "nonsynonymousChanges",
        "nonsynonymousSites",
        "synonymousChanges",
        "synonymousSites",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dN: { type: "number" },
        dS: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["dN", "dS", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "nonsynonymousChanges",
          label: "Nonsynonymous Changes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonsynonymousSites",
          label: "Nonsynonymous Sites",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "synonymousChanges",
          label: "Synonymous Changes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "synonymousSites",
          label: "Synonymous Sites",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dN", label: "D N", valueType: { type: "number" } },
        { id: "dS", label: "D S", valueType: { type: "number" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dndsOneCodonSiteCountTermTool.execute;
export default dndsOneCodonSiteCountTermTool;
