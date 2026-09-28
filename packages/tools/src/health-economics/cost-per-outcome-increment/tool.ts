import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCost: number;
  readonly secondCost: number;
  readonly firstOutcome: number;
  readonly secondOutcome: number;
};
export type Output = {
  readonly costIncrement: number;
  readonly outcomeIncrement: number;
  readonly costPerIncrement: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCost: { type: "number" },
    secondCost: { type: "number" },
    firstOutcome: { type: "number" },
    secondOutcome: { type: "number" },
  },
  required: ["firstCost", "secondCost", "firstOutcome", "secondOutcome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costIncrement: { type: "number" },
    outcomeIncrement: { type: "number" },
    costPerIncrement: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "costIncrement",
    "outcomeIncrement",
    "costPerIncrement",
    "defined",
  ],
} as const;
/** Compare supplied compatible cost/outcome increments without selecting a cost-effectiveness threshold or making a clinical decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCost, secondCost, firstOutcome, secondOutcome } = request;
  const compute = (): Output => {
    return {
      costIncrement: secondCost - firstCost,
      outcomeIncrement: secondOutcome - firstOutcome,
      costPerIncrement:
        secondOutcome !== firstOutcome
          ? (secondCost - firstCost) / (secondOutcome - firstOutcome)
          : 0,
      defined: secondOutcome !== firstOutcome,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCost: 100, secondCost: 160, firstOutcome: 2, secondOutcome: 5 },
  output: {
    costIncrement: 60,
    outcomeIncrement: 3,
    costPerIncrement: 20,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const costPerOutcomeIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/cost-per-outcome-increment",
    title: "Cost Per Outcome Increment Tool",
    description:
      "Compare supplied compatible cost/outcome increments without selecting a cost-effectiveness threshold or making a clinical decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCost: { type: "number" },
        secondCost: { type: "number" },
        firstOutcome: { type: "number" },
        secondOutcome: { type: "number" },
      },
      required: ["firstCost", "secondCost", "firstOutcome", "secondOutcome"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costIncrement: { type: "number" },
        outcomeIncrement: { type: "number" },
        costPerIncrement: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "costIncrement",
        "outcomeIncrement",
        "costPerIncrement",
        "defined",
      ],
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
          id: "secondCost",
          label: "Second Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOutcome",
          label: "First Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOutcome",
          label: "Second Outcome",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "costIncrement",
          label: "Cost Increment",
          valueType: { type: "number" },
        },
        {
          id: "outcomeIncrement",
          label: "Outcome Increment",
          valueType: { type: "number" },
        },
        {
          id: "costPerIncrement",
          label: "Cost Per Increment",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = costPerOutcomeIncrementTool.execute;
export default costPerOutcomeIncrementTool;
