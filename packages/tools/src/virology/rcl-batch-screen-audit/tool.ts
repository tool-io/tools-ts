import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly requiredTests: readonly string[];
  readonly performedTests: readonly string[];
  readonly negativeFlags: readonly number[];
  readonly validControlFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingTests: readonly string[];
  readonly invalidTests: readonly string[];
  readonly positiveTests: readonly string[];
  readonly allRequiredValidNegative: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.performedTests, input.negativeFlags, "performedTests");
  aligned(input.performedTests, input.validControlFlags, "performedTests");
  if (
    !input.requiredTests.length ||
    new Set(input.requiredTests).size !== input.requiredTests.length ||
    new Set(input.performedTests).size !== input.performedTests.length ||
    [...input.negativeFlags, ...input.validControlFlags].some(
      (v) => v !== 0 && v !== 1,
    )
  )
    simpleError(
      "requiredTests",
      "Distinct required and performed tests with binary result/control flags required.",
    );
  const performed = new Set(input.performedTests),
    missingTests = input.requiredTests.filter((v) => !performed.has(v)),
    invalidTests = input.performedTests.filter(
      (_, i) => input.validControlFlags[i] === 0,
    ),
    positiveTests = input.performedTests.filter(
      (_, i) => input.negativeFlags[i] === 0,
    );
  return {
    missingTests,
    invalidTests,
    positiveTests,
    allRequiredValidNegative:
      missingTests.length === 0 &&
      invalidTests.length === 0 &&
      positiveTests.length === 0,
  };
};
export const exampleInput = {
  requiredTests: ["PCR", "culture"],
  performedTests: ["PCR", "culture"],
  negativeFlags: [1, 1],
  validControlFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  missingTests: [],
  invalidTests: [],
  positiveTests: [],
  allRequiredValidNegative: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/rcl-batch-screen-audit",
  title: "RCL Batch Screen Audit",
  description:
    "Audit completeness, controls, and negative results for caller-defined replication-competent lentivirus screens; not regulatory lot release.",
  inputs: [
    { id: "requiredTests", label: "Required tests", kind: "stringList" },
    { id: "performedTests", label: "Performed tests", kind: "stringList" },
    { id: "negativeFlags", label: "Negative flags", kind: "numberList" },
    {
      id: "validControlFlags",
      label: "Valid control flags",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "missingTests", label: "Missing tests", kind: "stringList" },
    { id: "invalidTests", label: "Invalid tests", kind: "stringList" },
    { id: "positiveTests", label: "Positive tests", kind: "stringList" },
    {
      id: "allRequiredValidNegative",
      label: "All required valid negative",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredTests: value.requiredTests as readonly string[],
      performedTests: value.performedTests as readonly string[],
      negativeFlags: value.negativeFlags as readonly number[],
      validControlFlags: value.validControlFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
