import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StreakingWindowInput = {
  readonly xuvDurationAs: number;
  readonly irWavelengthNm?: number;
};

export type StreakingWindowOutput = {
  readonly irHalfCycleAs: number;
  readonly fitsWithinIrHalfCycle: boolean;
  readonly note: string;
};

export const SPEED_OF_LIGHT_M_PER_S = 299792458;

/**
 * Compare an XUV duration with the IR dressing-field half cycle
 * T/2 = λ/(2c). This is a timing-window check, not a retrieval model.
 */
export const streakingWindow = (
  input: StreakingWindowInput,
): StreakingWindowOutput => {
  const { xuvDurationAs } = input;
  const irWavelengthNm = input.irWavelengthNm ?? 800;
  if (!Number.isFinite(xuvDurationAs) || xuvDurationAs <= 0)
    simpleError("xuvDurationAs", "XUV duration must be positive.");
  if (!Number.isFinite(irWavelengthNm) || irWavelengthNm <= 0)
    simpleError("irWavelengthNm", "IR wavelength must be positive.");
  const irHalfCycleAs =
    ((irWavelengthNm * 1e-9) / SPEED_OF_LIGHT_M_PER_S / 2) * 1e18;
  if (!Number.isFinite(irHalfCycleAs))
    simpleError("irWavelengthNm", "Half-cycle window overflowed.");
  const fitsWithinIrHalfCycle = xuvDurationAs < irHalfCycleAs;
  return {
    irHalfCycleAs,
    fitsWithinIrHalfCycle,
    note: fitsWithinIrHalfCycle
      ? "The XUV duration is shorter than one IR half-cycle. This timing check alone does not establish that phase retrieval will succeed."
      : "The XUV duration is at least one IR half-cycle, so the simple sub-half-cycle timing criterion is not met.",
  };
};

export const streakingWindowExample = {
  input: { xuvDurationAs: 250, irWavelengthNm: 800 },
  output: {
    irHalfCycleAs: 1334.2563807926083,
    fitsWithinIrHalfCycle: true,
    note: "The XUV duration is shorter than one IR half-cycle. This timing check alone does not establish that phase retrieval will succeed.",
  },
} satisfies ToolExample<StreakingWindowInput, StreakingWindowOutput>;

export const streakingWindowTool = createSimpleTool({
  calculate: (input) =>
    streakingWindow({
      irWavelengthNm: (input.irWavelengthNm as number | undefined) ?? undefined,
      xuvDurationAs: input.xuvDurationAs as number,
    }),
  description:
    "Compare an XUV burst duration with the IR half-cycle λ/(2c) while keeping this timing screen separate from streaking phase-retrieval feasibility.",
  id: "laser/laser-attosecond-streaking-phase-retrieval-window-note-lookup",
  inputs: [
    {
      description: "XUV burst duration to retrieve.",
      id: "xuvDurationAs",
      kind: "number",
      label: "XUV duration",
      minimum: Number.MIN_VALUE,
      unit: "as",
    },
    {
      default: 800,
      description: "Dressing IR wavelength setting the half-cycle window.",
      id: "irWavelengthNm",
      kind: "number",
      label: "IR wavelength",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "IR half-cycle window λ/2c in attoseconds.",
      id: "irHalfCycleAs",
      kind: "number",
      label: "Half-cycle window",
      unit: "as",
    },
    {
      description: "True when the burst fits inside one half-cycle.",
      id: "fitsWithinIrHalfCycle",
      kind: "boolean",
      label: "Fits half-cycle",
    },
    {
      description: "Retrieval guidance for the window.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Attosecond Streaking Window",
});
export const runStreakingWindow = streakingWindowTool.execute;
export default streakingWindowTool;

export { streakingWindowExample as example };
