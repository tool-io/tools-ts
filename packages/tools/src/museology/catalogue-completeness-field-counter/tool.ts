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
  shape,
  binary,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly recordFieldPresenceMatrix: readonly (readonly number[])[];
  readonly callerRequiredFieldFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredFieldCountsPerRecord: readonly number[];
  readonly requiredCompletenessPercentPerRecord: readonly number[];
  readonly fullyCompleteRecordCount: number;
}>;
const inputFields = [
  {
    id: "recordFieldPresenceMatrix",
    label: "Record field presence matrix",
    kind: "matrix",
  },
  {
    id: "callerRequiredFieldFlags",
    label: "Caller required field flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.recordFieldPresenceMatrix, "records") !==
    input.callerRequiredFieldFlags.length
  )
    simpleError("fields", "Aligned required field columns required.");
  binary(input.callerRequiredFieldFlags, "required");
  const n = positive(sum(input.callerRequiredFieldFlags), "requiredFields");
  input.recordFieldPresenceMatrix.forEach((r) => binary(r, "presence"));
  const counts = input.recordFieldPresenceMatrix.map((r) =>
    r.reduce((s, v, i) => s + v * input.callerRequiredFieldFlags[i], 0),
  );
  return {
    requiredFieldCountsPerRecord: counts,
    requiredCompletenessPercentPerRecord: counts.map((v) => (100 * v) / n),
    fullyCompleteRecordCount: counts.filter((v) => v === n).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  recordFieldPresenceMatrix: [
    [1, 0, 1],
    [1, 1, 1],
  ],
  callerRequiredFieldFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  requiredFieldCountsPerRecord: [1, 2],
  requiredCompletenessPercentPerRecord: [50, 100],
  fullyCompleteRecordCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/catalogue-completeness-field-counter",
  title: "Catalogue Record Completeness Field Counter",
  description:
    "Audit caller-required catalogue fields across aligned records, distinguishing complete records from pooled field coverage; actual schema/presence criteria are caller established.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredFieldCountsPerRecord",
      label: "Required field counts per record",
      kind: "numberList",
    },
    {
      id: "requiredCompletenessPercentPerRecord",
      label: "Required completeness percent per record",
      kind: "numberList",
    },
    {
      id: "fullyCompleteRecordCount",
      label: "Fully complete record count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      recordFieldPresenceMatrix:
        value.recordFieldPresenceMatrix as readonly (readonly number[])[],
      callerRequiredFieldFlags:
        value.callerRequiredFieldFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
