import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerFiscalPunchReuseClassIds: readonly string[];
  readonly callerFiscalPunchReuseRequirements: readonly (readonly number[])[];
  readonly observedFiscalPunchReuseEvidence: readonly number[];
  readonly knownFiscalPunchReuseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFiscalPunchReuseClassIds",
    label: "Caller fiscal punch reuse class ids",
    kind: "stringList",
  },
  {
    id: "callerFiscalPunchReuseRequirements",
    label: "Caller fiscal punch reuse requirements",
    kind: "matrix",
  },
  {
    id: "observedFiscalPunchReuseEvidence",
    label: "Observed fiscal punch reuse evidence",
    kind: "numberList",
  },
  {
    id: "knownFiscalPunchReuseFlags",
    label: "Known fiscal punch reuse flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerFiscalPunchReuseClassIds,
    input.callerFiscalPunchReuseRequirements,
    input.observedFiscalPunchReuseEvidence,
    input.knownFiscalPunchReuseFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFiscalPunchReuseClassIds: ["a", "b"],
  callerFiscalPunchReuseRequirements: [
    [1, 0],
    [0, 1],
  ],
  observedFiscalPunchReuseEvidence: [1, 0],
  knownFiscalPunchReuseFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/postal-fiscal-reuse-flag-checker",
  title: "Postal Fiscal Reuse Bifurcated Punch Flag Checker",
  description:
    "Compare recorded bifurcated-punch and reuse evidence, not a legal postal validity decision. Independently established positive evidence requirements; overlapping compatible classes and unknowns retained. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFiscalPunchReuseClassIds:
        value.callerFiscalPunchReuseClassIds as readonly string[],
      callerFiscalPunchReuseRequirements:
        value.callerFiscalPunchReuseRequirements as readonly (readonly number[])[],
      observedFiscalPunchReuseEvidence:
        value.observedFiscalPunchReuseEvidence as readonly number[],
      knownFiscalPunchReuseFlags:
        value.knownFiscalPunchReuseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
