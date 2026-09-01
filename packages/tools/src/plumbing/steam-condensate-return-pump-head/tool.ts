import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  head,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCondensateDischargeAboveReceiverM: number;
  readonly observedReturnLineHeadLossM: number;
  readonly observedReceivingAbsoluteKpa: number;
  readonly observedReceiverAbsoluteKpa: number;
  readonly callerMatchedCondensateDensityKgM3: number;
  readonly callerGravityMetersSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly signedRequiredCondensateReturnHeadM: number;
}>;
const inputFields = [
  {
    id: "observedCondensateDischargeAboveReceiverM",
    label: "Observed condensate discharge above receiver m",
    kind: "number",
  },
  {
    id: "observedReturnLineHeadLossM",
    label: "Observed return line head loss m",
    kind: "number",
  },
  {
    id: "observedReceivingAbsoluteKpa",
    label: "Observed receiving absolute kpa",
    kind: "number",
  },
  {
    id: "observedReceiverAbsoluteKpa",
    label: "Observed receiver absolute kpa",
    kind: "number",
  },
  {
    id: "callerMatchedCondensateDensityKgM3",
    label: "Caller matched condensate density kg m3",
    kind: "number",
  },
  {
    id: "callerGravityMetersSecondSquared",
    label: "Caller gravity meters second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedReceivingAbsoluteKpa, "observedReceivingAbsoluteKpa");
  positive(input.observedReceiverAbsoluteKpa, "observedReceiverAbsoluteKpa");
  positive(
    input.callerMatchedCondensateDensityKgM3,
    "callerMatchedCondensateDensityKgM3",
  );
  positive(
    input.callerGravityMetersSecondSquared,
    "callerGravityMetersSecondSquared",
  );
  nonnegative(input.observedReturnLineHeadLossM, "observedReturnLineHeadLossM");
  return {
    signedRequiredCondensateReturnHeadM: sum([
      input.observedCondensateDischargeAboveReceiverM,
      input.observedReturnLineHeadLossM,
      head(
        (input.observedReceivingAbsoluteKpa -
          input.observedReceiverAbsoluteKpa) *
          1000,
        input.callerMatchedCondensateDensityKgM3,
        input.callerGravityMetersSecondSquared,
      ),
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCondensateDischargeAboveReceiverM: 3,
  observedReturnLineHeadLossM: 2,
  observedReceivingAbsoluteKpa: 120,
  observedReceiverAbsoluteKpa: 100,
  callerMatchedCondensateDensityKgM3: 1000,
  callerGravityMetersSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  signedRequiredCondensateReturnHeadM: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/steam-condensate-return-pump-head",
  title: "Plumbing Steam Condensate Return Pump Head Calculator",
  description:
    "Audit actual condensate receiver/discharge absolute backpressure and signed elevation/loss budget at matched hot condensate density; no NPSH/flashing or steam pump operating approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRequiredCondensateReturnHeadM",
      label: "Signed required condensate return head m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCondensateDischargeAboveReceiverM:
        value.observedCondensateDischargeAboveReceiverM as number,
      observedReturnLineHeadLossM: value.observedReturnLineHeadLossM as number,
      observedReceivingAbsoluteKpa:
        value.observedReceivingAbsoluteKpa as number,
      observedReceiverAbsoluteKpa: value.observedReceiverAbsoluteKpa as number,
      callerMatchedCondensateDensityKgM3:
        value.callerMatchedCondensateDensityKgM3 as number,
      callerGravityMetersSecondSquared:
        value.callerGravityMetersSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
