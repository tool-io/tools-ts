import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authors: number;
  readonly authorWeight: number;
  readonly totalWeight: number;
  readonly paperCredit: number;
};
export type Output = {
  readonly equalCredit: number;
  readonly weightedCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authors: { type: "integer", minimum: 1 },
    authorWeight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
    paperCredit: { type: "number", minimum: 0 },
  },
  required: ["authors", "authorWeight", "totalWeight", "paperCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equalCredit: { type: "number" },
    weightedCredit: { type: "number" },
  },
  required: ["equalCredit", "weightedCredit"],
} as const;
/** Calculate fractional authorship one paper term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authors, authorWeight, totalWeight, paperCredit } = request;
  const compute = (): Output => {
    H.integer(authors, 1);
    H.positive(totalWeight);
    H.domain(
      authorWeight >= 0 && authorWeight <= totalWeight && paperCredit >= 0,
    );
    return {
      equalCredit: paperCredit / authors,
      weightedCredit: (paperCredit * authorWeight) / totalWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authors: 4, authorWeight: 2, totalWeight: 5, paperCredit: 1 },
  output: { equalCredit: 0.25, weightedCredit: 0.4 },
} satisfies ToolExample<Input, Output>;
export const fractionalAuthorshipOnePaperTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/fractional-authorship-one-paper-term",
    title: "Fractional Authorship One Paper Term Tool",
    description:
      "Calculate fractional authorship one paper term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authors: { type: "integer", minimum: 1 },
        authorWeight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
        paperCredit: { type: "number", minimum: 0 },
      },
      required: ["authors", "authorWeight", "totalWeight", "paperCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equalCredit: { type: "number" },
        weightedCredit: { type: "number" },
      },
      required: ["equalCredit", "weightedCredit"],
    },
    ports: {
      inputs: [
        {
          id: "authors",
          label: "Authors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "authorWeight",
          label: "Author Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paperCredit",
          label: "Paper Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equalCredit",
          label: "Equal Credit",
          valueType: { type: "number" },
        },
        {
          id: "weightedCredit",
          label: "Weighted Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fractionalAuthorshipOnePaperTermTool.execute;
export default fractionalAuthorshipOnePaperTermTool;
