import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRoomLeftWallOffsetsM: readonly number[];
  readonly observedRoomRightWallOffsetsM: readonly number[];
  readonly observedIndependentPlannedWidthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRoomClearWidthsM: readonly number[];
  readonly signedRoomWidthDeviationsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRoomLeftWallOffsetsM",
    label: "Observed room left wall offsets m",
    kind: "numberList",
  },
  {
    id: "observedRoomRightWallOffsetsM",
    label: "Observed room right wall offsets m",
    kind: "numberList",
  },
  {
    id: "observedIndependentPlannedWidthsM",
    label: "Observed independent planned widths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIndependentPlannedWidthsM.forEach((v) =>
    nonnegative(v, "observedIndependentPlannedWidthsM"),
  );
  aligned(
    input.observedRoomLeftWallOffsetsM,
    input.observedRoomRightWallOffsetsM,
    "observedRoomLeftWallOffsetsM",
  );
  aligned(
    input.observedRoomLeftWallOffsetsM,
    input.observedIndependentPlannedWidthsM,
    "observedRoomLeftWallOffsetsM",
  );
  const width = input.observedRoomLeftWallOffsetsM.map((v, i) => {
    const w = input.observedRoomRightWallOffsetsM[i] - v;
    nonnegative(w, "room width");
    return w;
  });
  return {
    observedRoomClearWidthsM: width,
    signedRoomWidthDeviationsM: width.map(
      (v, i) => v - input.observedIndependentPlannedWidthsM[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoomLeftWallOffsetsM: [1, 2],
  observedRoomRightWallOffsetsM: [4, 6],
  observedIndependentPlannedWidthsM: [3, 3],
} satisfies Input;
export const exampleOutput = {
  observedRoomClearWidthsM: [3, 4],
  signedRoomWidthDeviationsM: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/room-width",
  title: "Room Width Calculator",
  description:
    "Audit actual paired room-wall same-datum survey widths against independent marks, not geometry-derived support or prescribed room span. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRoomClearWidthsM",
      label: "Observed room clear widths m",
      kind: "numberList",
    },
    {
      id: "signedRoomWidthDeviationsM",
      label: "Signed room width deviations m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoomLeftWallOffsetsM:
        value.observedRoomLeftWallOffsetsM as readonly number[],
      observedRoomRightWallOffsetsM:
        value.observedRoomRightWallOffsetsM as readonly number[],
      observedIndependentPlannedWidthsM:
        value.observedIndependentPlannedWidthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
