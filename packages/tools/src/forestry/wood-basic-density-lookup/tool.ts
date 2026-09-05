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
  readonly callerBasicWoodDensityIds: readonly string[];
  readonly callerBasicWoodDensityValues: readonly number[];
  readonly queryBasicWoodDensityId: string;
  readonly observedBasicWoodDensityValue: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedBasicWoodDensityValue: number;
  readonly signedObservedMinusBasicWoodDensityReference: number;
}>;
const inputFields = [
  {
    id: "callerBasicWoodDensityIds",
    label: "Caller basic wood density ids",
    kind: "stringList",
  },
  {
    id: "callerBasicWoodDensityValues",
    label: "Caller basic wood density values",
    kind: "numberList",
  },
  {
    id: "queryBasicWoodDensityId",
    label: "Query basic wood density id",
    kind: "string",
  },
  {
    id: "observedBasicWoodDensityValue",
    label: "Observed basic wood density value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerBasicWoodDensityIds,
    input.callerBasicWoodDensityValues,
    "callerBasicWoodDensityIds",
  );
  input.callerBasicWoodDensityValues.forEach((v) =>
    nonnegative(v, "reference"),
  );
  nonnegative(input.observedBasicWoodDensityValue, "observation");
  const i = catalogIndex(
    input.callerBasicWoodDensityIds,
    input.queryBasicWoodDensityId,
  );
  return {
    callerMatchedBasicWoodDensityValue: input.callerBasicWoodDensityValues[i],
    signedObservedMinusBasicWoodDensityReference:
      input.observedBasicWoodDensityValue -
      input.callerBasicWoodDensityValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBasicWoodDensityIds: ["a", "b"],
  callerBasicWoodDensityValues: [2, 4],
  queryBasicWoodDensityId: "b",
  observedBasicWoodDensityValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerMatchedBasicWoodDensityValue: 4,
  signedObservedMinusBasicWoodDensityReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/wood-basic-density-lookup",
  title: "Basic Wood Density Lookup",
  description:
    "Audit independently measured dry mass/green-volume basic density reference. Audit caller independently verified matched reference against actual observation, not a fabricated specification. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedBasicWoodDensityValue",
      label: "Caller matched basic wood density value",
      kind: "number",
    },
    {
      id: "signedObservedMinusBasicWoodDensityReference",
      label: "Signed observed minus basic wood density reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBasicWoodDensityIds:
        value.callerBasicWoodDensityIds as readonly string[],
      callerBasicWoodDensityValues:
        value.callerBasicWoodDensityValues as readonly number[],
      queryBasicWoodDensityId: value.queryBasicWoodDensityId as string,
      observedBasicWoodDensityValue:
        value.observedBasicWoodDensityValue as number,
    }),
});
export const run = tool.execute;
export default tool;
