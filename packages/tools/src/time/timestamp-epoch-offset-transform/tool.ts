import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  timestamp: string;
  sourceEpoch: string;
  targetEpoch: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "timestamp", kind: "string", label: "timestamp" },
  { id: "sourceEpoch", kind: "string", label: "sourceEpoch" },
  { id: "targetEpoch", kind: "string", label: "targetEpoch" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    timestamp: String(
      H.bigint(i.timestamp) + H.bigint(i.sourceEpoch) - H.bigint(i.targetEpoch),
    ),
  });
};
export const example = {
  input: { timestamp: "10", sourceEpoch: "100", targetEpoch: "50" },
  output: { result: { timestamp: "60" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/timestamp-epoch-offset-transform",
  title: "Timestamp Epoch Offset Transform",
  description:
    "Translate integer timestamps between explicitly supplied epoch origins expressed in the same units; no calendar or leap-second conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
