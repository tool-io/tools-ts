import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly featurePolicy: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "featurePolicy", label: "Feature policy", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.featurePolicy,
      {
        "standard-on": '"liga" 1, "clig" 1',
        "standard-off": '"liga" 0, "clig" 0',
        "discretionary-on": '"dlig" 1',
        "discretionary-off": '"dlig" 0',
      },
      "featurePolicy",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { featurePolicy: "standard-off" } satisfies Input;
export const exampleOutput = { meaning: '"liga" 0, "clig" 0' } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/font-feature-settings-ligatures-toggle",
  title: "font-feature-settings Ligatures Toggle",
  description:
    "Generate bounded OpenType feature value fragment, not declaration injection or guarantee that a font contains/uses the feature. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) =>
    calculate({ featurePolicy: value.featurePolicy as string }),
});
export const run = tool.execute;
export default tool;
