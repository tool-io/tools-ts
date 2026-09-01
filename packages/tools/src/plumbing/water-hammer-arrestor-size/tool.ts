import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedArrestorIds: readonly string[];
  readonly callerMatchedTestedSurgeEnergyJ: readonly number[];
  readonly callerMatchedMaximumPressureKpa: readonly number[];
  readonly callerIndependentlyEstablishedSurgeEnergyJ: number;
  readonly observedSystemMaximumKpa: number;
}>;
export type Output = Readonly<{
  readonly callerJointlyCompatibleArrestorIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVerifiedArrestorIds",
    label: "Caller verified arrestor ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedTestedSurgeEnergyJ",
    label: "Caller matched tested surge energy j",
    kind: "numberList",
  },
  {
    id: "callerMatchedMaximumPressureKpa",
    label: "Caller matched maximum pressure kpa",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedSurgeEnergyJ",
    label: "Caller independently established surge energy j",
    kind: "number",
  },
  {
    id: "observedSystemMaximumKpa",
    label: "Observed system maximum kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedMaximumPressureKpa.forEach((v) =>
    positive(v, "callerMatchedMaximumPressureKpa"),
  );
  positive(input.observedSystemMaximumKpa, "observedSystemMaximumKpa");
  input.callerMatchedTestedSurgeEnergyJ.forEach((v) =>
    nonnegative(v, "callerMatchedTestedSurgeEnergyJ"),
  );
  nonnegative(
    input.callerIndependentlyEstablishedSurgeEnergyJ,
    "callerIndependentlyEstablishedSurgeEnergyJ",
  );
  aligned(
    input.callerVerifiedArrestorIds,
    input.callerMatchedTestedSurgeEnergyJ,
    "callerVerifiedArrestorIds",
  );
  aligned(
    input.callerVerifiedArrestorIds,
    input.callerMatchedMaximumPressureKpa,
    "callerVerifiedArrestorIds",
  );
  unique(input.callerVerifiedArrestorIds, "arrestors");
  return {
    callerJointlyCompatibleArrestorIds: input.callerVerifiedArrestorIds.filter(
      (_, i) =>
        input.callerMatchedTestedSurgeEnergyJ[i] >=
          input.callerIndependentlyEstablishedSurgeEnergyJ &&
        input.callerMatchedMaximumPressureKpa[i] >=
          input.observedSystemMaximumKpa,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedArrestorIds: ["a", "b"],
  callerMatchedTestedSurgeEnergyJ: [10, 20],
  callerMatchedMaximumPressureKpa: [500, 800],
  callerIndependentlyEstablishedSurgeEnergyJ: 15,
  observedSystemMaximumKpa: 600,
} satisfies Input;
export const exampleOutput = {
  callerJointlyCompatibleArrestorIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-hammer-arrestor-size",
  title: "Plumbing Water Hammer Arrestor Size Calculator",
  description:
    "Screen independently established surge-energy/pressure envelope against caller verified arrestor tests, not fixture-count sizing or inferred transient water hammer; no mitigation/safety guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerJointlyCompatibleArrestorIds",
      label: "Caller jointly compatible arrestor ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedArrestorIds:
        value.callerVerifiedArrestorIds as readonly string[],
      callerMatchedTestedSurgeEnergyJ:
        value.callerMatchedTestedSurgeEnergyJ as readonly number[],
      callerMatchedMaximumPressureKpa:
        value.callerMatchedMaximumPressureKpa as readonly number[],
      callerIndependentlyEstablishedSurgeEnergyJ:
        value.callerIndependentlyEstablishedSurgeEnergyJ as number,
      observedSystemMaximumKpa: value.observedSystemMaximumKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
