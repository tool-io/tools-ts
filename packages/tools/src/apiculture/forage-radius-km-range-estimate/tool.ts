import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly totalTripBudgetMinutes: number;
  readonly handlingMinutes: number;
  readonly outboundSpeedMPerSecond: number;
  readonly returnSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly modelOneWayForageRadiusKm: number;
  readonly outboundFlightSeconds: number;
  readonly returnFlightSeconds: number;
}>;
const inputFields = [
  {
    id: "totalTripBudgetMinutes",
    label: "Total trip budget minutes",
    kind: "number",
  },
  { id: "handlingMinutes", label: "Handling minutes", kind: "number" },
  {
    id: "outboundSpeedMPerSecond",
    label: "Outbound speed m per second",
    kind: "number",
  },
  {
    id: "returnSpeedMPerSecond",
    label: "Return speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.totalTripBudgetMinutes, "totalTripBudgetMinutes");
  positive(input.outboundSpeedMPerSecond, "outboundSpeedMPerSecond");
  positive(input.returnSpeedMPerSecond, "returnSpeedMPerSecond");
  nonnegative(input.handlingMinutes, "handlingMinutes");
  const time =
      nonnegative(
        input.totalTripBudgetMinutes - input.handlingMinutes,
        "handlingMinutes",
      ) * 60,
    distance =
      time /
      (1 / input.outboundSpeedMPerSecond + 1 / input.returnSpeedMPerSecond);
  return {
    modelOneWayForageRadiusKm: distance / 1000,
    outboundFlightSeconds: distance / input.outboundSpeedMPerSecond,
    returnFlightSeconds: distance / input.returnSpeedMPerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalTripBudgetMinutes: 60,
  handlingMinutes: 20,
  outboundSpeedMPerSecond: 5,
  returnSpeedMPerSecond: 10,
} satisfies Input;
export const exampleOutput = {
  modelOneWayForageRadiusKm: 8,
  outboundFlightSeconds: 1600,
  returnFlightSeconds: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/forage-radius-km-range-estimate",
  title: "Forage Radius KM Range Estimate",
  description:
    "Invert a measured trip/handling time budget to one-way reach with distinct outbound/return speeds; no universal foraging radius, energy reserve or landscape accessibility claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelOneWayForageRadiusKm",
      label: "Model one way forage radius km",
      kind: "number",
    },
    {
      id: "outboundFlightSeconds",
      label: "Outbound flight seconds",
      kind: "number",
    },
    {
      id: "returnFlightSeconds",
      label: "Return flight seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      totalTripBudgetMinutes: value.totalTripBudgetMinutes as number,
      handlingMinutes: value.handlingMinutes as number,
      outboundSpeedMPerSecond: value.outboundSpeedMPerSecond as number,
      returnSpeedMPerSecond: value.returnSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
