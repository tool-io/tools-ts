import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerShadeAliases: readonly string[];
  readonly callerCanonicalShadeNames: readonly string[];
  readonly queryShadeName: string;
}>;
export type Output = Readonly<{ readonly canonicalCallerShadeName: string }>;
const inputFields = [
  {
    id: "callerShadeAliases",
    label: "Caller shade aliases",
    kind: "stringList",
  },
  {
    id: "callerCanonicalShadeNames",
    label: "Caller canonical shade names",
    kind: "stringList",
  },
  { id: "queryShadeName", label: "Query shade name", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    canonicalCallerShadeName: notice(
      input.callerShadeAliases,
      input.callerCanonicalShadeNames,
      input.queryShadeName,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShadeAliases: ["Grey green", "gray-green"],
  callerCanonicalShadeNames: ["gray-green", "gray-green"],
  queryShadeName: "Grey green",
} satisfies Input;
export const exampleOutput = {
  canonicalCallerShadeName: "gray-green",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/color-shade-name-normalizer",
  title: "Color Shade Chameleon Variation Name Normalizer",
  description:
    "Normalize exact independently verified catalogue shade aliases; no scanner color-to-issue identity inference. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "canonicalCallerShadeName",
      label: "Canonical caller shade name",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerShadeAliases: value.callerShadeAliases as readonly string[],
      callerCanonicalShadeNames:
        value.callerCanonicalShadeNames as readonly string[],
      queryShadeName: value.queryShadeName as string,
    }),
});
export const run = tool.execute;
export default tool;
