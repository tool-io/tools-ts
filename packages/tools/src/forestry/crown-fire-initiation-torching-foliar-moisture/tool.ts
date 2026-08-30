import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly canopyBaseHeightM: number;
  readonly foliarMoisturePercentDryBasis: number;
  readonly observedSurfaceIntensityKwPerM: number;
}>;
export type Output = Readonly<{
  readonly vanWagnerCriticalIntensityKwPerM: number;
  readonly observedToCriticalIntensityRatio: number;
  readonly aboveModelInitiationThreshold: boolean;
}>;
const inputFields = [
  { id: "canopyBaseHeightM", label: "Canopy base height m", kind: "number" },
  {
    id: "foliarMoisturePercentDryBasis",
    label: "Foliar moisture percent dry basis",
    kind: "number",
  },
  {
    id: "observedSurfaceIntensityKwPerM",
    label: "Observed surface intensity kw per m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.canopyBaseHeightM, "canopyBaseHeightM");
  nonnegative(
    input.foliarMoisturePercentDryBasis,
    "foliarMoisturePercentDryBasis",
  );
  nonnegative(
    input.observedSurfaceIntensityKwPerM,
    "observedSurfaceIntensityKwPerM",
  );
  const vanWagnerCriticalIntensityKwPerM =
    (0.01 *
      input.canopyBaseHeightM *
      (460 + 25.9 * input.foliarMoisturePercentDryBasis)) **
    1.5;
  return {
    vanWagnerCriticalIntensityKwPerM,
    observedToCriticalIntensityRatio:
      input.observedSurfaceIntensityKwPerM / vanWagnerCriticalIntensityKwPerM,
    aboveModelInitiationThreshold:
      input.observedSurfaceIntensityKwPerM >= vanWagnerCriticalIntensityKwPerM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  canopyBaseHeightM: 2,
  foliarMoisturePercentDryBasis: 100,
  observedSurfaceIntensityKwPerM: 100,
} satisfies Input;
export const exampleOutput = {
  vanWagnerCriticalIntensityKwPerM: 476.42523023030594,
  observedToCriticalIntensityRatio: 0.20989652448015733,
  aboveModelInitiationThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/crown-fire-initiation-torching-foliar-moisture",
  title: "Crowning Initiation Foliar Moisture Threshold Checker",
  description:
    "Evaluate named Van Wagner crown-initiation critical-intensity equation using canopy base height and dry-basis foliar moisture; exceeding this model threshold is not proof of active crown fire or an operational safety assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "vanWagnerCriticalIntensityKwPerM",
      label: "Van wagner critical intensity kw per m",
      kind: "number",
    },
    {
      id: "observedToCriticalIntensityRatio",
      label: "Observed to critical intensity ratio",
      kind: "number",
    },
    {
      id: "aboveModelInitiationThreshold",
      label: "Above model initiation threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      canopyBaseHeightM: value.canopyBaseHeightM as number,
      foliarMoisturePercentDryBasis:
        value.foliarMoisturePercentDryBasis as number,
      observedSurfaceIntensityKwPerM:
        value.observedSurfaceIntensityKwPerM as number,
    }),
});
export const run = tool.execute;
export default tool;
