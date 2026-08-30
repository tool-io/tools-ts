import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly payloadTonnes: number;
  readonly cycleMinutes: number;
  readonly mechanicalAvailability: number;
  readonly operatingUtilization: number;
  readonly truckCount: number;
}>;
export type Output = Readonly<{
  readonly perTruckScheduledTonnesPerHour: number;
  readonly fleetScheduledTonnesPerHour: number;
}>;
const inputFields = [
  { id: "payloadTonnes", label: "Payload tonnes", kind: "number" },
  { id: "cycleMinutes", label: "Cycle minutes", kind: "number" },
  {
    id: "mechanicalAvailability",
    label: "Mechanical availability",
    kind: "number",
  },
  {
    id: "operatingUtilization",
    label: "Operating utilization",
    kind: "number",
  },
  { id: "truckCount", label: "Truck count", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.payloadTonnes, "payloadTonnes");
  positive(input.cycleMinutes, "cycleMinutes");
  positive(input.truckCount, "truckCount");
  fraction(input.mechanicalAvailability, "mechanicalAvailability");
  fraction(input.operatingUtilization, "operatingUtilization");
  count(input.truckCount, "truckCount");
  const perTruckScheduledTonnesPerHour =
    ((input.payloadTonnes * 60) / input.cycleMinutes) *
    input.mechanicalAvailability *
    input.operatingUtilization;
  return {
    perTruckScheduledTonnesPerHour,
    fleetScheduledTonnesPerHour:
      perTruckScheduledTonnesPerHour * input.truckCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  payloadTonnes: 100,
  cycleMinutes: 20,
  mechanicalAvailability: 0.8,
  operatingUtilization: 0.5,
  truckCount: 4,
} satisfies Input;
export const exampleOutput = {
  perTruckScheduledTonnesPerHour: 120,
  fleetScheduledTonnesPerHour: 480,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/truck-productivity",
  title: "Truck Productivity",
  description:
    "Estimate scheduled truck throughput with utilization conditional on availability; cycle times include operating delays and fleet dispatch interactions are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "perTruckScheduledTonnesPerHour",
      label: "Per truck scheduled tonnes per hour",
      kind: "number",
    },
    {
      id: "fleetScheduledTonnesPerHour",
      label: "Fleet scheduled tonnes per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      payloadTonnes: value.payloadTonnes as number,
      cycleMinutes: value.cycleMinutes as number,
      mechanicalAvailability: value.mechanicalAvailability as number,
      operatingUtilization: value.operatingUtilization as number,
      truckCount: value.truckCount as number,
    }),
});
export const run = tool.execute;
export default tool;
