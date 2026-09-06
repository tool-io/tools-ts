import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integer,
  positiveCounts,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly submittedPageCount: number;
  readonly callerFrameCapacity: number;
}>;
export type Output = Readonly<{
  readonly signedCapacityMargin: number;
  readonly withinCallerCapacity: boolean;
}>;
const inputFields = [
  { id: "submittedPageCount", label: "Submitted page count", kind: "number" },
  { id: "callerFrameCapacity", label: "Caller frame capacity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.submittedPageCount, "submittedPageCount");
  integer(input.submittedPageCount, "pages");
  positiveCounts([input.callerFrameCapacity]);
  return {
    signedCapacityMargin: input.callerFrameCapacity - input.submittedPageCount,
    withinCallerCapacity: input.submittedPageCount <= input.callerFrameCapacity,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  submittedPageCount: 16,
  callerFrameCapacity: 16,
} satisfies Input;
export const exampleOutput = {
  signedCapacityMargin: 0,
  withinCallerCapacity: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/exhibition-frame-page-capacity-checker",
  title: "Exhibition Frame Page Capacity 16-Side Checker",
  description:
    "Check actual submitted pages against caller verified frame capacity;16is not assumed universally. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCapacityMargin",
      label: "Signed capacity margin",
      kind: "number",
    },
    {
      id: "withinCallerCapacity",
      label: "Within caller capacity",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      submittedPageCount: value.submittedPageCount as number,
      callerFrameCapacity: value.callerFrameCapacity as number,
    }),
});
export const run = tool.execute;
export default tool;
