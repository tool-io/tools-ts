import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sumMoney,
  weightedMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDwellingComponentSquareFeet: readonly number[];
  readonly callerMatchedRebuildMinorPerSquareFoot: readonly number[];
  readonly callerIndependentFixedRebuildCostsMinor: readonly number[];
  readonly callerExistingDwellingCoverageMinor: number;
}>;
export type Output = Readonly<{
  readonly componentModeledRebuildCostsMinor: readonly number[];
  readonly totalModeledDwellingRebuildMinor: number;
  readonly signedCoverageMinusRebuildMinor: number;
}>;
const inputFields = [
  {
    id: "observedDwellingComponentSquareFeet",
    label: "Observed dwelling component square feet",
    kind: "numberList",
  },
  {
    id: "callerMatchedRebuildMinorPerSquareFoot",
    label: "Caller matched rebuild minor per square foot",
    kind: "numberList",
  },
  {
    id: "callerIndependentFixedRebuildCostsMinor",
    label: "Caller independent fixed rebuild costs minor",
    kind: "numberList",
  },
  {
    id: "callerExistingDwellingCoverageMinor",
    label: "Caller existing dwelling coverage minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedDwellingComponentSquareFeet,
    input.callerMatchedRebuildMinorPerSquareFoot,
    "components",
  );
  input.observedDwellingComponentSquareFeet.forEach((v) =>
    bounded(v, "sqft", 0, 1000000),
  );
  input.callerMatchedRebuildMinorPerSquareFoot.forEach((v) => money(v));
  input.callerIndependentFixedRebuildCostsMinor.forEach((v) => money(v));
  money(input.callerExistingDwellingCoverageMinor);
  const costs = input.observedDwellingComponentSquareFeet.map((v, i) =>
      weightedMinor(input.callerMatchedRebuildMinorPerSquareFoot[i], v, 1),
    ),
    total = sumMoney([
      ...costs,
      ...input.callerIndependentFixedRebuildCostsMinor,
    ]);
  return {
    componentModeledRebuildCostsMinor: costs,
    totalModeledDwellingRebuildMinor: total,
    signedCoverageMinusRebuildMinor:
      input.callerExistingDwellingCoverageMinor - total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDwellingComponentSquareFeet: [100, 200],
  callerMatchedRebuildMinorPerSquareFoot: [2000, 3000],
  callerIndependentFixedRebuildCostsMinor: [10000],
  callerExistingDwellingCoverageMinor: 800000,
} satisfies Input;
export const exampleOutput = {
  componentModeledRebuildCostsMinor: [200000, 600000],
  totalModeledDwellingRebuildMinor: 810000,
  signedCoverageMinusRebuildMinor: -10000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/home-dwelling-coverage-rebuild-cost-sqft",
  title: "Home Dwelling Coverage Rebuild Cost SQFT Calculator",
  description:
    "Budget actual dwelling component areas and independently matched rebuild rates/fixed costs against coverage, not real-estate market price, default local SQFT quote or guaranteed replacement adequacy.",
  inputs: inputFields,
  outputs: [
    {
      id: "componentModeledRebuildCostsMinor",
      label: "Component modeled rebuild costs minor",
      kind: "numberList",
    },
    {
      id: "totalModeledDwellingRebuildMinor",
      label: "Total modeled dwelling rebuild minor",
      kind: "number",
    },
    {
      id: "signedCoverageMinusRebuildMinor",
      label: "Signed coverage minus rebuild minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDwellingComponentSquareFeet:
        value.observedDwellingComponentSquareFeet as readonly number[],
      callerMatchedRebuildMinorPerSquareFoot:
        value.callerMatchedRebuildMinorPerSquareFoot as readonly number[],
      callerIndependentFixedRebuildCostsMinor:
        value.callerIndependentFixedRebuildCostsMinor as readonly number[],
      callerExistingDwellingCoverageMinor:
        value.callerExistingDwellingCoverageMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
