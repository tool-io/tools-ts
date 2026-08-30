import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExposureValueEvInput = Readonly<{
  readonly fNumber: number;
  readonly shutterSeconds: number;
}>;
export type ExposureValueEvOutput = Readonly<{
  readonly ev100: number;
}>;

export const calculateExposureValueEv = (
  x: ExposureValueEvInput,
): ExposureValueEvOutput => {
  if (!Number.isFinite(x.fNumber) || x.fNumber < 0)
    simpleError("fNumber", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.shutterSeconds) || x.shutterSeconds < 0)
    simpleError("shutterSeconds", "Provide a finite number at least 0.");
  const ev100 = Math.log2(x.fNumber ** 2 / x.shutterSeconds);
  if (!Number.isFinite(ev100))
    simpleError("ev100", "Inputs produce an undefined or out-of-range result.");
  return { ev100: Object.is(ev100, -0) ? 0 : ev100 };
};

export const example = {
  input: { fNumber: 8, shutterSeconds: 0.01 },
  output: { ev100: 12.643856189774725 },
} satisfies ToolExample<ExposureValueEvInput, ExposureValueEvOutput>;

export const tool = createSimpleTool({
  id: "film/exposure-value-ev",
  title: "Exposure Value EV",
  description:
    "Exposure value at ISO 100, EV=log₂(N²/t), from f-number N and shutter time t in seconds.",
  inputs: [
    { id: "fNumber", kind: "number", label: "F Number", minimum: 0 },
    {
      id: "shutterSeconds",
      kind: "number",
      label: "Shutter Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [{ id: "ev100", kind: "number", label: "Ev100", unit: "EV" }],
  calculate: (input) =>
    calculateExposureValueEv({
      fNumber: input.fNumber as number,
      shutterSeconds: input.shutterSeconds as number,
    }),
});
export const exposureValueEvTool = tool;
export const runExposureValueEv = tool.execute;
export default tool;
