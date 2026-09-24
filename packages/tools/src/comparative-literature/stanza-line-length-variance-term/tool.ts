import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineLength: number;
  readonly meanLength: number;
  readonly stanzaLines: number;
};
export type Output = {
  readonly squaredDeviation: number;
  readonly varianceContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineLength: { type: "integer", minimum: 0 },
    meanLength: { type: "number", minimum: 0 },
    stanzaLines: { type: "integer", minimum: 1 },
  },
  required: ["lineLength", "meanLength", "stanzaLines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squaredDeviation: { type: "number" },
    varianceContribution: { type: "number" },
  },
  required: ["squaredDeviation", "varianceContribution"],
} as const;
/** One contribution to population variance of supplied line lengths on a common counting basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineLength, meanLength, stanzaLines } = request;
  const compute = (): Output => {
    H.integer(lineLength, 0);
    H.domain(meanLength >= 0);
    H.integer(stanzaLines, 1);
    return {
      squaredDeviation: (lineLength - meanLength) ** 2,
      varianceContribution: (lineLength - meanLength) ** 2 / stanzaLines,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lineLength: 12, meanLength: 10, stanzaLines: 4 },
  output: { squaredDeviation: 4, varianceContribution: 1 },
} satisfies ToolExample<Input, Output>;
export const stanzaLineLengthVarianceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/stanza-line-length-variance-term",
    title: "Stanza Line Length Variance Term Tool",
    description:
      "One contribution to population variance of supplied line lengths on a common counting basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineLength: { type: "integer", minimum: 0 },
        meanLength: { type: "number", minimum: 0 },
        stanzaLines: { type: "integer", minimum: 1 },
      },
      required: ["lineLength", "meanLength", "stanzaLines"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        squaredDeviation: { type: "number" },
        varianceContribution: { type: "number" },
      },
      required: ["squaredDeviation", "varianceContribution"],
    },
    ports: {
      inputs: [
        {
          id: "lineLength",
          label: "Line Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "meanLength",
          label: "Mean Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stanzaLines",
          label: "Stanza Lines",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "squaredDeviation",
          label: "Squared Deviation",
          valueType: { type: "number" },
        },
        {
          id: "varianceContribution",
          label: "Variance Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stanzaLineLengthVarianceTermTool.execute;
export default stanzaLineLengthVarianceTermTool;
