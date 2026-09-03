import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly resize: string }>;
export type Output = Readonly<{ readonly meaning: string }>;
const inputFields = [
  { id: "resize", label: "Resize", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    meaning: pick(
      input.resize,
      {
        none: "neither user resize axis",
        both: "horizontal and vertical physical axes",
        horizontal: "horizontal physical axis",
        vertical: "vertical physical axis",
        block: "logical block axis",
        inline: "logical inline axis",
      },
      "resize",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { resize: "both" } satisfies Input;
export const exampleOutput = {
  meaning: "horizontal and vertical physical axes",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/resize-axes-both-horizontal-vertical",
  title: "resize Both Axes Horizontal/Vertical",
  description:
    "Supported resize axes; element eligibility, overflow and browser UI independently established. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "meaning", label: "Meaning", kind: "string" }],
  calculate: (value) => calculate({ resize: value.resize as string }),
});
export const run = tool.execute;
export default tool;
