import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly observedText: string;
  readonly callerPrefix: string;
}>;
export type Output = Readonly<{ readonly controlNumberText: string }>;
const inputFields = [
  { id: "observedText", label: "Observed text", kind: "string" },
  { id: "callerPrefix", label: "Caller prefix", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.callerPrefix.trim() ||
    !input.observedText.startsWith(input.callerPrefix)
  )
    simpleError(
      "prefix",
      "Exact independently verified nonempty prefix required.",
    );
  const number = input.observedText.slice(input.callerPrefix.length);
  if (!/^[0-9]{1,32}$/.test(number))
    simpleError(
      "number",
      "1–32ASCIIdecimaldigits with leading zeros retained.",
    );
  return { controlNumberText: number };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedText: "A0012",
  callerPrefix: "A",
} satisfies Input;
export const exampleOutput = { controlNumberText: "0012" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/control-block-number-parser",
  title: "Control Block Cylinder Number Parser",
  description:
    "Parse caller prefix and exact decimal control number as text, without erasing leading zeros. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "controlNumberText", label: "Control number text", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      observedText: value.observedText as string,
      callerPrefix: value.callerPrefix as string,
    }),
});
export const run = tool.execute;
export default tool;
