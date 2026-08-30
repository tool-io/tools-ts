import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly conditionedMassGrams: number;
  readonly ovenDryMassGrams: number;
  readonly callerTargetRegainPercent: number;
  readonly callerTolerancePercentagePoints: number;
}>;
export type Output = Readonly<{
  readonly measuredMoistureRegainPercent: number;
  readonly targetDeviationPercentagePoints: number;
  readonly withinCallerTolerance: boolean;
}>;
const inputFields = [
  {
    id: "conditionedMassGrams",
    label: "Conditioned mass grams",
    kind: "number",
  },
  { id: "ovenDryMassGrams", label: "Oven dry mass grams", kind: "number" },
  {
    id: "callerTargetRegainPercent",
    label: "Caller target regain percent",
    kind: "number",
  },
  {
    id: "callerTolerancePercentagePoints",
    label: "Caller tolerance percentage points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.ovenDryMassGrams, "ovenDryMassGrams");
  nonnegative(input.conditionedMassGrams, "conditionedMassGrams");
  nonnegative(input.callerTargetRegainPercent, "callerTargetRegainPercent");
  nonnegative(
    input.callerTolerancePercentagePoints,
    "callerTolerancePercentagePoints",
  );
  nonnegative(
    input.conditionedMassGrams - input.ovenDryMassGrams,
    "conditionedMassGrams",
  );
  const measuredMoistureRegainPercent =
      100 *
      ((input.conditionedMassGrams - input.ovenDryMassGrams) /
        input.ovenDryMassGrams),
    targetDeviationPercentagePoints =
      measuredMoistureRegainPercent - input.callerTargetRegainPercent;
  return {
    measuredMoistureRegainPercent,
    targetDeviationPercentagePoints,
    withinCallerTolerance:
      Math.abs(targetDeviationPercentagePoints) <=
      input.callerTolerancePercentagePoints,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  conditionedMassGrams: 111,
  ovenDryMassGrams: 100,
  callerTargetRegainPercent: 11,
  callerTolerancePercentagePoints: 0.5,
} satisfies Input;
export const exampleOutput = {
  measuredMoistureRegainPercent: 11,
  targetDeviationPercentagePoints: 0,
  withinCallerTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/moisture-regain-11-percent-checker",
  title: "Moisture Regain 11 Percent Checker",
  description:
    "Audit measured dry-basis silk moisture regain against caller target/tolerance; historical 11 percent route imposes no fixed international legal standard.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredMoistureRegainPercent",
      label: "Measured moisture regain percent",
      kind: "number",
    },
    {
      id: "targetDeviationPercentagePoints",
      label: "Target deviation percentage points",
      kind: "number",
    },
    {
      id: "withinCallerTolerance",
      label: "Within caller tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      conditionedMassGrams: value.conditionedMassGrams as number,
      ovenDryMassGrams: value.ovenDryMassGrams as number,
      callerTargetRegainPercent: value.callerTargetRegainPercent as number,
      callerTolerancePercentagePoints:
        value.callerTolerancePercentagePoints as number,
    }),
});
export const run = tool.execute;
export default tool;
