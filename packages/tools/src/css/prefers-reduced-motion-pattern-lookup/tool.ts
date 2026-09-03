import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly motionPreference: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "motionPreference", label: "Motion preference", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.motionPreference,
      {
        reduce: "@media (prefers-reduced-motion: reduce)",
        "no-preference": "@media (prefers-reduced-motion: no-preference)",
      },
      "motionPreference",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { motionPreference: "reduce" } satisfies Input;
export const exampleOutput = {
  meaning: "@media (prefers-reduced-motion: reduce)",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/prefers-reduced-motion-pattern-lookup",
  title: "prefers-reduced-motion Adjustment Pattern",
  description:
    "Generate preference query without disabling necessary information or imposing a zero-duration policy. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ motionPreference: value.motionPreference as string }),
});
export const run = tool.execute;
export default tool;
