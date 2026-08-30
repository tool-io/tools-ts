import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly hypolimneticOxygenInventoriesKg: readonly number[];
  readonly hypolimneticAreaM2: number;
}>;
export type Output = Readonly<{
  readonly netInventoryDepletionKgPerDay: number;
  readonly arealDepletionGramsPerM2Day: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  {
    id: "hypolimneticOxygenInventoriesKg",
    label: "Hypolimnetic oxygen inventories kg",
    kind: "numberList",
  },
  { id: "hypolimneticAreaM2", label: "Hypolimnetic area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.hypolimneticAreaM2, "hypolimneticAreaM2");
  input.hypolimneticOxygenInventoriesKg.forEach((v) =>
    nonnegative(v, "hypolimneticOxygenInventoriesKg"),
  );
  ordered(input.timesDays, "timesDays");
  const fit = regression(
      input.timesDays,
      input.hypolimneticOxygenInventoriesKg,
    ),
    netInventoryDepletionKgPerDay = -fit.slope;
  return {
    netInventoryDepletionKgPerDay,
    arealDepletionGramsPerM2Day:
      (1000 * netInventoryDepletionKgPerDay) / input.hypolimneticAreaM2,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  hypolimneticOxygenInventoriesKg: [100, 90, 80],
  hypolimneticAreaM2: 1000,
} satisfies Input;
export const exampleOutput = {
  netInventoryDepletionKgPerDay: 10,
  arealDepletionGramsPerM2Day: 10,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/areal-hypolimnetic-oxygen-depletion",
  title: "Areal Hypolimnetic Oxygen Depletion",
  description:
    "Fit net hypolimnetic oxygen-inventory depletion and normalize by area; negative depletion records replenishment, and changing hypolimnetic boundaries or advective supply require separate correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "netInventoryDepletionKgPerDay",
      label: "Net inventory depletion kg per day",
      kind: "number",
    },
    {
      id: "arealDepletionGramsPerM2Day",
      label: "Areal depletion grams per m2 day",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      hypolimneticOxygenInventoriesKg:
        value.hypolimneticOxygenInventoriesKg as readonly number[],
      hypolimneticAreaM2: value.hypolimneticAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
