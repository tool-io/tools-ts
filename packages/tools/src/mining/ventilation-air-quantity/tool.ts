import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly contaminantGenerationMgPerSecond: readonly number[];
  readonly intakeConcentrationsMgPerM3: readonly number[];
  readonly comparisonConcentrationsMgPerM3: readonly number[];
  readonly minimumFreshAirM3PerSecond: number;
}>;
export type Output = Readonly<{
  readonly contaminantRequiredFlowsM3PerSecond: readonly number[];
  readonly governingFreshAirM3PerSecond: number;
}>;
const inputFields = [
  {
    id: "contaminantGenerationMgPerSecond",
    label: "Contaminant generation mg per second",
    kind: "numberList",
  },
  {
    id: "intakeConcentrationsMgPerM3",
    label: "Intake concentrations mg per m3",
    kind: "numberList",
  },
  {
    id: "comparisonConcentrationsMgPerM3",
    label: "Comparison concentrations mg per m3",
    kind: "numberList",
  },
  {
    id: "minimumFreshAirM3PerSecond",
    label: "Minimum fresh air m3 per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.contaminantGenerationMgPerSecond.forEach((v) =>
    nonnegative(v, "contaminantGenerationMgPerSecond"),
  );
  input.intakeConcentrationsMgPerM3.forEach((v) =>
    nonnegative(v, "intakeConcentrationsMgPerM3"),
  );
  nonnegative(input.minimumFreshAirM3PerSecond, "minimumFreshAirM3PerSecond");
  aligned(
    input.contaminantGenerationMgPerSecond,
    input.intakeConcentrationsMgPerM3,
    "contaminantGenerationMgPerSecond",
  );
  aligned(
    input.contaminantGenerationMgPerSecond,
    input.comparisonConcentrationsMgPerM3,
    "contaminantGenerationMgPerSecond",
  );
  const contaminantRequiredFlowsM3PerSecond =
    input.contaminantGenerationMgPerSecond.map(
      (v, i) =>
        v /
        positive(
          input.comparisonConcentrationsMgPerM3[i] -
            input.intakeConcentrationsMgPerM3[i],
          "comparisonConcentrationsMgPerM3",
        ),
    );
  return {
    contaminantRequiredFlowsM3PerSecond,
    governingFreshAirM3PerSecond: Math.max(
      input.minimumFreshAirM3PerSecond,
      maximum(contaminantRequiredFlowsM3PerSecond),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contaminantGenerationMgPerSecond: [100, 60],
  intakeConcentrationsMgPerM3: [1, 0],
  comparisonConcentrationsMgPerM3: [3, 3],
  minimumFreshAirM3PerSecond: 10,
} satisfies Input;
export const exampleOutput = {
  contaminantRequiredFlowsM3PerSecond: [50, 20],
  governingFreshAirM3PerSecond: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ventilation-air-quantity",
  title: "Ventilation Air Quantity",
  description:
    "Screen fully mixed steady dilution against supplied concentrations; shared contaminant constraints use maximum flow, not a sum, and do not certify mine safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "contaminantRequiredFlowsM3PerSecond",
      label: "Contaminant required flows m3 per second",
      kind: "numberList",
    },
    {
      id: "governingFreshAirM3PerSecond",
      label: "Governing fresh air m3 per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      contaminantGenerationMgPerSecond:
        value.contaminantGenerationMgPerSecond as readonly number[],
      intakeConcentrationsMgPerM3:
        value.intakeConcentrationsMgPerM3 as readonly number[],
      comparisonConcentrationsMgPerM3:
        value.comparisonConcentrationsMgPerM3 as readonly number[],
      minimumFreshAirM3PerSecond: value.minimumFreshAirM3PerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
