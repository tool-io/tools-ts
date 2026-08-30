import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly nitrateProductionKgNPerDay: number;
  readonly makeupNitrateMgNPerLiter: number;
  readonly targetNitrateMgNPerLiter: number;
  readonly evaporativeLossM3PerDay: number;
  readonly internalRecirculationM3PerDay: number;
}>;
export type Output = Readonly<{
  readonly requiredPurgeM3PerDay: number;
  readonly requiredMakeupM3PerDay: number;
  readonly internalRecirculationFractionOfTotalFlow: number;
}>;
const inputFields = [
  {
    id: "nitrateProductionKgNPerDay",
    label: "Nitrate production kg n per day",
    kind: "number",
  },
  {
    id: "makeupNitrateMgNPerLiter",
    label: "Makeup nitrate mg n per liter",
    kind: "number",
  },
  {
    id: "targetNitrateMgNPerLiter",
    label: "Target nitrate mg n per liter",
    kind: "number",
  },
  {
    id: "evaporativeLossM3PerDay",
    label: "Evaporative loss m3 per day",
    kind: "number",
  },
  {
    id: "internalRecirculationM3PerDay",
    label: "Internal recirculation m3 per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.nitrateProductionKgNPerDay, "nitrateProductionKgNPerDay");
  nonnegative(input.makeupNitrateMgNPerLiter, "makeupNitrateMgNPerLiter");
  nonnegative(input.evaporativeLossM3PerDay, "evaporativeLossM3PerDay");
  nonnegative(
    input.internalRecirculationM3PerDay,
    "internalRecirculationM3PerDay",
  );
  const difference = positive(
      input.targetNitrateMgNPerLiter - input.makeupNitrateMgNPerLiter,
      "targetNitrateMgNPerLiter",
    ),
    requiredPurgeM3PerDay =
      (1000 * input.nitrateProductionKgNPerDay +
        input.makeupNitrateMgNPerLiter * input.evaporativeLossM3PerDay) /
      difference,
    requiredMakeupM3PerDay =
      requiredPurgeM3PerDay + input.evaporativeLossM3PerDay,
    total = positive(
      input.internalRecirculationM3PerDay + requiredMakeupM3PerDay,
      "totalFlow",
    );
  return {
    requiredPurgeM3PerDay,
    requiredMakeupM3PerDay,
    internalRecirculationFractionOfTotalFlow:
      input.internalRecirculationM3PerDay / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nitrateProductionKgNPerDay: 0.1,
  makeupNitrateMgNPerLiter: 0,
  targetNitrateMgNPerLiter: 10,
  evaporativeLossM3PerDay: 2,
  internalRecirculationM3PerDay: 1000,
} satisfies Input;
export const exampleOutput = {
  requiredPurgeM3PerDay: 10,
  requiredMakeupM3PerDay: 12,
  internalRecirculationFractionOfTotalFlow: 0.9881422924901185,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/ras-water-balance",
  title: "RAS Water Balance",
  description:
    "Solve steady RAS purge/makeup from nitrate production, nitrate-bearing makeup and solute-free evaporation; distinguishes internal circulation from boundary replacement and excludes denitrification.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredPurgeM3PerDay",
      label: "Required purge m3 per day",
      kind: "number",
    },
    {
      id: "requiredMakeupM3PerDay",
      label: "Required makeup m3 per day",
      kind: "number",
    },
    {
      id: "internalRecirculationFractionOfTotalFlow",
      label: "Internal recirculation fraction of total flow",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      nitrateProductionKgNPerDay: value.nitrateProductionKgNPerDay as number,
      makeupNitrateMgNPerLiter: value.makeupNitrateMgNPerLiter as number,
      targetNitrateMgNPerLiter: value.targetNitrateMgNPerLiter as number,
      evaporativeLossM3PerDay: value.evaporativeLossM3PerDay as number,
      internalRecirculationM3PerDay:
        value.internalRecirculationM3PerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
