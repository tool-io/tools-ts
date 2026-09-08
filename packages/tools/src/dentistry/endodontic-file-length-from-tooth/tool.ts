import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedToothReferenceLengthMm: number;
  readonly callerClinicianEstablishedApicalOffsetMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyEstablishedToothReferenceLengthMm",
    label: "Independently established tooth reference length mm",
    kind: "number",
  },
  {
    id: "callerClinicianEstablishedApicalOffsetMm",
    label: "Caller clinician established apical offset mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyEstablishedToothReferenceLengthMm, "reference");
  nonnegative(input.callerClinicianEstablishedApicalOffsetMm, "offset");
  if (
    input.callerClinicianEstablishedApicalOffsetMm >
    input.independentlyEstablishedToothReferenceLengthMm
  )
    simpleError(
      "length",
      "Caller offset cannot exceed actual reference length.",
    );
  return {
    conditionalCallerWorkingReferenceLengthMm:
      input.independentlyEstablishedToothReferenceLengthMm -
      input.callerClinicianEstablishedApicalOffsetMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedToothReferenceLengthMm: 22,
    callerClinicianEstablishedApicalOffsetMm: 1,
  },
  output: { result: { conditionalCallerWorkingReferenceLengthMm: 21 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/endodontic-file-length-from-tooth",
  title: "Endo File Length From Tooth Calculator",
  description:
    "Independent tooth-reference length minus independently clinician-established apical offset. Not infer apex anatomy, choose an endodontic file length or authorize instrumentation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
