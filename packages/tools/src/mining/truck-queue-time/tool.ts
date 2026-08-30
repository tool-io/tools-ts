import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly truckArrivalsPerHour: number;
  readonly serviceRatePerLoaderHour: number;
  readonly loaderCount: number;
}>;
export type Output = Readonly<{
  readonly loaderUtilizationFraction: number;
  readonly probabilityOfWaiting: number;
  readonly meanQueueMinutes: number;
  readonly meanQueueTruckCount: number;
}>;
const inputFields = [
  {
    id: "truckArrivalsPerHour",
    label: "Truck arrivals per hour",
    kind: "number",
  },
  {
    id: "serviceRatePerLoaderHour",
    label: "Service rate per loader hour",
    kind: "number",
  },
  { id: "loaderCount", label: "Loader count", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.serviceRatePerLoaderHour, "serviceRatePerLoaderHour");
  positive(input.loaderCount, "loaderCount");
  nonnegative(input.truckArrivalsPerHour, "truckArrivalsPerHour");
  count(input.loaderCount, "loaderCount");
  if (input.loaderCount > 1000)
    simpleError("loaderCount", "At most 1000 servers supported.");
  const a = input.truckArrivalsPerHour / input.serviceRatePerLoaderHour,
    loaderUtilizationFraction = a / input.loaderCount;
  if (loaderUtilizationFraction >= 1)
    simpleError(
      "truckArrivalsPerHour",
      "Stable M/M/c requires arrivals below capacity.",
    );
  let erlangB = 1;
  for (let i = 1; i <= input.loaderCount; i++)
    erlangB = (a * erlangB) / (i + a * erlangB);
  const probabilityOfWaiting =
      erlangB /
      (1 - loaderUtilizationFraction + loaderUtilizationFraction * erlangB),
    hours =
      probabilityOfWaiting /
      (input.loaderCount * input.serviceRatePerLoaderHour -
        input.truckArrivalsPerHour);
  return {
    loaderUtilizationFraction,
    probabilityOfWaiting,
    meanQueueMinutes: 60 * hours,
    meanQueueTruckCount: input.truckArrivalsPerHour * hours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  truckArrivalsPerHour: 1,
  serviceRatePerLoaderHour: 1,
  loaderCount: 2,
} satisfies Input;
export const exampleOutput = {
  loaderUtilizationFraction: 0.5,
  probabilityOfWaiting: 0.3333333333333333,
  meanQueueMinutes: 20,
  meanQueueTruckCount: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/truck-queue-time",
  title: "Truck Queue Time",
  description:
    "Estimate Erlang-C truck waiting with stable Erlang-B recursion; Poisson arrivals, exponential independent service, infinite queue; not dispatch simulation.",
  inputs: inputFields,
  outputs: [
    {
      id: "loaderUtilizationFraction",
      label: "Loader utilization fraction",
      kind: "number",
    },
    {
      id: "probabilityOfWaiting",
      label: "Probability of waiting",
      kind: "number",
    },
    { id: "meanQueueMinutes", label: "Mean queue minutes", kind: "number" },
    {
      id: "meanQueueTruckCount",
      label: "Mean queue truck count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      truckArrivalsPerHour: value.truckArrivalsPerHour as number,
      serviceRatePerLoaderHour: value.serviceRatePerLoaderHour as number,
      loaderCount: value.loaderCount as number,
    }),
});
export const run = tool.execute;
export default tool;
