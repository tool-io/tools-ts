import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceMonth: number;
  readonly publicationMonth: number;
};
export type Output = {
  readonly lagMonths: number;
  readonly futureReference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMonth: { type: "integer" },
    publicationMonth: { type: "integer" },
  },
  required: ["referenceMonth", "publicationMonth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagMonths: { type: "integer" },
    futureReference: { type: "boolean" },
  },
  required: ["lagMonths", "futureReference"],
} as const;
/** Compare explicitly supplied serial month indexes for an index reference and publication period. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { referenceMonth, publicationMonth } = input;
  const compute = (): Output => {
    return {
      lagMonths: publicationMonth - referenceMonth,
      futureReference: publicationMonth < referenceMonth,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { referenceMonth: 240, publicationMonth: 242 },
  output: { lagMonths: 2, futureReference: false },
} satisfies ToolExample<Input, Output>;
export const inflationIndexPublicationLagLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/inflation-index-publication-lag-label",
    title: "Inflation Index Publication Lag Label Tool",
    description:
      "Compare explicitly supplied serial month indexes for an index reference and publication period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceMonth: { type: "integer" },
        publicationMonth: { type: "integer" },
      },
      required: ["referenceMonth", "publicationMonth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lagMonths: { type: "integer" },
        futureReference: { type: "boolean" },
      },
      required: ["lagMonths", "futureReference"],
    },
    ports: {
      inputs: [
        {
          id: "referenceMonth",
          label: "Reference Month",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "publicationMonth",
          label: "Publication Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lagMonths",
          label: "Lag Months",
          valueType: { type: "integer" },
        },
        {
          id: "futureReference",
          label: "Future Reference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = inflationIndexPublicationLagLabelTool.execute;
export default inflationIndexPublicationLagLabelTool;
