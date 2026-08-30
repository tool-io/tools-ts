import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PwmDutyCountInput = Readonly<{
  readonly dutyFraction: number;
  readonly periodRegister: number;
}>;
export type PwmDutyCountOutput = Readonly<{
  readonly activeTicks: number;
}>;

export const calculatePwmDutyCount = (
  x: PwmDutyCountInput,
): PwmDutyCountOutput => {
  if (!Number.isFinite(x.dutyFraction) || x.dutyFraction < 0)
    simpleError("dutyFraction", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.periodRegister) ||
    !Number.isSafeInteger(x.periodRegister) ||
    x.periodRegister < 0
  )
    simpleError("periodRegister", "Provide a safe integer at least 0.");
  if (x.dutyFraction > 1 || !Number.isSafeInteger(x.periodRegister))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const activeTicks = Math.round(x.dutyFraction * (x.periodRegister + 1));
  if (!Number.isFinite(activeTicks) || !Number.isSafeInteger(activeTicks))
    simpleError(
      "activeTicks",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { activeTicks: Object.is(activeTicks, -0) ? 0 : activeTicks };
};

export const example = {
  input: { dutyFraction: 0.25, periodRegister: 999 },
  output: { activeTicks: 250 },
} satisfies ToolExample<PwmDutyCountInput, PwmDutyCountOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/pwm-duty-count",
  title: "PWM Duty Count",
  description:
    "Nearest PWM active-tick count for a target duty fraction over an inclusive zero-to-period-register timer cycle.",
  inputs: [
    { id: "dutyFraction", kind: "number", label: "Duty Fraction", minimum: 0 },
    {
      id: "periodRegister",
      kind: "integer",
      label: "Period Register",
      minimum: 0,
    },
  ],
  outputs: [{ id: "activeTicks", kind: "integer", label: "Active Ticks" }],
  calculate: (input) =>
    calculatePwmDutyCount({
      dutyFraction: input.dutyFraction as number,
      periodRegister: input.periodRegister as number,
    }),
});
export const pwmDutyCountTool = tool;
export const runPwmDutyCount = tool.execute;
export default tool;
