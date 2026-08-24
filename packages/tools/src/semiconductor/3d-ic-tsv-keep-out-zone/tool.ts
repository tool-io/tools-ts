import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThreeDIcTsvKeepOutZoneInput = {
  readonly keepOutRatio?: number;
  readonly tsvPitchUm: number;
};

export type ThreeDIcTsvKeepOutZoneOutput = {
  readonly keepOutUm: number;
};

export const threeDIcTsvKeepOutZoneExample = {
  input: { tsvPitchUm: 5 },
  output: { keepOutUm: 10 },
} satisfies ToolExample<
  ThreeDIcTsvKeepOutZoneInput,
  ThreeDIcTsvKeepOutZoneOutput
>;

export const calculateThreeDIcTsvKeepOutZone = (
  input: ThreeDIcTsvKeepOutZoneInput,
): ThreeDIcTsvKeepOutZoneOutput => {
  const keepOutRatio = input.keepOutRatio ?? 2;
  const tsvPitchUm = input.tsvPitchUm;

  if (!Number.isFinite(tsvPitchUm) || tsvPitchUm <= 0)
    simpleError(
      "tsvPitchUm",
      "TSV pitch must be a finite positive number.",
      "invalid_pitch",
    );
  if (!Number.isFinite(keepOutRatio) || keepOutRatio < 0)
    simpleError(
      "keepOutRatio",
      "Keep-out ratio must be a finite number at least 0.",
      "invalid_keep_out_ratio",
    );

  const directKeepOut = tsvPitchUm * keepOutRatio;
  const keepOutUm =
    keepOutRatio === 0
      ? 0
      : Number.isFinite(directKeepOut) && directKeepOut > 0
        ? directKeepOut
        : Math.exp(Math.log(tsvPitchUm) + Math.log(keepOutRatio));
  if (!Number.isFinite(keepOutUm) || (keepOutUm === 0 && keepOutRatio > 0))
    simpleError(
      "tsvPitchUm",
      "Keep-out distance is outside the representable positive range.",
      keepOutUm === 0 ? "numeric_underflow" : "numeric_overflow",
    );
  return { keepOutUm: keepOutUm === 0 ? 0 : keepOutUm };
};

export const threeDIcTsvKeepOutZoneTool = createSimpleTool({
  calculate: (input) =>
    calculateThreeDIcTsvKeepOutZone({
      keepOutRatio: (input.keepOutRatio as number | undefined) ?? undefined,
      tsvPitchUm: input.tsvPitchUm as number,
    }),
  description:
    "Compute the placement keep-out zone around a through-silicon via from its pitch and a keep-out ratio. Keep-out = pitch × ratio.",
  id: "semiconductor/3d-ic-tsv-keep-out-zone",
  inputs: [
    {
      default: 2,
      description:
        "Ratio of the keep-out radius to the TSV pitch. Must be at least 0; 0 yields 0 µm keep-out.",
      id: "keepOutRatio",
      kind: "number",
      label: "Keep-out ratio",
      minimum: 0,
    },
    {
      description: "Center-to-center TSV pitch. Must be greater than 0 µm.",
      id: "tsvPitchUm",
      kind: "number",
      label: "TSV pitch",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Placement keep-out zone, at least 0 µm.",
      id: "keepOutUm",
      kind: "number",
      label: "Keep-out zone",
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "TSV Keep-Out Zone Calculator",
});
export const runThreeDIcTsvKeepOutZone = threeDIcTsvKeepOutZoneTool.execute;
export default threeDIcTsvKeepOutZoneTool;
