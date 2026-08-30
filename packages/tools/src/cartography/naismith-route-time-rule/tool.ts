import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NaismithRouteTimeRuleInput = Readonly<{
  readonly distanceKilometers: number;
  readonly ascentMeters: number;
}>;
export type NaismithRouteTimeRuleOutput = Readonly<{
  readonly hours: number;
}>;

export const calculateNaismithRouteTimeRule = (
  x: NaismithRouteTimeRuleInput,
): NaismithRouteTimeRuleOutput => {
  if (!Number.isFinite(x.distanceKilometers) || x.distanceKilometers < 0)
    simpleError("distanceKilometers", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.ascentMeters) || x.ascentMeters < 0)
    simpleError("ascentMeters", "Provide a finite nonnegative number.");
  const hours = x.distanceKilometers / 5 + x.ascentMeters / 600;
  if (!Number.isFinite(hours))
    simpleError("hours", "Inputs produce an undefined or out-of-range result.");
  return { hours: Object.is(hours, -0) ? 0 : hours };
};

export const example = {
  input: {
    distanceKilometers: 10,
    ascentMeters: 600,
  },
  output: { hours: 3 },
} satisfies ToolExample<
  NaismithRouteTimeRuleInput,
  NaismithRouteTimeRuleOutput
>;

export const tool = createSimpleTool({
  id: "cartography/naismith-route-time-rule",
  title: "Naismith Route Time Rule",
  description:
    "Walking time in hours using Naismith's rule: 5 km/h horizontal pace plus one hour per 600 m ascent.",
  inputs: [
    {
      id: "distanceKilometers",
      kind: "number",
      label: "Distance Kilometers",
      unit: "km",
      minimum: 0,
    },
    {
      id: "ascentMeters",
      kind: "number",
      label: "Ascent Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "hours", kind: "number", label: "Hours", unit: "h" }],
  calculate: (input) =>
    calculateNaismithRouteTimeRule({
      distanceKilometers: input.distanceKilometers as number,
      ascentMeters: input.ascentMeters as number,
    }),
});
export const naismithRouteTimeRuleTool = tool;
export const runNaismithRouteTimeRule = tool.execute;
export default tool;
