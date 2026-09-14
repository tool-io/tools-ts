import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
  daysBetween,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDisplayStartUtcIsoDate: string;
  readonly actualReviewUtcIsoDate: string;
  readonly callerIndependentlyApplicableDisplayDurationDays: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDisplayStartUtcIsoDate",
    label: "Actual display start utc iso date",
    kind: "string",
  },
  {
    id: "actualReviewUtcIsoDate",
    label: "Actual review utc iso date",
    kind: "string",
  },
  {
    id: "callerIndependentlyApplicableDisplayDurationDays",
    label: "Caller independently applicable display duration days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const n = daysBetween(
    input.actualDisplayStartUtcIsoDate,
    input.actualReviewUtcIsoDate,
  );
  nonnegative(n, "dateorder");
  bounded(
    input.callerIndependentlyApplicableDisplayDurationDays,
    "duration",
    0,
    1000000,
  );
  return {
    elapsedDisplayDays: n,
    signedRemainingCallerDays:
      input.callerIndependentlyApplicableDisplayDurationDays - n,
    callerDurationExceeded:
      n > input.callerIndependentlyApplicableDisplayDurationDays,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualDisplayStartUtcIsoDate: "2026-10-01",
    actualReviewUtcIsoDate: "2026-10-11",
    callerIndependentlyApplicableDisplayDurationDays: 7,
  },
  output: {
    result: {
      elapsedDisplayDays: 10,
      signedRemainingCallerDays: -3,
      callerDurationExceeded: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/display-duration-etiquette-timer",
  title: "Display Duration Etiquette Timer",
  description:
    "ActualUTCcivil-dateelapsedtimerunderindependentlyapplicableprotocol duration,signedoverdue retained,not suggestsuniversaldisplaylaw. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
