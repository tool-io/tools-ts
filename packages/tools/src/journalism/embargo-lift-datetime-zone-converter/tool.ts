import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, utcStamp } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerEmbargoUtc: string;
  readonly callerTargetFixedOffsetMinutes: number;
}>;
export type Output = Readonly<{
  readonly fixedOffsetLocalEmbargo: string;
  readonly explicitOffset: string;
}>;
const inputFields = [
  { id: "callerEmbargoUtc", label: "Caller embargo utc", kind: "string" },
  {
    id: "callerTargetFixedOffsetMinutes",
    label: "Caller target fixed offset minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerTargetFixedOffsetMinutes, "UTC offsetminutes", -840, 840);
  const t =
      utcStamp(input.callerEmbargoUtc) +
      input.callerTargetFixedOffsetMinutes * 60000,
    local = new Date(t).toISOString().slice(0, 19);
  if (!/^\d{4}-/.test(local)) simpleError("date", "Fourdigityearresult.");
  const o = input.callerTargetFixedOffsetMinutes;
  return {
    fixedOffsetLocalEmbargo: local,
    explicitOffset:
      (o < 0 ? "-" : "+") +
      String(Math.floor(Math.abs(o) / 60)).padStart(2, "0") +
      ":" +
      String(Math.abs(o) % 60).padStart(2, "0"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEmbargoUtc: "2026-01-01T23:30:00Z",
  callerTargetFixedOffsetMinutes: 120,
} satisfies Input;
export const exampleOutput = {
  fixedOffsetLocalEmbargo: "2026-01-02T01:30:00",
  explicitOffset: "+02:00",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/embargo-lift-datetime-zone-converter",
  title: "Embargo Lift Datetime Zone Converter",
  description:
    "Exact UTC instant to independently established fixed offset representation; no IANA zone/DST inference or editorial embargo authorization. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "fixedOffsetLocalEmbargo",
      label: "Fixed offset local embargo",
      kind: "string",
    },
    { id: "explicitOffset", label: "Explicit offset", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      callerEmbargoUtc: value.callerEmbargoUtc as string,
      callerTargetFixedOffsetMinutes:
        value.callerTargetFixedOffsetMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
