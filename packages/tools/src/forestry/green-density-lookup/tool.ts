import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerGreenWoodDensityIds: readonly string[];
  readonly callerGreenWoodDensityValues: readonly number[];
  readonly queryGreenWoodDensityId: string;
  readonly observedGreenWoodDensityValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedGreenWoodDensityValue: number;
  readonly signedObservedMinusGreenWoodDensityReference: number;
}>;
const inputFields = [
  {
    id: "callerGreenWoodDensityIds",
    label: "Caller green wood density ids",
    kind: "stringList",
  },
  {
    id: "callerGreenWoodDensityValues",
    label: "Caller green wood density values",
    kind: "numberList",
  },
  {
    id: "queryGreenWoodDensityId",
    label: "Query green wood density id",
    kind: "string",
  },
  {
    id: "observedGreenWoodDensityValue",
    label: "Observed green wood density value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerGreenWoodDensityIds,
    input.callerGreenWoodDensityValues,
    "callerGreenWoodDensityIds",
  );
  input.callerGreenWoodDensityValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedGreenWoodDensityValue, "observation");
  const i = catalogIndex(
    input.callerGreenWoodDensityIds,
    input.queryGreenWoodDensityId,
  );
  return {
    callerMatchedGreenWoodDensityValue: input.callerGreenWoodDensityValues[i],
    signedObservedMinusGreenWoodDensityReference:
      input.observedGreenWoodDensityValue -
      input.callerGreenWoodDensityValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGreenWoodDensityIds: ["a", "b"],
  callerGreenWoodDensityValues: [2, 4],
  queryGreenWoodDensityId: "b",
  observedGreenWoodDensityValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedGreenWoodDensityValue: 4,
  signedObservedMinusGreenWoodDensityReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/green-density-lookup",
  title: "Green Density Lookup",
  description:
    "Audit actual same-moisture green-wood density reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedGreenWoodDensityValue",
      label: "Caller matched green wood density value",
      kind: "number",
    },
    {
      id: "signedObservedMinusGreenWoodDensityReference",
      label: "Signed observed minus green wood density reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGreenWoodDensityIds:
        value.callerGreenWoodDensityIds as readonly string[],
      callerGreenWoodDensityValues:
        value.callerGreenWoodDensityValues as readonly number[],
      queryGreenWoodDensityId: value.queryGreenWoodDensityId as string,
      observedGreenWoodDensityValue:
        value.observedGreenWoodDensityValue as number,
    }),
});
export const run = tool.execute;
export default tool;
