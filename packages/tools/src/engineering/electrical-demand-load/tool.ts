import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  fraction,
  sum,
  aligned,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualConnectedPowerWatts: readonly number[];
  readonly callerApplicableCoincidentDemandFractions: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualConnectedPowerWatts",
    label: "Actual connected power watts",
    kind: "numberList",
  },
  {
    id: "callerApplicableCoincidentDemandFractions",
    label: "Caller applicable coincident demand fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.actualConnectedPowerWatts.length)
    simpleError("actualConnectedPowerWatts", "Actual nonempty observations.");
  input.actualConnectedPowerWatts.forEach((v) =>
    nonnegative(v, "actualConnectedPowerWatts"),
  );
  if (!input.callerApplicableCoincidentDemandFractions.length)
    simpleError(
      "callerApplicableCoincidentDemandFractions",
      "Actual nonempty observations.",
    );
  input.callerApplicableCoincidentDemandFractions.forEach((v) =>
    fraction(v, "callerApplicableCoincidentDemandFractions"),
  );
  aligned(
    input.actualConnectedPowerWatts,
    input.callerApplicableCoincidentDemandFractions,
    "loads",
  );
  return {
    value: sum(
      input.actualConnectedPowerWatts.map(
        (v, i) => v * input.callerApplicableCoincidentDemandFractions[i],
      ),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualConnectedPowerWatts: [10, 20],
    callerApplicableCoincidentDemandFractions: [0.5, 0.5],
  },
  output: { result: { value: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/electrical-demand-load",
  title: "Electrical Demand Load Calculator",
  description:
    "Actual connected load vector\u00d7independently applicable coincident demand fractions sum, not derive diversity from independent peaks or select electrical code factors. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
