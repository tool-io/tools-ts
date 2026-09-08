import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCollectionNamespace: string;
  readonly callerConfirmedUnusedStartingNumber: number;
  readonly actualUnnumberedNegativeIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCollectionNamespace",
    label: "Caller collection namespace",
    kind: "string",
  },
  {
    id: "callerConfirmedUnusedStartingNumber",
    label: "Caller confirmed unused starting number",
    kind: "number",
  },
  {
    id: "actualUnnumberedNegativeIds",
    label: "Actual unnumbered negative ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(input.callerCollectionNamespace))
    simpleError("namespace", "Explicit restricted collection namespace.");
  bounded(input.callerConfirmedUnusedStartingNumber, "start", 1, 1000000000);
  unique(input.actualUnnumberedNegativeIds, "negatives");
  return {
    assignedNegativeNumbers: input.actualUnnumberedNegativeIds.map(
      (_, i) =>
        input.callerCollectionNamespace +
        "-" +
        (input.callerConfirmedUnusedStartingNumber + i),
    ),
    originalCallerNegativeIds: input.actualUnnumberedNegativeIds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCollectionNamespace: "NEG",
    callerConfirmedUnusedStartingNumber: 1,
    actualUnnumberedNegativeIds: ["a", "b"],
  },
  output: {
    result: {
      assignedNegativeNumbers: ["NEG-1", "NEG-2"],
      originalCallerNegativeIds: ["a", "b"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/negative-number-sequencer",
  title: "Negative Enclosure Number Assignment Sequencer",
  description:
    "Sequence actual independently identified unnumbered negatives with caller confirmed unused namespace/start. No database mutation, global collision guarantee or physical relabelling; preserve original IDsand caller order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
