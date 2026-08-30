import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly designArealLoadKnPerM2: number;
  readonly boltCapacityKn: number;
  readonly capacityReductionFraction: number;
  readonly designFactor: number;
}>;
export type Output = Readonly<{
  readonly maximumTributaryAreaM2: number;
  readonly maximumSquareGridSpacingM: number;
}>;
const inputFields = [
  {
    id: "designArealLoadKnPerM2",
    label: "Design areal load kn per m2",
    kind: "number",
  },
  { id: "boltCapacityKn", label: "Bolt capacity kn", kind: "number" },
  {
    id: "capacityReductionFraction",
    label: "Capacity reduction fraction",
    kind: "number",
  },
  { id: "designFactor", label: "Design factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.designArealLoadKnPerM2, "designArealLoadKnPerM2");
  positive(input.boltCapacityKn, "boltCapacityKn");
  positive(input.capacityReductionFraction, "capacityReductionFraction");
  fraction(input.capacityReductionFraction, "capacityReductionFraction");
  if (input.designFactor < 1)
    simpleError("designFactor", "Design factor at least one required.");
  const maximumTributaryAreaM2 =
    (input.boltCapacityKn * input.capacityReductionFraction) /
    (input.designArealLoadKnPerM2 * input.designFactor);
  return {
    maximumTributaryAreaM2,
    maximumSquareGridSpacingM: Math.sqrt(maximumTributaryAreaM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  designArealLoadKnPerM2: 25,
  boltCapacityKn: 100,
  capacityReductionFraction: 0.5,
  designFactor: 2,
} satisfies Input;
export const exampleOutput = {
  maximumTributaryAreaM2: 1,
  maximumSquareGridSpacingM: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/rock-bolt-spacing",
  title: "Rock Bolt Spacing",
  description:
    "Calculate square-grid tributary-load bolt-spacing screen; anchorage, wedges, corrosion and dynamics are not modeled or certified.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumTributaryAreaM2",
      label: "Maximum tributary area m2",
      kind: "number",
    },
    {
      id: "maximumSquareGridSpacingM",
      label: "Maximum square grid spacing m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      designArealLoadKnPerM2: value.designArealLoadKnPerM2 as number,
      boltCapacityKn: value.boltCapacityKn as number,
      capacityReductionFraction: value.capacityReductionFraction as number,
      designFactor: value.designFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
