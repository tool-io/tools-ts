import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedUsableSoftenerExchangeCapacityGrains: number;
  readonly actualDailyTreatedWaterUsGallons: number;
  readonly actualRawHardnessGrainsPerUsGallon: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedUsableSoftenerExchangeCapacityGrains",
    label: "Caller verified usable softener exchange capacity grains",
    kind: "number",
  },
  {
    id: "actualDailyTreatedWaterUsGallons",
    label: "Actual daily treated water us gallons",
    kind: "number",
  },
  {
    id: "actualRawHardnessGrainsPerUsGallon",
    label: "Actual raw hardness grains per us gallon",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerVerifiedUsableSoftenerExchangeCapacityGrains,
    "callerVerifiedUsableSoftenerExchangeCapacityGrains",
  );
  positive(
    input.actualDailyTreatedWaterUsGallons,
    "actualDailyTreatedWaterUsGallons",
  );
  positive(
    input.actualRawHardnessGrainsPerUsGallon,
    "actualRawHardnessGrainsPerUsGallon",
  );
  return {
    value:
      input.callerVerifiedUsableSoftenerExchangeCapacityGrains /
      (input.actualDailyTreatedWaterUsGallons *
        input.actualRawHardnessGrainsPerUsGallon),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedUsableSoftenerExchangeCapacityGrains: 100,
    actualDailyTreatedWaterUsGallons: 10,
    actualRawHardnessGrainsPerUsGallon: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-softener-regeneration-frequency",
  title: "Plumbing Water Softener Regeneration Frequency Calculator",
  description:
    "Conditional usable exchange grains/daily hardness load timeDAYS between exhaustion, not optimal regeneration setting, brine instructions or schedule authorization. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
