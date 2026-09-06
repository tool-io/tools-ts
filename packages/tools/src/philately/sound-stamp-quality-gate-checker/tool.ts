import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, binary } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly knownFaultFlags: readonly number[];
  readonly inspectionKnownFlags: readonly number[];
}>;
export type Output = Readonly<{ readonly status: string }>;
const inputFields = [
  { id: "knownFaultFlags", label: "Known fault flags", kind: "numberList" },
  {
    id: "inspectionKnownFlags",
    label: "Inspection known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.knownFaultFlags, input.inspectionKnownFlags, "inspection");
  binary(input.knownFaultFlags, "faults");
  binary(input.inspectionKnownFlags, "known");
  return {
    status: input.knownFaultFlags.some(
      (v, i) => v && input.inspectionKnownFlags[i],
    )
      ? "observed-fault"
      : input.inspectionKnownFlags.every(Boolean)
        ? "no-observed-fault"
        : "unknown",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  knownFaultFlags: [0, 0, 1],
  inspectionKnownFlags: [1, 0, 0],
} satisfies Input;
export const exampleOutput = { status: "unknown" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/sound-stamp-quality-gate-checker",
  title: "Sound Stamp Binary Quality Gate Checker",
  description:
    "Separate recorded fault-free inspection from missing inspection; zero flags alone do not prove soundness. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [{ id: "status", label: "Status", kind: "string" }],
  calculate: (value) =>
    calculate({
      knownFaultFlags: value.knownFaultFlags as readonly number[],
      inspectionKnownFlags: value.inspectionKnownFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
