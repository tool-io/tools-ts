import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TollsCostPerRouteAxleLookupInput = {
  readonly axleCount: number;
  readonly totalTollCostUsd: number;
  readonly tripsOnRoute?: number;
};

export type TollsCostPerRouteAxleLookupOutput = {
  readonly tollPerAxleTripUsd: number;
  readonly tollPerTripUsd: number;
};

export const calculateTollsCostPerRouteAxleLookup = (
  input: TollsCostPerRouteAxleLookupInput,
): TollsCostPerRouteAxleLookupOutput => {
  if (!(Number.isSafeInteger(input.axleCount) && input.axleCount > 0))
    return simpleError(
      "axleCount",
      "Axle count must be greater than zero.",
      "invalid_axles",
    );
  const tripsOnRoute = input.tripsOnRoute ?? 1;
  if (!(Number.isSafeInteger(tripsOnRoute) && tripsOnRoute > 0))
    return simpleError(
      "tripsOnRoute",
      "Trips on route must be greater than zero.",
      "invalid_trips",
    );
  if (!Number.isFinite(input.totalTollCostUsd) || input.totalTollCostUsd < 0)
    return simpleError(
      "totalTollCostUsd",
      "Total toll cost must be finite and non-negative.",
      "invalid_cost",
    );
  const axleTrips = tripsOnRoute * input.axleCount;
  if (!Number.isSafeInteger(axleTrips))
    return simpleError(
      "tripsOnRoute",
      "The axle-trip count exceeds the safe integer range.",
      "count_out_of_range",
    );
  const tollPerTripUsd = input.totalTollCostUsd / tripsOnRoute;
  const tollPerAxleTripUsd = input.totalTollCostUsd / axleTrips;
  if (
    input.totalTollCostUsd > 0 &&
    (tollPerTripUsd <= 0 || tollPerAxleTripUsd <= 0)
  )
    return simpleError(
      "totalTollCostUsd",
      "The per-trip toll is outside the representable range.",
      "cost_out_of_range",
    );
  return { tollPerTripUsd, tollPerAxleTripUsd };
};

export const tollsCostPerRouteAxleLookupExample = {
  input: { axleCount: 5, totalTollCostUsd: 84.6, tripsOnRoute: 2 },
  output: { tollPerAxleTripUsd: 8.459999999999999, tollPerTripUsd: 42.3 },
} satisfies ToolExample<
  TollsCostPerRouteAxleLookupInput,
  TollsCostPerRouteAxleLookupOutput
>;

export const tollsCostPerRouteAxleLookupTool = createSimpleTool({
  id: "logistics/tolls-cost-per-route-axle-lookup",
  title: "Tolls Cost Per Route Axle Lookup",
  description:
    "Spread total toll spend over trips and axle-trips to price tolls per trip and per axle per trip.",
  inputs: [
    {
      description: "Total toll cost paid for the route in USD.",
      id: "totalTollCostUsd",
      kind: "number",
      label: "Total tolls",
      minimum: 0,
      unit: "USD",
    },
    {
      description: "Toll-class axle count of the vehicle.",
      id: "axleCount",
      kind: "integer",
      label: "Axles",
      minimum: 1,
    },
    {
      default: 1,
      description: "Number of trips on the route covered by the toll total.",
      id: "tripsOnRoute",
      kind: "integer",
      label: "Trips",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Average toll cost per trip in USD.",
      id: "tollPerTripUsd",
      kind: "number",
      label: "Toll/trip",
      minimum: 0,
      unit: "USD/trip",
    },
    {
      description: "Toll cost per axle per trip in USD.",
      id: "tollPerAxleTripUsd",
      kind: "number",
      label: "Toll/axle-trip",
      minimum: 0,
      unit: "USD/(axle·trip)",
    },
  ],
  calculate: (input) =>
    calculateTollsCostPerRouteAxleLookup({
      axleCount: input.axleCount as number,
      totalTollCostUsd: input.totalTollCostUsd as number,
      tripsOnRoute: input.tripsOnRoute as number | undefined,
    }),
});

export const runTollsCostPerRouteAxleLookup =
  tollsCostPerRouteAxleLookupTool.execute;
export default tollsCostPerRouteAxleLookupTool;
