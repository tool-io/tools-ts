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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly targetDailyLightIntegral: number;
  readonly measuredNaturalDailyLightIntegral: number;
  readonly supplementalPpfd: number;
  readonly lightDeliveryFraction: number;
  readonly remainingPhotoperiodHours: number;
}>;
export type Output = Readonly<{
  readonly requiredSupplementalHours: number;
  readonly deliverableSupplementalDose: number;
  readonly remainingDoseShortfall: number;
  readonly withinAvailablePhotoperiod: boolean;
}>;
const inputFields = [
  {
    id: "targetDailyLightIntegral",
    label: "Target daily light integral",
    kind: "number",
  },
  {
    id: "measuredNaturalDailyLightIntegral",
    label: "Measured natural daily light integral",
    kind: "number",
  },
  { id: "supplementalPpfd", label: "Supplemental ppfd", kind: "number" },
  {
    id: "lightDeliveryFraction",
    label: "Light delivery fraction",
    kind: "number",
  },
  {
    id: "remainingPhotoperiodHours",
    label: "Remaining photoperiod hours",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.supplementalPpfd, "supplementalPpfd");
  positive(input.lightDeliveryFraction, "lightDeliveryFraction");
  nonnegative(input.targetDailyLightIntegral, "targetDailyLightIntegral");
  nonnegative(
    input.measuredNaturalDailyLightIntegral,
    "measuredNaturalDailyLightIntegral",
  );
  nonnegative(input.remainingPhotoperiodHours, "remainingPhotoperiodHours");
  fraction(input.lightDeliveryFraction, "lightDeliveryFraction");
  if (input.remainingPhotoperiodHours > 24)
    simpleError(
      "remainingPhotoperiodHours",
      "At most 24 daily available hours required.",
    );
  const shortfall = Math.max(
      0,
      input.targetDailyLightIntegral - input.measuredNaturalDailyLightIntegral,
    ),
    hourlyDose = input.supplementalPpfd * input.lightDeliveryFraction * 0.0036,
    requiredSupplementalHours = shortfall / hourlyDose,
    deliverableSupplementalDose = Math.min(
      shortfall,
      input.remainingPhotoperiodHours * hourlyDose,
    );
  return {
    requiredSupplementalHours,
    deliverableSupplementalDose,
    remainingDoseShortfall: shortfall - deliverableSupplementalDose,
    withinAvailablePhotoperiod:
      requiredSupplementalHours <= input.remainingPhotoperiodHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetDailyLightIntegral: 10,
  measuredNaturalDailyLightIntegral: 4,
  supplementalPpfd: 100,
  lightDeliveryFraction: 0.5,
  remainingPhotoperiodHours: 8,
} satisfies Input;
export const exampleOutput = {
  requiredSupplementalHours: 33.333333333333336,
  deliverableSupplementalDose: 1.44,
  remainingDoseShortfall: 4.56,
  withinAvailablePhotoperiod: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/supplemental-light-shortfall-hours",
  title: "Supplemental Light Shortfall Hours",
  description:
    "Invert measured natural-light deficit into supplementary hours with delivery loss and a caller available photoperiod; unmet photon budget is explicit, not a crop lighting recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredSupplementalHours",
      label: "Required supplemental hours",
      kind: "number",
    },
    {
      id: "deliverableSupplementalDose",
      label: "Deliverable supplemental dose",
      kind: "number",
    },
    {
      id: "remainingDoseShortfall",
      label: "Remaining dose shortfall",
      kind: "number",
    },
    {
      id: "withinAvailablePhotoperiod",
      label: "Within available photoperiod",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      targetDailyLightIntegral: value.targetDailyLightIntegral as number,
      measuredNaturalDailyLightIntegral:
        value.measuredNaturalDailyLightIntegral as number,
      supplementalPpfd: value.supplementalPpfd as number,
      lightDeliveryFraction: value.lightDeliveryFraction as number,
      remainingPhotoperiodHours: value.remainingPhotoperiodHours as number,
    }),
});
export const run = tool.execute;
export default tool;
