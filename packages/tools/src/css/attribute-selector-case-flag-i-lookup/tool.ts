import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedAttributeValue: string;
  readonly selectorExpectedValue: string;
  readonly caseFlag: string;
}>;
export type Output = Readonly<{ readonly matchesEqualitySelector: boolean }>;
const inputFields = [
  {
    id: "observedAttributeValue",
    label: "Observed attribute value",
    kind: "string",
  },
  {
    id: "selectorExpectedValue",
    label: "Selector expected value",
    kind: "string",
  },
  { id: "caseFlag", label: "Case flag", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.caseFlag !== "i" && input.caseFlag !== "s")
    simpleError("flag", "Explicit i or s equality flag.");
  const fold = (s: string) => s.replace(/[A-Z]/g, (c) => c.toLowerCase());
  return {
    matchesEqualitySelector:
      input.caseFlag === "i"
        ? fold(input.observedAttributeValue) ===
          fold(input.selectorExpectedValue)
        : input.observedAttributeValue === input.selectorExpectedValue,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAttributeValue: "FOO",
  selectorExpectedValue: "foo",
  caseFlag: "i",
} satisfies Input;
export const exampleOutput = { matchesEqualitySelector: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/attribute-selector-case-flag-i-lookup",
  title: "Attribute Selector case Flag [i] Lookup",
  description:
    "Attribute equality i uses ASCII case-insensitive comparison only, s forces case-sensitive; no Unicode case folding or default HTML attribute context. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchesEqualitySelector",
      label: "Matches equality selector",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAttributeValue: value.observedAttributeValue as string,
      selectorExpectedValue: value.selectorExpectedValue as string,
      caseFlag: value.caseFlag as string,
    }),
});
export const run = tool.execute;
export default tool;
