import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalIncome: number;
  readonly deflator: number;
  readonly deflatorBase: number;
};
export type Output = { readonly realIncome: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalIncome: { type: "number" },
    deflator: { type: "number", exclusiveMinimum: 0 },
    deflatorBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["nominalIncome", "deflator", "deflatorBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { realIncome: { type: "number" } },
  required: ["realIncome"],
} as const;
/** Calculate real income deflator share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalIncome, deflator, deflatorBase } = request;
  const compute = (): Output => {
    H.positive(deflator);
    H.positive(deflatorBase);
    return { realIncome: (nominalIncome * deflatorBase) / deflator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalIncome: 2400, deflator: 120, deflatorBase: 100 },
  output: { realIncome: 2000 },
} satisfies ToolExample<Input, Output>;
export const realIncomeDeflatorShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/real-income-deflator-share",
    title: "Real Income Deflator Share Tool",
    description:
      "Calculate real income deflator share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalIncome: { type: "number" },
        deflator: { type: "number", exclusiveMinimum: 0 },
        deflatorBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["nominalIncome", "deflator", "deflatorBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { realIncome: { type: "number" } },
      required: ["realIncome"],
    },
    ports: {
      inputs: [
        {
          id: "nominalIncome",
          label: "Nominal Income",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deflator",
          label: "Deflator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deflatorBase",
          label: "Deflator Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "realIncome",
          label: "Real Income",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = realIncomeDeflatorShareTool.execute;
export default realIncomeDeflatorShareTool;
