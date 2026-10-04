import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly externalInput: number;
  readonly recycledInput: number;
  readonly output: number;
  readonly losses: number;
};
export type Output = {
  readonly surplus: number;
  readonly recycledShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    externalInput: { type: "number", minimum: 0 },
    recycledInput: { type: "number", minimum: 0 },
    output: { type: "number", minimum: 0 },
    losses: { type: "number", minimum: 0 },
  },
  required: ["externalInput", "recycledInput", "output", "losses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surplus: { type: "number" },
    recycledShare: { type: "number" },
  },
  required: ["surplus", "recycledShare"],
} as const;
/** Calculate nutrient budget recycled input term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { externalInput, recycledInput, output, losses } = request;
  const compute = (): Output => {
    H.domain(
      externalInput >= 0 &&
        recycledInput >= 0 &&
        externalInput + recycledInput > 0 &&
        output >= 0 &&
        losses >= 0,
    );
    return {
      surplus: externalInput + recycledInput - output - losses,
      recycledShare: recycledInput / (externalInput + recycledInput),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { externalInput: 60, recycledInput: 40, output: 70, losses: 10 },
  output: { surplus: 20, recycledShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const nutrientBudgetRecycledInputTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/nutrient-budget-recycled-input-term",
    title: "Nutrient Budget Recycled Input Term Tool",
    description:
      "Calculate nutrient budget recycled input term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        externalInput: { type: "number", minimum: 0 },
        recycledInput: { type: "number", minimum: 0 },
        output: { type: "number", minimum: 0 },
        losses: { type: "number", minimum: 0 },
      },
      required: ["externalInput", "recycledInput", "output", "losses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surplus: { type: "number" },
        recycledShare: { type: "number" },
      },
      required: ["surplus", "recycledShare"],
    },
    ports: {
      inputs: [
        {
          id: "externalInput",
          label: "External Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recycledInput",
          label: "Recycled Input",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "losses",
          label: "Losses",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "surplus", label: "Surplus", valueType: { type: "number" } },
        {
          id: "recycledShare",
          label: "Recycled Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientBudgetRecycledInputTermTool.execute;
export default nutrientBudgetRecycledInputTermTool;
