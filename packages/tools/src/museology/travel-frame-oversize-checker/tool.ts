import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly frameOuterDimensionsCm: readonly number[];
  readonly protectiveAllowancePerFaceCm: number;
  readonly callerMaximumTransportDimensionsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledPackedDimensionsCm: readonly number[];
  readonly oversizeDimensionFlags: readonly number[];
  readonly anyCallerDimensionExceeded: boolean;
}>;
const inputFields = [
  {
    id: "frameOuterDimensionsCm",
    label: "Frame outer dimensions cm",
    kind: "numberList",
  },
  {
    id: "protectiveAllowancePerFaceCm",
    label: "Protective allowance per face cm",
    kind: "number",
  },
  {
    id: "callerMaximumTransportDimensionsCm",
    label: "Caller maximum transport dimensions cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.frameOuterDimensionsCm.forEach((v) =>
    positive(v, "frameOuterDimensionsCm"),
  );
  input.callerMaximumTransportDimensionsCm.forEach((v) =>
    positive(v, "callerMaximumTransportDimensionsCm"),
  );
  nonnegative(
    input.protectiveAllowancePerFaceCm,
    "protectiveAllowancePerFaceCm",
  );
  if (
    input.frameOuterDimensionsCm.length !== 3 ||
    input.callerMaximumTransportDimensionsCm.length !== 3
  )
    simpleError(
      "dimensions",
      "Three correspondence-aligned dimensions required.",
    );
  const d = input.frameOuterDimensionsCm.map(
      (v) => v + 2 * input.protectiveAllowancePerFaceCm,
    ),
    f = d.map((v, i) =>
      v > input.callerMaximumTransportDimensionsCm[i] ? 1 : 0,
    );
  return {
    modeledPackedDimensionsCm: d,
    oversizeDimensionFlags: f,
    anyCallerDimensionExceeded: f.some((v) => v === 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  frameOuterDimensionsCm: [100, 80, 10],
  protectiveAllowancePerFaceCm: 5,
  callerMaximumTransportDimensionsCm: [105, 100, 30],
} satisfies Input;
export const exampleOutput = {
  modeledPackedDimensionsCm: [110, 90, 20],
  oversizeDimensionFlags: [1, 0, 0],
  anyCallerDimensionExceeded: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/travel-frame-oversize-checker",
  title: "Travel Frame Size Oversize Surcharge Trigger Checker",
  description:
    "Compare packed outer frame dimensions including both face allowances with caller declared transport axis limits; no implicit axis rotation, shipping surcharge amount or safe packaging approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPackedDimensionsCm",
      label: "Modeled packed dimensions cm",
      kind: "numberList",
    },
    {
      id: "oversizeDimensionFlags",
      label: "Oversize dimension flags",
      kind: "numberList",
    },
    {
      id: "anyCallerDimensionExceeded",
      label: "Any caller dimension exceeded",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      frameOuterDimensionsCm: value.frameOuterDimensionsCm as readonly number[],
      protectiveAllowancePerFaceCm:
        value.protectiveAllowancePerFaceCm as number,
      callerMaximumTransportDimensionsCm:
        value.callerMaximumTransportDimensionsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
