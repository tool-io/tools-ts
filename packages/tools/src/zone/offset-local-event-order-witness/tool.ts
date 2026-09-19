import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  utc: readonly number[];
  offsets: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "utc", label: "utc", kind: "numberList" },
  { id: "offsets", label: "offsets", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.utc.length === i.offsets.length &&
      i.utc.every((x) => Math.abs(x) <= 1e12) &&
      i.offsets.every((x) => Math.abs(x) <= 86400),
  );
  const local = i.utc.map((x, j) => x + i.offsets[j]);
  return H.finish({
    local,
    utcDescending: i.utc
      .slice(1)
      .flatMap((x, j) => (x < i.utc[j] ? [j + 1] : [])),
    localDescending: local
      .slice(1)
      .flatMap((x, j) => (x < local[j] ? [j + 1] : [])),
  });
};
export const example = {
  input: { utc: [19, 20], offsets: [2, 0] },
  output: {
    result: { local: [21, 20], utcDescending: [], localDescending: [1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "zone/offset-local-event-order-witness",
  title: "Time Zone Local Event Order Witness",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; retain UTC versus local-coordinate order witnesses from paired event offsets; no reordering or claim that fold observations are corrupt. ",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
