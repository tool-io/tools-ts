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
  readonly callerVerifiedFrameCellInventoryKeys: readonly string[];
  readonly callerVerifiedFrameCellInventoryValues: readonly number[];
  readonly queryFrameCellInventoryKey: string;
  readonly observedFrameCellInventoryValue: number;
}>;
export type Output = Readonly<{
  readonly callerReferenceValue: number;
  readonly signedObservedMinusReference: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedFrameCellInventoryKeys",
    label: "Caller verified frame cell inventory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFrameCellInventoryValues",
    label: "Caller verified frame cell inventory values",
    kind: "numberList",
  },
  {
    id: "queryFrameCellInventoryKey",
    label: "Query frame cell inventory key",
    kind: "string",
  },
  {
    id: "observedFrameCellInventoryValue",
    label: "Observed frame cell inventory value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedFrameCellInventoryValues.forEach((v) =>
    nonnegative(v, "verified physical reference"),
  );
  nonnegative(input.observedFrameCellInventoryValue, "observed physical value");
  aligned(
    input.callerVerifiedFrameCellInventoryKeys,
    input.callerVerifiedFrameCellInventoryValues,
    "callerVerifiedFrameCellInventoryKeys",
  );
  const i = catalogIndex(
    input.callerVerifiedFrameCellInventoryKeys,
    input.queryFrameCellInventoryKey,
  );
  return {
    callerReferenceValue: input.callerVerifiedFrameCellInventoryValues[i],
    signedObservedMinusReference:
      input.observedFrameCellInventoryValue -
      input.callerVerifiedFrameCellInventoryValues[i],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFrameCellInventoryKeys: ["a", "b"],
  callerVerifiedFrameCellInventoryValues: [2, 4],
  queryFrameCellInventoryKey: "b",
  observedFrameCellInventoryValue: 5,
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
  id: "apiculture/brood-frame-cells-count-standard",
  title: "Brood Frame Cells Count Standard Lookup",
  description:
    "Caller independently verified frame model/face/cell-size actual total-cell inventory reference, not occupied-brood population estimate. Exact independently matched reference; signed deviations retained. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedFrameCellInventoryKeys:
        value.callerVerifiedFrameCellInventoryKeys as readonly string[],
      callerVerifiedFrameCellInventoryValues:
        value.callerVerifiedFrameCellInventoryValues as readonly number[],
      queryFrameCellInventoryKey: value.queryFrameCellInventoryKey as string,
      observedFrameCellInventoryValue:
        value.observedFrameCellInventoryValue as number,
    }),
});
export const run = tool.execute;
export default tool;
