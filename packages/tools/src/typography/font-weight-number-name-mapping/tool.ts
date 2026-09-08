import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch41-shared.js";
export type Input = Readonly<{ readonly cssNominalWeight: number }>;
export type Output = Readonly<{ readonly conventionalWeightName: string }>;
const inputFields = [
  { id: "cssNominalWeight", label: "Css nominal weight", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    conventionalWeightName: pick(
      String(input.cssNominalWeight),
      {
        "100": "thin",
        "200": "extra-light",
        "300": "light",
        "400": "normal",
        "500": "medium",
        "600": "semi-bold",
        "700": "bold",
        "800": "extra-bold",
        "900": "black",
      },
      "nominalweight",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { cssNominalWeight: 600 } satisfies Input;
export const exampleOutput = {
  conventionalWeightName: "semi-bold",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/font-weight-number-name-mapping",
  title: "Font Weight Number-Name Mapping",
  description:
    "Conventional named 100..900 CSS weight mapping, not available font face/variable in stance or perceived stroke weight; other CSS numeric weights are not invalid CSS but outside this lookup. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conventionalWeightName",
      label: "Conventional weight name",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({ cssNominalWeight: value.cssNominalWeight as number }),
});
export const run = tool.execute;
export default tool;
