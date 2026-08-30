import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly donorFrameIds: readonly number[];
  readonly frameClassIds: readonly number[];
  readonly requestedCountsByClass: readonly number[];
  readonly recipientSlotCapacity: number;
}>;
export type Output = Readonly<{
  readonly transferredFrameIds: readonly number[];
  readonly retainedFrameIds: readonly number[];
}>;
const inputFields = [
  { id: "donorFrameIds", label: "Donor frame ids", kind: "numberList" },
  { id: "frameClassIds", label: "Frame class ids", kind: "numberList" },
  {
    id: "requestedCountsByClass",
    label: "Requested counts by class",
    kind: "numberList",
  },
  {
    id: "recipientSlotCapacity",
    label: "Recipient slot capacity",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.donorFrameIds.forEach((v) => count(v, "donorFrameIds"));
  input.frameClassIds.forEach((v) => count(v, "frameClassIds"));
  input.requestedCountsByClass.forEach((v) =>
    count(v, "requestedCountsByClass"),
  );
  count(input.recipientSlotCapacity, "recipientSlotCapacity");
  aligned(input.donorFrameIds, input.frameClassIds, "donorFrameIds");
  if (
    input.requestedCountsByClass.length > 128 ||
    !input.requestedCountsByClass.length ||
    new Set(input.donorFrameIds).size !== input.donorFrameIds.length
  )
    simpleError(
      "donorFrameIds",
      "Unique donor IDs and 1–128 requested classes required.",
    );
  if (
    input.requestedCountsByClass.reduce((a, b) => a + b, 0) >
    input.recipientSlotCapacity
  )
    simpleError(
      "recipientSlotCapacity",
      "Requested frames exceed recipient slots.",
    );
  const need = [...input.requestedCountsByClass],
    transferredFrameIds: number[] = [],
    retainedFrameIds: number[] = [];
  input.donorFrameIds.forEach((id, i) => {
    const c = input.frameClassIds[i];
    if (c < 1 || c > need.length)
      simpleError(
        "frameClassIds",
        "Class IDs must index the request policy from one.",
      );
    if (need[c - 1] > 0) {
      need[c - 1]--;
      transferredFrameIds.push(id);
    } else retainedFrameIds.push(id);
  });
  if (need.some((v) => v > 0))
    simpleError(
      "requestedCountsByClass",
      "Donor inventory cannot satisfy the requested classes.",
    );
  return { transferredFrameIds, retainedFrameIds };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  donorFrameIds: [10, 20, 30, 40],
  frameClassIds: [1, 2, 2, 3],
  requestedCountsByClass: [1, 1, 1],
  recipientSlotCapacity: 3,
} satisfies Input;
export const exampleOutput = {
  transferredFrameIds: [10, 20, 40],
  retainedFrameIds: [30],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/nuc-frames-transfer-plan-5frame",
  title: "Nuc Frames Transfer Plan 5Frame Guide",
  description:
    "Plan a nuc frame transfer against caller class requests and slots, taking donor order as explicit priority; no fixed five-frame recipe, queen relocation or actual hive modification.",
  inputs: inputFields,
  outputs: [
    {
      id: "transferredFrameIds",
      label: "Transferred frame ids",
      kind: "numberList",
    },
    { id: "retainedFrameIds", label: "Retained frame ids", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      donorFrameIds: value.donorFrameIds as readonly number[],
      frameClassIds: value.frameClassIds as readonly number[],
      requestedCountsByClass: value.requestedCountsByClass as readonly number[],
      recipientSlotCapacity: value.recipientSlotCapacity as number,
    }),
});
export const run = tool.execute;
export default tool;
