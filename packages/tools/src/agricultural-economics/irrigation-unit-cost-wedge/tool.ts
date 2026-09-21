import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCost: number;
  readonly firstVolume: number;
  readonly secondCost: number;
  readonly secondVolume: number;
};
export type Output = {
  readonly firstUnitCost: number;
  readonly secondUnitCost: number;
  readonly wedge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCost: { type: "number", minimum: 0 },
    firstVolume: { type: "number", exclusiveMinimum: 0 },
    secondCost: { type: "number", minimum: 0 },
    secondVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstCost", "firstVolume", "secondCost", "secondVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstUnitCost: { type: "number" },
    secondUnitCost: { type: "number" },
    wedge: { type: "number" },
  },
  required: ["firstUnitCost", "secondUnitCost", "wedge"],
} as const;
/** Calculate irrigation unit cost wedge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCost, firstVolume, secondCost, secondVolume } = request;
  const compute = (): Output => {
    H.domain(firstCost >= 0 && secondCost >= 0);
    H.positive(firstVolume);
    H.positive(secondVolume);
    return {
      firstUnitCost: firstCost / firstVolume,
      secondUnitCost: secondCost / secondVolume,
      wedge: firstCost / firstVolume - secondCost / secondVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCost: 100, firstVolume: 20, secondCost: 80, secondVolume: 20 },
  output: { firstUnitCost: 5, secondUnitCost: 4, wedge: 1 },
} satisfies ToolExample<Input, Output>;
export const irrigationUnitCostWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/irrigation-unit-cost-wedge",
    title: "Irrigation Unit Cost Wedge Tool",
    description:
      "Calculate irrigation unit cost wedge from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCost: { type: "number", minimum: 0 },
        firstVolume: { type: "number", exclusiveMinimum: 0 },
        secondCost: { type: "number", minimum: 0 },
        secondVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstCost", "firstVolume", "secondCost", "secondVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstUnitCost: { type: "number" },
        secondUnitCost: { type: "number" },
        wedge: { type: "number" },
      },
      required: ["firstUnitCost", "secondUnitCost", "wedge"],
    },
    ports: {
      inputs: [
        {
          id: "firstCost",
          label: "First Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstVolume",
          label: "First Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCost",
          label: "Second Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondVolume",
          label: "Second Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstUnitCost",
          label: "First Unit Cost",
          valueType: { type: "number" },
        },
        {
          id: "secondUnitCost",
          label: "Second Unit Cost",
          valueType: { type: "number" },
        },
        { id: "wedge", label: "Wedge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = irrigationUnitCostWedgeTool.execute;
export default irrigationUnitCostWedgeTool;
