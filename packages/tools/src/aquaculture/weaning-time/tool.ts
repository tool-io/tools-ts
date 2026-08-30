import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly accumulatedDegreeDays: number;
  readonly targetWeaningDegreeDays: number;
  readonly forecastTemperatureC: number;
  readonly baseTemperatureC: number;
  readonly minimumAgeDays: number;
  readonly currentAgeDays: number;
}>;
export type Output = Readonly<{
  readonly remainingThermalDays: number;
  readonly earliestModelWeaningAgeDays: number;
}>;
const inputFields = [
  {
    id: "accumulatedDegreeDays",
    label: "Accumulated degree days",
    kind: "number",
  },
  {
    id: "targetWeaningDegreeDays",
    label: "Target weaning degree days",
    kind: "number",
  },
  {
    id: "forecastTemperatureC",
    label: "Forecast temperature c",
    kind: "number",
  },
  { id: "baseTemperatureC", label: "Base temperature c", kind: "number" },
  { id: "minimumAgeDays", label: "Minimum age days", kind: "number" },
  { id: "currentAgeDays", label: "Current age days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.accumulatedDegreeDays, "accumulatedDegreeDays");
  nonnegative(input.targetWeaningDegreeDays, "targetWeaningDegreeDays");
  nonnegative(input.minimumAgeDays, "minimumAgeDays");
  nonnegative(input.currentAgeDays, "currentAgeDays");
  const remaining = Math.max(
      0,
      input.targetWeaningDegreeDays - input.accumulatedDegreeDays,
    ),
    excess = input.forecastTemperatureC - input.baseTemperatureC;
  if (remaining > 0 && excess <= 0)
    simpleError(
      "forecastTemperatureC",
      "No finite thermal completion under this forecast.",
    );
  const remainingThermalDays = remaining === 0 ? 0 : remaining / excess;
  return {
    remainingThermalDays,
    earliestModelWeaningAgeDays: Math.max(
      input.minimumAgeDays,
      input.currentAgeDays + remainingThermalDays,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  accumulatedDegreeDays: 10,
  targetWeaningDegreeDays: 30,
  forecastTemperatureC: 15,
  baseTemperatureC: 5,
  minimumAgeDays: 4,
  currentAgeDays: 3,
} satisfies Input;
export const exampleOutput = {
  remainingThermalDays: 2,
  earliestModelWeaningAgeDays: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/weaning-time",
  title: "Weaning Time",
  description:
    "Project remaining thermal development at a constant caller forecast and a minimum age; modeled timing does not establish feeding readiness or species-specific weaning advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "remainingThermalDays",
      label: "Remaining thermal days",
      kind: "number",
    },
    {
      id: "earliestModelWeaningAgeDays",
      label: "Earliest model weaning age days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      accumulatedDegreeDays: value.accumulatedDegreeDays as number,
      targetWeaningDegreeDays: value.targetWeaningDegreeDays as number,
      forecastTemperatureC: value.forecastTemperatureC as number,
      baseTemperatureC: value.baseTemperatureC as number,
      minimumAgeDays: value.minimumAgeDays as number,
      currentAgeDays: value.currentAgeDays as number,
    }),
});
export const run = tool.execute;
export default tool;
