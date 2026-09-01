import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerAirSeparatorIds: readonly string[];
  readonly callerVerifiedMatchedFlowLitersMinute: readonly number[];
  readonly callerVerifiedMatchedGasRemovalFractions: readonly number[];
  readonly observedSystemFlowLitersMinute: number;
  readonly callerMinimumRequiredGasRemovalFraction: number;
}>;
export type Output = Readonly<{
  readonly callerJointlyCompatibleAirSeparatorIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAirSeparatorIds",
    label: "Caller air separator ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedFlowLitersMinute",
    label: "Caller verified matched flow liters minute",
    kind: "numberList",
  },
  {
    id: "callerVerifiedMatchedGasRemovalFractions",
    label: "Caller verified matched gas removal fractions",
    kind: "numberList",
  },
  {
    id: "observedSystemFlowLitersMinute",
    label: "Observed system flow liters minute",
    kind: "number",
  },
  {
    id: "callerMinimumRequiredGasRemovalFraction",
    label: "Caller minimum required gas removal fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedFlowLitersMinute.forEach((v) =>
    nonnegative(v, "callerVerifiedMatchedFlowLitersMinute"),
  );
  nonnegative(
    input.observedSystemFlowLitersMinute,
    "observedSystemFlowLitersMinute",
  );
  input.callerVerifiedMatchedGasRemovalFractions.forEach((v) =>
    fraction(v, "callerVerifiedMatchedGasRemovalFractions"),
  );
  fraction(
    input.callerMinimumRequiredGasRemovalFraction,
    "callerMinimumRequiredGasRemovalFraction",
  );
  aligned(
    input.callerAirSeparatorIds,
    input.callerVerifiedMatchedFlowLitersMinute,
    "callerAirSeparatorIds",
  );
  aligned(
    input.callerAirSeparatorIds,
    input.callerVerifiedMatchedGasRemovalFractions,
    "callerAirSeparatorIds",
  );
  unique(input.callerAirSeparatorIds, "separators");
  return {
    callerJointlyCompatibleAirSeparatorIds: input.callerAirSeparatorIds.filter(
      (_, i) =>
        input.callerVerifiedMatchedFlowLitersMinute[i] >=
          input.observedSystemFlowLitersMinute &&
        input.callerVerifiedMatchedGasRemovalFractions[i] >=
          input.callerMinimumRequiredGasRemovalFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAirSeparatorIds: ["a", "b"],
  callerVerifiedMatchedFlowLitersMinute: [20, 30],
  callerVerifiedMatchedGasRemovalFractions: [0.5, 0.9],
  observedSystemFlowLitersMinute: 25,
  callerMinimumRequiredGasRemovalFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  callerJointlyCompatibleAirSeparatorIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/hydronic-air-separator-size",
  title: "Plumbing Hydronic Air Separator Size Calculator",
  description:
    "Screen independently verified hydronic flow/gas-removal tests jointly, not steam vent capacity or nominal separator diameter; no guaranteed degassing or installation recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerJointlyCompatibleAirSeparatorIds",
      label: "Caller jointly compatible air separator ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAirSeparatorIds: value.callerAirSeparatorIds as readonly string[],
      callerVerifiedMatchedFlowLitersMinute:
        value.callerVerifiedMatchedFlowLitersMinute as readonly number[],
      callerVerifiedMatchedGasRemovalFractions:
        value.callerVerifiedMatchedGasRemovalFractions as readonly number[],
      observedSystemFlowLitersMinute:
        value.observedSystemFlowLitersMinute as number,
      callerMinimumRequiredGasRemovalFraction:
        value.callerMinimumRequiredGasRemovalFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
