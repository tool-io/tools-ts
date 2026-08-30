import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly drySolidTonnes: number;
  readonly waterTonnes: number;
}>;
export type Output = Readonly<{
  readonly solidMassPercent: number;
  readonly waterSolidMassRatio: number;
}>;
const inputFields = [
  { id: "drySolidTonnes", label: "Dry solid tonnes", kind: "number" },
  { id: "waterTonnes", label: "Water tonnes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.drySolidTonnes, "drySolidTonnes");
  nonnegative(input.waterTonnes, "waterTonnes");
  return {
    solidMassPercent:
      (100 * input.drySolidTonnes) / (input.drySolidTonnes + input.waterTonnes),
    waterSolidMassRatio: input.waterTonnes / input.drySolidTonnes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  drySolidTonnes: 40,
  waterTonnes: 60,
} satisfies Input;
export const exampleOutput = {
  solidMassPercent: 40,
  waterSolidMassRatio: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/solid-percentage-pulp",
  title: "Pulp Solid Percentage",
  description:
    "Express pulp solid mass percent and water/solid ratio from dry solid and water masses; not a volumetric solid fraction.",
  inputs: inputFields,
  outputs: [
    { id: "solidMassPercent", label: "Solid mass percent", kind: "number" },
    {
      id: "waterSolidMassRatio",
      label: "Water solid mass ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      drySolidTonnes: value.drySolidTonnes as number,
      waterTonnes: value.waterTonnes as number,
    }),
});
export const run = tool.execute;
export default tool;
