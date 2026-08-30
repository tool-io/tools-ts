import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  aligned,
  ordered,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly calendarDayOrdinals: readonly number[];
  readonly veraisonEventFlags: readonly number[];
  readonly harvestEventFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedVeraisonToHarvestDays: number;
  readonly harvestRightCensored: boolean;
  readonly veraisonObservedOrdinal: number;
  readonly observedOrCensoredHarvestOrdinal: number;
}>;
const inputFields = [
  {
    id: "calendarDayOrdinals",
    label: "Calendar day ordinals",
    kind: "numberList",
  },
  {
    id: "veraisonEventFlags",
    label: "Veraison event flags",
    kind: "numberList",
  },
  { id: "harvestEventFlags", label: "Harvest event flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.calendarDayOrdinals, "days");
  aligned(input.calendarDayOrdinals, input.veraisonEventFlags, "flags");
  aligned(input.calendarDayOrdinals, input.harvestEventFlags, "flags");
  input.calendarDayOrdinals.forEach((v) => count(v, "dayOrdinal"));
  binary(input.veraisonEventFlags, "veraison");
  binary(input.harvestEventFlags, "harvest");
  const vi = input.veraisonEventFlags.indexOf(1);
  if (
    vi < 0 ||
    input.veraisonEventFlags.filter((v) => v === 1).length !== 1 ||
    input.harvestEventFlags.filter((v) => v === 1).length > 1
  )
    simpleError(
      "events",
      "Exactly one observed veraison and at most one harvest required.",
    );
  const hi = input.harvestEventFlags.indexOf(1);
  if (hi >= 0 && hi < vi)
    simpleError("events", "Harvest cannot precede veraison.");
  const end =
    hi < 0 ? input.calendarDayOrdinals.at(-1)! : input.calendarDayOrdinals[hi];
  return {
    observedVeraisonToHarvestDays: end - input.calendarDayOrdinals[vi],
    harvestRightCensored: hi < 0,
    veraisonObservedOrdinal: input.calendarDayOrdinals[vi],
    observedOrCensoredHarvestOrdinal: end,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calendarDayOrdinals: [100, 200, 300],
  veraisonEventFlags: [1, 0, 0],
  harvestEventFlags: [0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  observedVeraisonToHarvestDays: 100,
  harvestRightCensored: false,
  veraisonObservedOrdinal: 100,
  observedOrCensoredHarvestOrdinal: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/veraison-to-harvest-day-span",
  title: "Veraison To Harvest Day Span",
  description:
    "Audit observed veraison/harvest event timeline on caller continuous day ordinals, preserving no harvest as right-censored duration; no maturity-optimum date or fixed variety calendar.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedVeraisonToHarvestDays",
      label: "Observed veraison to harvest days",
      kind: "number",
    },
    {
      id: "harvestRightCensored",
      label: "Harvest right censored",
      kind: "boolean",
    },
    {
      id: "veraisonObservedOrdinal",
      label: "Veraison observed ordinal",
      kind: "number",
    },
    {
      id: "observedOrCensoredHarvestOrdinal",
      label: "Observed or censored harvest ordinal",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      calendarDayOrdinals: value.calendarDayOrdinals as readonly number[],
      veraisonEventFlags: value.veraisonEventFlags as readonly number[],
      harvestEventFlags: value.harvestEventFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
