import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedLoaderWeighedPayloadTonnes: readonly number[];
  readonly observedMatchedProductiveMinutes: readonly number[];
  readonly observedCycleMachineFuelLitres: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLoaderTonnesProductiveHour: number;
  readonly observedFuelLitresPerDeliveredTonne: number;
}>;
const inputFields = [
  {
    id: "observedLoaderWeighedPayloadTonnes",
    label: "Observed loader weighed payload tonnes",
    kind: "numberList",
  },
  {
    id: "observedMatchedProductiveMinutes",
    label: "Observed matched productive minutes",
    kind: "numberList",
  },
  {
    id: "observedCycleMachineFuelLitres",
    label: "Observed cycle machine fuel litres",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedProductiveMinutes.forEach((v) =>
    positive(v, "observedMatchedProductiveMinutes"),
  );
  input.observedLoaderWeighedPayloadTonnes.forEach((v) =>
    nonnegative(v, "observedLoaderWeighedPayloadTonnes"),
  );
  input.observedCycleMachineFuelLitres.forEach((v) =>
    nonnegative(v, "observedCycleMachineFuelLitres"),
  );
  aligned(
    input.observedLoaderWeighedPayloadTonnes,
    input.observedMatchedProductiveMinutes,
    "observedLoaderWeighedPayloadTonnes",
  );
  aligned(
    input.observedLoaderWeighedPayloadTonnes,
    input.observedCycleMachineFuelLitres,
    "observedLoaderWeighedPayloadTonnes",
  );
  positive(sum(input.observedLoaderWeighedPayloadTonnes), "delivered");
  return {
    observedLoaderTonnesProductiveHour:
      (60 * sum(input.observedLoaderWeighedPayloadTonnes)) /
      sum(input.observedMatchedProductiveMinutes),
    observedFuelLitresPerDeliveredTonne:
      sum(input.observedCycleMachineFuelLitres) /
      sum(input.observedLoaderWeighedPayloadTonnes),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoaderWeighedPayloadTonnes: [2, 3],
  observedMatchedProductiveMinutes: [1, 2],
  observedCycleMachineFuelLitres: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  observedLoaderTonnesProductiveHour: 100,
  observedFuelLitresPerDeliveredTonne: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/loader-productivity",
  title: "Loader Productivity Calculator",
  description:
    "Audit actual weighed loader deliveries, productive time and independent fuel ledger, not bucket-capacity/density/fill predicted shovel productivity. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLoaderTonnesProductiveHour",
      label: "Observed loader tonnes productive hour",
      kind: "number",
    },
    {
      id: "observedFuelLitresPerDeliveredTonne",
      label: "Observed fuel litres per delivered tonne",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoaderWeighedPayloadTonnes:
        value.observedLoaderWeighedPayloadTonnes as readonly number[],
      observedMatchedProductiveMinutes:
        value.observedMatchedProductiveMinutes as readonly number[],
      observedCycleMachineFuelLitres:
        value.observedCycleMachineFuelLitres as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
