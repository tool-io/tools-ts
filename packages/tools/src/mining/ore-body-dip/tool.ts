import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, linearFit } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDownDipHorizontalStationsM: readonly number[];
  readonly observedOreContactDepthM: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedSignedOreDipDegrees: number;
  readonly oreContactFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedDownDipHorizontalStationsM",
    label: "Observed down dip horizontal stations m",
    kind: "numberList",
  },
  {
    id: "observedOreContactDepthM",
    label: "Observed ore contact depth m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = linearFit(
    input.observedDownDipHorizontalStationsM,
    input.observedOreContactDepthM,
  );
  return {
    fittedSignedOreDipDegrees: (Math.atan(f.slope) * 180) / Math.PI,
    oreContactFitRSquared: f.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDownDipHorizontalStationsM: [0, 1, 2],
  observedOreContactDepthM: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  fittedSignedOreDipDegrees: 45,
  oreContactFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-body-dip",
  title: "Ore Body Dip Calculator",
  description:
    "Fit actual independently chosen down-dip ore-contact section and signed dip, no geodesy, full3D strike inference or generic roadway grade. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedSignedOreDipDegrees",
      label: "Fitted signed ore dip degrees",
      kind: "number",
    },
    {
      id: "oreContactFitRSquared",
      label: "Ore contact fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDownDipHorizontalStationsM:
        value.observedDownDipHorizontalStationsM as readonly number[],
      observedOreContactDepthM:
        value.observedOreContactDepthM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
