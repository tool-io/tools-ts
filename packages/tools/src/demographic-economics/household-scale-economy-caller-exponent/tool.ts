import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly income: number;
  readonly members: number;
  readonly exponent: number;
};
export type Output = {
  readonly equivalenceScale: number;
  readonly equivalizedIncome: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    income: { type: "number" },
    members: { type: "integer", minimum: 1 },
    exponent: { type: "number", minimum: 0 },
  },
  required: ["income", "members", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalenceScale: { type: "number" },
    equivalizedIncome: { type: "number" },
  },
  required: ["equivalenceScale", "equivalizedIncome"],
} as const;
/** Calculate household scale economy caller exponent from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { income, members, exponent } = request;
  const compute = (): Output => {
    H.integer(members, 1);
    H.domain(exponent >= 0);
    return {
      equivalenceScale: members ** exponent,
      equivalizedIncome: income / members ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { income: 1000, members: 4, exponent: 0.5 },
  output: { equivalenceScale: 2, equivalizedIncome: 500 },
} satisfies ToolExample<Input, Output>;
export const householdScaleEconomyCallerExponentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "demographic-economics/household-scale-economy-caller-exponent",
      title: "Household Scale Economy Caller Exponent Tool",
      description:
        "Calculate household scale economy caller exponent from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          income: { type: "number" },
          members: { type: "integer", minimum: 1 },
          exponent: { type: "number", minimum: 0 },
        },
        required: ["income", "members", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalenceScale: { type: "number" },
          equivalizedIncome: { type: "number" },
        },
        required: ["equivalenceScale", "equivalizedIncome"],
      },
      ports: {
        inputs: [
          {
            id: "income",
            label: "Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "members",
            label: "Members",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalenceScale",
            label: "Equivalence Scale",
            valueType: { type: "number" },
          },
          {
            id: "equivalizedIncome",
            label: "Equivalized Income",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = householdScaleEconomyCallerExponentTool.execute;
export default householdScaleEconomyCallerExponentTool;
