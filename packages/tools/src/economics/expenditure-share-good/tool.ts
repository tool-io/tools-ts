import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goodExpenditure: number;
  readonly totalExpenditure: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goodExpenditure: { type: "number", minimum: 0 },
    totalExpenditure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["goodExpenditure", "totalExpenditure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Compute one good's expenditure share from an explicit compatible expenditure total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goodExpenditure, totalExpenditure } = request;
  const compute = (): Output => {
    (H.domain(totalExpenditure > 0, "totalExpenditure"), totalExpenditure);
    H.domain(
      goodExpenditure >= 0 && goodExpenditure <= totalExpenditure,
      "goodExpenditure",
    );
    return { share: goodExpenditure / totalExpenditure };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goodExpenditure: 30, totalExpenditure: 120 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const expenditureShareGoodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/expenditure-share-good",
    title: "Expenditure Share Good Tool",
    description:
      "Compute one good's expenditure share from an explicit compatible expenditure total.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goodExpenditure: { type: "number", minimum: 0 },
        totalExpenditure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["goodExpenditure", "totalExpenditure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "goodExpenditure",
          label: "Good Expenditure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalExpenditure",
          label: "Total Expenditure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = expenditureShareGoodTool.execute;
export default expenditureShareGoodTool;
