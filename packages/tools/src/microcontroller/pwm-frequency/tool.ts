import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PwmFrequencyInput = Readonly<{
  readonly clockHertz: number;
  readonly prescaler: number;
  readonly periodRegister: number;
}>;
export type PwmFrequencyOutput = Readonly<{
  readonly pwmHertz: number;
}>;

export const calculatePwmFrequency = (
  x: PwmFrequencyInput,
): PwmFrequencyOutput => {
  if (!Number.isFinite(x.clockHertz) || x.clockHertz < 0)
    simpleError("clockHertz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.prescaler) ||
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 0
  )
    simpleError("prescaler", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.periodRegister) ||
    !Number.isSafeInteger(x.periodRegister) ||
    x.periodRegister < 0
  )
    simpleError("periodRegister", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.prescaler) ||
    x.prescaler < 1 ||
    !Number.isSafeInteger(x.periodRegister)
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pwmHertz = x.clockHertz / (x.prescaler * (x.periodRegister + 1));
  if (!Number.isFinite(pwmHertz))
    simpleError(
      "pwmHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pwmHertz: Object.is(pwmHertz, -0) ? 0 : pwmHertz };
};

export const example = {
  input: { clockHertz: 1000000, prescaler: 8, periodRegister: 999 },
  output: { pwmHertz: 125 },
} satisfies ToolExample<PwmFrequencyInput, PwmFrequencyOutput>;

export const tool = createSimpleTool({
  id: "microcontroller/pwm-frequency",
  title: "PWM Frequency",
  description:
    "Edge-aligned PWM frequency with an inclusive auto-reload value and effective prescaler divisor. On timers whose PSC register divides by PSC+1, enter PSC+1.",
  inputs: [
    {
      id: "clockHertz",
      kind: "number",
      label: "Clock Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "prescaler", kind: "integer", label: "Prescaler", minimum: 0 },
    {
      id: "periodRegister",
      kind: "integer",
      label: "Period Register",
      minimum: 0,
    },
  ],
  outputs: [{ id: "pwmHertz", kind: "number", label: "Pwm Hertz", unit: "Hz" }],
  calculate: (input) =>
    calculatePwmFrequency({
      clockHertz: input.clockHertz as number,
      prescaler: input.prescaler as number,
      periodRegister: input.periodRegister as number,
    }),
});
export const pwmFrequencyTool = tool;
export const runPwmFrequency = tool.execute;
export default tool;
