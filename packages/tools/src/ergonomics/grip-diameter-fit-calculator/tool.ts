import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, sum, range } from "../shared.js";
export type Input = Readonly<{
  readonly measuredHandLengthsMm: readonly number[];
  readonly callerHandleToHandRatioBounds: readonly number[];
  readonly availableHandleDiameterMm: number;
}>;
export type Output = Readonly<{
  readonly subjectCompatibleDiameterBoundsMm: readonly (readonly number[])[];
  readonly subjectFitFlags: readonly number[];
  readonly observedSampleFitPercent: number;
}>;
const inputFields = [
  {
    id: "measuredHandLengthsMm",
    label: "Measured hand lengths mm",
    kind: "numberList",
  },
  {
    id: "callerHandleToHandRatioBounds",
    label: "Caller handle to hand ratio bounds",
    kind: "numberList",
  },
  {
    id: "availableHandleDiameterMm",
    label: "Available handle diameter mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredHandLengthsMm.forEach((v) =>
    positive(v, "measuredHandLengthsMm"),
  );
  positive(input.availableHandleDiameterMm, "availableHandleDiameterMm");
  range(input.callerHandleToHandRatioBounds, "ratioBounds");
  input.callerHandleToHandRatioBounds.forEach((v) => positive(v, "ratio"));
  if (!input.measuredHandLengthsMm.length)
    simpleError("hands", "Actual hand-length sample required.");
  const bounds = input.measuredHandLengthsMm.map((v) =>
      input.callerHandleToHandRatioBounds.map((r) => v * r),
    ),
    flags = bounds.map((r) =>
      input.availableHandleDiameterMm >= r[0] &&
      input.availableHandleDiameterMm <= r[1]
        ? 1
        : 0,
    );
  return {
    subjectCompatibleDiameterBoundsMm: bounds,
    subjectFitFlags: flags,
    observedSampleFitPercent: (100 * sum(flags)) / flags.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredHandLengthsMm: [160, 180, 200],
  callerHandleToHandRatioBounds: [0.18, 0.22],
  availableHandleDiameterMm: 36,
} satisfies Input;
export const exampleOutput = {
  subjectCompatibleDiameterBoundsMm: [
    [28.8, 35.2],
    [32.4, 39.6],
    [36, 44],
  ],
  subjectFitFlags: [0, 1, 1],
  observedSampleFitPercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/grip-diameter-fit-calculator",
  title:
    "Grip Diameter Cylindrical Handle Fit Calculator (5th-95th percentile)",
  description:
    "Audit cylindrical handle diameter against actual sampled hands and caller calibrated ratio band, retaining local exclusions; no invented anthropometric 5th/95th percentiles or safe grasp recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "subjectCompatibleDiameterBoundsMm",
      label: "Subject compatible diameter bounds mm",
      kind: "matrix",
    },
    { id: "subjectFitFlags", label: "Subject fit flags", kind: "numberList" },
    {
      id: "observedSampleFitPercent",
      label: "Observed sample fit percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredHandLengthsMm: value.measuredHandLengthsMm as readonly number[],
      callerHandleToHandRatioBounds:
        value.callerHandleToHandRatioBounds as readonly number[],
      availableHandleDiameterMm: value.availableHandleDiameterMm as number,
    }),
});
export const run = tool.execute;
export default tool;
