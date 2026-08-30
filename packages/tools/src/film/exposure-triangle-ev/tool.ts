import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExposureTriangleEvInput = Readonly<{
  readonly fNumber: number;
  readonly shutterSeconds: number;
  readonly iso: number;
}>;
export type ExposureTriangleEvOutput = Readonly<{
  readonly sceneEv100: number;
}>;

export const calculateExposureTriangleEv = (
  x: ExposureTriangleEvInput,
): ExposureTriangleEvOutput => {
  if (!Number.isFinite(x.fNumber) || x.fNumber < 0)
    simpleError("fNumber", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.shutterSeconds) || x.shutterSeconds < 0)
    simpleError("shutterSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.iso) || x.iso < 0)
    simpleError("iso", "Provide a finite number at least 0.");
  const sceneEv100 = Math.log2(
    ((x.fNumber ** 2 / x.shutterSeconds) * 100) / x.iso,
  );
  if (!Number.isFinite(sceneEv100))
    simpleError(
      "sceneEv100",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sceneEv100: Object.is(sceneEv100, -0) ? 0 : sceneEv100 };
};

export const example = {
  input: { fNumber: 8, shutterSeconds: 0.01, iso: 100 },
  output: { sceneEv100: 12.643856189774725 },
} satisfies ToolExample<ExposureTriangleEvInput, ExposureTriangleEvOutput>;

export const tool = createSimpleTool({
  id: "film/exposure-triangle-ev",
  title: "Exposure Triangle EV",
  description:
    "ISO-adjusted exposure value referred to ISO 100: log₂[(N²/t)(100/ISO)].",
  inputs: [
    { id: "fNumber", kind: "number", label: "F Number", minimum: 0 },
    {
      id: "shutterSeconds",
      kind: "number",
      label: "Shutter Seconds",
      unit: "s",
      minimum: 0,
    },
    { id: "iso", kind: "number", label: "Iso", minimum: 0 },
  ],
  outputs: [
    { id: "sceneEv100", kind: "number", label: "Scene Ev100", unit: "EV" },
  ],
  calculate: (input) =>
    calculateExposureTriangleEv({
      fNumber: input.fNumber as number,
      shutterSeconds: input.shutterSeconds as number,
      iso: input.iso as number,
    }),
});
export const exposureTriangleEvTool = tool;
export const runExposureTriangleEv = tool.execute;
export default tool;
