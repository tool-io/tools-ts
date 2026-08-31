import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  aligned,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedMonitoringZoneAreasM2: readonly number[];
  readonly callerCardsPer100M2: number;
  readonly alreadyPlacedCardCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredWholeCardsByZone: readonly number[];
  readonly additionalCardsNeededByZone: readonly number[];
  readonly surplusPlacedCardsByZone: readonly number[];
}>;
const inputFields = [
  {
    id: "observedMonitoringZoneAreasM2",
    label: "Observed monitoring zone areas m2",
    kind: "numberList",
  },
  {
    id: "callerCardsPer100M2",
    label: "Caller cards per100 m2",
    kind: "number",
  },
  {
    id: "alreadyPlacedCardCounts",
    label: "Already placed card counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMonitoringZoneAreasM2.forEach((v) =>
    nonnegative(v, "observedMonitoringZoneAreasM2"),
  );
  nonnegative(input.callerCardsPer100M2, "callerCardsPer100M2");
  aligned(
    input.observedMonitoringZoneAreasM2,
    input.alreadyPlacedCardCounts,
    "observedMonitoringZoneAreasM2",
  );
  input.alreadyPlacedCardCounts.forEach((v) => bounded(v, "cards", 0, 1000000));
  const required = input.observedMonitoringZoneAreasM2.map((v) =>
    bounded(
      Math.ceil((v / 100) * input.callerCardsPer100M2),
      "requiredCards",
      0,
      1000000,
    ),
  );
  return {
    requiredWholeCardsByZone: required,
    additionalCardsNeededByZone: required.map((v, i) =>
      Math.max(0, v - input.alreadyPlacedCardCounts[i]),
    ),
    surplusPlacedCardsByZone: required.map((v, i) =>
      Math.max(0, input.alreadyPlacedCardCounts[i] - v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMonitoringZoneAreasM2: [100, 50],
  callerCardsPer100M2: 2,
  alreadyPlacedCardCounts: [1, 2],
} satisfies Input;
export const exampleOutput = {
  requiredWholeCardsByZone: [2, 1],
  additionalCardsNeededByZone: [1, 0],
  surplusPlacedCardsByZone: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/yellow-sticky-card-count-per-100m2",
  title: "Yellow Sticky Card Count Per 100M2 Calculator",
  description:
    "Plan actual monitoring zones with caller density and observed placed-card deficits/surpluses, whole cards per zone; no universal pest sampling design, action threshold or control recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeCardsByZone",
      label: "Required whole cards by zone",
      kind: "numberList",
    },
    {
      id: "additionalCardsNeededByZone",
      label: "Additional cards needed by zone",
      kind: "numberList",
    },
    {
      id: "surplusPlacedCardsByZone",
      label: "Surplus placed cards by zone",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMonitoringZoneAreasM2:
        value.observedMonitoringZoneAreasM2 as readonly number[],
      callerCardsPer100M2: value.callerCardsPer100M2 as number,
      alreadyPlacedCardCounts:
        value.alreadyPlacedCardCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
