import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyComputedFemaleHdi: number;
  readonly independentlyComputedMaleHdi: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyComputedFemaleHdi",
    label: "Independently computed female hdi",
    kind: "number",
  },
  {
    id: "independentlyComputedMaleHdi",
    label: "Independently computed male hdi",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.independentlyComputedFemaleHdi, "femaleHDI");
  fraction(input.independentlyComputedMaleHdi, "maleHDI");
  positive(input.independentlyComputedMaleHdi, "maleHDI");
  return {
    conditionalGdi:
      input.independentlyComputedFemaleHdi / input.independentlyComputedMaleHdi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyComputedFemaleHdi: 0.8,
    independentlyComputedMaleHdi: 0.9,
  },
  output: { result: { conditionalGdi: 0.8888888888888888 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/gender-development-index",
  title: "Gender Development Index Calculator",
  description:
    "Ratio of independently computed matched female/male HDIcomponents under one verified edition. Census categories do not infer individual gender or equal opportunities.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
