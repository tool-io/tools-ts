import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  mean,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly selfReportedDailySocialMediaMinutes: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "selfReportedDailySocialMediaMinutes",
    label: "Self reported daily social media minutes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.selfReportedDailySocialMediaMinutes.length)
    simpleError("observations", "Nonempty actual observed periods.");
  input.selfReportedDailySocialMediaMinutes.forEach((v) =>
    nonnegative(v, "minutes"),
  );
  return {
    observedMeanHours: mean(input.selfReportedDailySocialMediaMinutes) / 60,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { selfReportedDailySocialMediaMinutes: [60, 120] },
  output: { result: { observedMeanHours: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/social-media-daily-hours-self-report",
  title: "Self-Reported Daily Social-Media Hours Calculator",
  description:
    "Actual self-reported day-level social-media mean hours, not validated device use. Complete compatible observation periods required; no inferred health or attention outcomes.",
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
