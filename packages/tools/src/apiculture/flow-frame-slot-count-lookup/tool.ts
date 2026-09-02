import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  catalogIndex,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFlowSlotInventoryKeys: readonly string[];
  readonly callerVerifiedFlowSlotInventoryValues: readonly number[];
  readonly queryFlowSlotInventoryKey: string;
  readonly observedFlowSlotInventoryValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFlowSlotInventoryKeys",
    label: "Caller verified flow slot inventory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFlowSlotInventoryValues",
    label: "Caller verified flow slot inventory values",
    kind: "numberList",
  },
  {
    id: "queryFlowSlotInventoryKey",
    label: "Query flow slot inventory key",
    kind: "string",
  },
  {
    id: "observedFlowSlotInventoryValue",
    label: "Observed flow slot inventory value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedFlowSlotInventoryValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(input.observedFlowSlotInventoryValue, "observed physical value");
  aligned(
    input.callerVerifiedFlowSlotInventoryKeys,
    input.callerVerifiedFlowSlotInventoryValues,
    "callerVerifiedFlowSlotInventoryKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFlowSlotInventoryKeys,
    input.queryFlowSlotInventoryKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFlowSlotInventoryValues[i],
    signedObservedMinusReference:
      input.observedFlowSlotInventoryValue -
      input.callerVerifiedFlowSlotInventoryValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFlowSlotInventoryKeys: ["a", "b"],
  callerVerifiedFlowSlotInventoryValues: [2, 4],
  queryFlowSlotInventoryKey: "b",
  observedFlowSlotInventoryValue: 5,
} satisfies Input;
export const exampleOutput = {
  callerReferenceValue: 4,
  signedObservedMinusReference: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/flow-frame-slot-count-lookup",
  title: "Flow Frame Slot Count Lookup",
  description:
    "Caller exact manufacturer/model Flow-frame slot inventory reference, not live product specification. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerReferenceValue",
      label: "Caller reference value",
      kind: "number",
    },
    {
      id: "signedObservedMinusReference",
      label: "Signed observed minus reference",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedFlowSlotInventoryKeys:
        value.callerVerifiedFlowSlotInventoryKeys as readonly string[],
      callerVerifiedFlowSlotInventoryValues:
        value.callerVerifiedFlowSlotInventoryValues as readonly number[],
      queryFlowSlotInventoryKey: value.queryFlowSlotInventoryKey as string,
      observedFlowSlotInventoryValue:
        value.observedFlowSlotInventoryValue as number,
    }),
});
export const run = tool.execute;
export default tool;
