import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly incomingPhosphorusKg: number;
  readonly outgoingPhosphorusKg: number;
  readonly waterColumnStorageChangeKg: number;
}>;
export type Output = Readonly<{
  readonly apparentSedimentRetentionKg: number;
  readonly storageCorrectedRetentionFraction: number;
}>;
const inputFields = [
  {
    id: "incomingPhosphorusKg",
    label: "Incoming phosphorus kg",
    kind: "number",
  },
  {
    id: "outgoingPhosphorusKg",
    label: "Outgoing phosphorus kg",
    kind: "number",
  },
  {
    id: "waterColumnStorageChangeKg",
    label: "Water column storage change kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.incomingPhosphorusKg, "incomingPhosphorusKg");
  nonnegative(input.outgoingPhosphorusKg, "outgoingPhosphorusKg");
  const apparentSedimentRetentionKg =
    input.incomingPhosphorusKg -
    input.outgoingPhosphorusKg -
    input.waterColumnStorageChangeKg;
  return {
    apparentSedimentRetentionKg,
    storageCorrectedRetentionFraction:
      apparentSedimentRetentionKg / input.incomingPhosphorusKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  incomingPhosphorusKg: 100,
  outgoingPhosphorusKg: 40,
  waterColumnStorageChangeKg: 10,
} satisfies Input;
export const exampleOutput = {
  apparentSedimentRetentionKg: 50,
  storageCorrectedRetentionFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/phosphorus-retention-coefficient",
  title: "Phosphorus Retention Coefficient",
  description:
    "Close matched phosphorus inflow/outflow/storage budget to apparent retention; negative retention or ratios above one expose unmodeled exchange and are not clamped.",
  inputs: inputFields,
  outputs: [
    {
      id: "apparentSedimentRetentionKg",
      label: "Apparent sediment retention kg",
      kind: "number",
    },
    {
      id: "storageCorrectedRetentionFraction",
      label: "Storage corrected retention fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      incomingPhosphorusKg: value.incomingPhosphorusKg as number,
      outgoingPhosphorusKg: value.outgoingPhosphorusKg as number,
      waterColumnStorageChangeKg: value.waterColumnStorageChangeKg as number,
    }),
});
export const run = tool.execute;
export default tool;
