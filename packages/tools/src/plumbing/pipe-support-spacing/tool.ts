import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  strictlyIncreasing,
  catalog,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerPipeAssemblyIds: readonly string[];
  readonly callerVerifiedMatchedSupportSpacingM: readonly number[];
  readonly queryPipeAssemblyId: string;
  readonly observedSupportStationsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSupportGapsM: readonly number[];
  readonly supportBaysBeyondCallerVerifiedSpacing: readonly number[];
}>;
const inputFields = [
  {
    id: "callerPipeAssemblyIds",
    label: "Caller pipe assembly ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMatchedSupportSpacingM",
    label: "Caller verified matched support spacing m",
    kind: "numberList",
  },
  {
    id: "queryPipeAssemblyId",
    label: "Query pipe assembly id",
    kind: "string",
  },
  {
    id: "observedSupportStationsM",
    label: "Observed support stations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedMatchedSupportSpacingM.forEach((v) =>
    positive(v, "callerVerifiedMatchedSupportSpacingM"),
  );
  const max = catalog(
    input.callerPipeAssemblyIds,
    input.callerVerifiedMatchedSupportSpacingM,
    input.queryPipeAssemblyId,
  );
  positive(max, "span");
  strictlyIncreasing(input.observedSupportStationsM, "supports");
  const spans = input.observedSupportStationsM
    .slice(1)
    .map((v, i) => v - input.observedSupportStationsM[i]);
  return {
    observedSupportGapsM: spans,
    supportBaysBeyondCallerVerifiedSpacing: spans.flatMap((v, i) =>
      v > max ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPipeAssemblyIds: ["a", "b"],
  callerVerifiedMatchedSupportSpacingM: [2, 3],
  queryPipeAssemblyId: "a",
  observedSupportStationsM: [0, 1, 3.5],
} satisfies Input;
export const exampleOutput = {
  observedSupportGapsM: [1, 2.5],
  supportBaysBeyondCallerVerifiedSpacing: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-support-spacing",
  title: "Plumbing Pipe Support Spacing Calculator",
  description:
    "Audit actual support-station bays against independently verified matched pipe/fluid/temperature support spacing; not uniform hanger-count division or structural/code approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSupportGapsM",
      label: "Observed support gaps m",
      kind: "numberList",
    },
    {
      id: "supportBaysBeyondCallerVerifiedSpacing",
      label: "Support bays beyond caller verified spacing",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPipeAssemblyIds: value.callerPipeAssemblyIds as readonly string[],
      callerVerifiedMatchedSupportSpacingM:
        value.callerVerifiedMatchedSupportSpacingM as readonly number[],
      queryPipeAssemblyId: value.queryPipeAssemblyId as string,
      observedSupportStationsM:
        value.observedSupportStationsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
