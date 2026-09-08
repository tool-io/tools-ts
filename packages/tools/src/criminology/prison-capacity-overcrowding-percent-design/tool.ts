import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedPopulationByFacility: readonly number[];
  readonly verifiedDesignCapacityByFacility: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedPopulationByFacility",
    label: "Observed population by facility",
    kind: "numberList",
  },
  {
    id: "verifiedDesignCapacityByFacility",
    label: "Verified design capacity by facility",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.observedPopulationByFacility,
    input.verifiedDesignCapacityByFacility,
    "facilities",
  );
  [
    input.observedPopulationByFacility,
    input.verifiedDesignCapacityByFacility,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "count")));
  const c = positive(sum(input.verifiedDesignCapacityByFacility), "capacity");
  return {
    observedDesignOccupancyPercent:
      (100 * sum(input.observedPopulationByFacility)) / c,
    signedPooledExcessPopulation: sum(input.observedPopulationByFacility) - c,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedPopulationByFacility: [120, 90],
    verifiedDesignCapacityByFacility: [100, 100],
  },
  output: {
    result: {
      observedDesignOccupancyPercent: 105,
      signedPooledExcessPopulation: 10,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/prison-capacity-overcrowding-percent-design",
  title: "Prison Capacity Overcrowding Percent Design Calculator",
  description:
    "Matched actual design-capacity occupancy; pooled excess can mask local deficits. No lawful or humane capacity threshold or permission for overcrowding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
