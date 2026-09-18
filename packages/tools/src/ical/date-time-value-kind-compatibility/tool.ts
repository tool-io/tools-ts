import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  startKind: string;
  endKind: string;
  startZone: string;
  endZone: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startKind", label: "startKind", kind: "string" },
  { id: "endKind", label: "endKind", kind: "string" },
  { id: "startZone", label: "startZone", kind: "string" },
  { id: "endZone", label: "endZone", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    ["date", "floating", "utc", "zoned"].includes(i.startKind) &&
      ["date", "floating", "utc", "zoned"].includes(i.endKind),
  );
  if (i.startKind === "zoned") H.check(i.startZone.length > 0);
  if (i.endKind === "zoned") H.check(i.endZone.length > 0);
  return H.finish({
    compatible:
      i.startKind === i.endKind &&
      (i.startKind !== "zoned" || i.startZone === i.endZone),
  });
};
export const example = {
  input: { startKind: "date", endKind: "utc", startZone: "", endZone: "" },
  output: { result: { compatible: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ical/date-time-value-kind-compatibility",
  title: "iCalendar Date Time Value Kind Compatibility",
  description:
    "Check explicit date/floating/UTC/zoned value-kind compatibility and exact zone-label agreement; not zone equivalence, chronology or complete iCalendar component validation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
