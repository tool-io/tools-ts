import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly silicaMassPercent: number;
  readonly sodaMassPercent: number;
  readonly limeMassPercent: number;
  readonly otherMassPercent: number;
  readonly silicaMolarMass: number;
  readonly sodaMolarMass: number;
  readonly limeMolarMass: number;
}>;
export type Output = Readonly<{
  readonly sodaSilicaMolarRatio: number;
  readonly limeSilicaMolarRatio: number;
  readonly reportedTotalMassPercent: number;
}>;
const inputFields = [
  { id: "silicaMassPercent", label: "Silica mass percent", kind: "number" },
  { id: "sodaMassPercent", label: "Soda mass percent", kind: "number" },
  { id: "limeMassPercent", label: "Lime mass percent", kind: "number" },
  { id: "otherMassPercent", label: "Other mass percent", kind: "number" },
  { id: "silicaMolarMass", label: "Silica molar mass", kind: "number" },
  { id: "sodaMolarMass", label: "Soda molar mass", kind: "number" },
  { id: "limeMolarMass", label: "Lime molar mass", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.silicaMassPercent, "silicaMassPercent");
  positive(input.silicaMolarMass, "silicaMolarMass");
  positive(input.sodaMolarMass, "sodaMolarMass");
  positive(input.limeMolarMass, "limeMolarMass");
  nonnegative(input.sodaMassPercent, "sodaMassPercent");
  nonnegative(input.limeMassPercent, "limeMassPercent");
  nonnegative(input.otherMassPercent, "otherMassPercent");
  const reportedTotalMassPercent =
    input.silicaMassPercent +
    input.sodaMassPercent +
    input.limeMassPercent +
    input.otherMassPercent;
  if (reportedTotalMassPercent > 100 + 1e-8)
    simpleError(
      "composition",
      "Declared oxide mass percentages cannot exceed 100.",
    );
  const silica = input.silicaMassPercent / input.silicaMolarMass;
  return {
    sodaSilicaMolarRatio: input.sodaMassPercent / input.sodaMolarMass / silica,
    limeSilicaMolarRatio: input.limeMassPercent / input.limeMolarMass / silica,
    reportedTotalMassPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  silicaMassPercent: 60,
  sodaMassPercent: 20,
  limeMassPercent: 10,
  otherMassPercent: 10,
  silicaMolarMass: 60,
  sodaMolarMass: 62,
  limeMolarMass: 56,
} satisfies Input;
export const exampleOutput = {
  sodaSilicaMolarRatio: 0.3225806451612903,
  limeSilicaMolarRatio: 0.17857142857142858,
  reportedTotalMassPercent: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/faience-glass-composition-ratio",
  title: "Faience Glass Composition Ratio Tool",
  description:
    "Convert measured glass oxide mass percentages to soda/silica and lime/silica molar ratios using supplied oxide molar masses; no recipe, phase or provenance classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "sodaSilicaMolarRatio",
      label: "Soda silica molar ratio",
      kind: "number",
    },
    {
      id: "limeSilicaMolarRatio",
      label: "Lime silica molar ratio",
      kind: "number",
    },
    {
      id: "reportedTotalMassPercent",
      label: "Reported total mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      silicaMassPercent: value.silicaMassPercent as number,
      sodaMassPercent: value.sodaMassPercent as number,
      limeMassPercent: value.limeMassPercent as number,
      otherMassPercent: value.otherMassPercent as number,
      silicaMolarMass: value.silicaMolarMass as number,
      sodaMolarMass: value.sodaMolarMass as number,
      limeMolarMass: value.limeMolarMass as number,
    }),
});
export const run = tool.execute;
export default tool;
