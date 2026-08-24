import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CopperInterconnectResistivitySizeEffectInput = {
  readonly linewidthNm: number;
  readonly meanFreePathNm?: number;
  readonly sizeEffectCoefficient?: number;
};

export type CopperInterconnectResistivitySizeEffectOutput = {
  readonly resistivityIncreasePercent: number;
};

export const copperInterconnectResistivitySizeEffectExample = {
  input: { linewidthNm: 20 },
  output: { resistivityIncreasePercent: 79.8 },
} satisfies ToolExample<
  CopperInterconnectResistivitySizeEffectInput,
  CopperInterconnectResistivitySizeEffectOutput
>;

export const calculateCopperInterconnectResistivitySizeEffect = (
  input: CopperInterconnectResistivitySizeEffectInput,
): CopperInterconnectResistivitySizeEffectOutput => {
  const linewidthNm = input.linewidthNm;
  const meanFreePathNm = input.meanFreePathNm ?? 39.9;
  const sizeEffectCoefficient = input.sizeEffectCoefficient ?? 0.4;

  if (!Number.isFinite(linewidthNm) || linewidthNm <= 0)
    simpleError(
      "linewidthNm",
      "Linewidth must be a finite positive number.",
      "degenerate_input",
    );
  if (!Number.isFinite(meanFreePathNm) || meanFreePathNm <= 0)
    simpleError(
      "meanFreePathNm",
      "Mean free path must be a finite positive number.",
      "degenerate_input",
    );
  if (!Number.isFinite(sizeEffectCoefficient) || sizeEffectCoefficient < 0)
    simpleError(
      "sizeEffectCoefficient",
      "Size effect coefficient must be a finite number at least 0.",
      "invalid_value",
    );

  const directIncrease =
    (100 * sizeEffectCoefficient * meanFreePathNm) / linewidthNm;
  const resistivityIncreasePercent =
    sizeEffectCoefficient === 0
      ? 0
      : Number.isFinite(directIncrease) && directIncrease > 0
        ? directIncrease
        : Math.exp(
            Math.log(sizeEffectCoefficient) +
              Math.log(meanFreePathNm) -
              Math.log(linewidthNm) +
              Math.log(100),
          );
  if (
    !Number.isFinite(resistivityIncreasePercent) ||
    (resistivityIncreasePercent === 0 && sizeEffectCoefficient > 0)
  )
    simpleError(
      "linewidthNm",
      "Resistivity increase is outside the representable positive range.",
      resistivityIncreasePercent === 0
        ? "numeric_underflow"
        : "numeric_overflow",
    );

  return {
    resistivityIncreasePercent:
      resistivityIncreasePercent === 0 ? 0 : resistivityIncreasePercent,
  };
};

export const copperInterconnectResistivitySizeEffectTool = createSimpleTool({
  calculate: (input) =>
    calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: input.linewidthNm as number,
      meanFreePathNm: (input.meanFreePathNm as number | undefined) ?? undefined,
      sizeEffectCoefficient:
        (input.sizeEffectCoefficient as number | undefined) ?? undefined,
    }),
  description:
    "Estimate the first-order relative copper interconnect resistivity increase as Δρ/ρ = k·λ/w. The dimensionless coefficient k must be calibrated for the assumed surface and grain-boundary scattering; this compact model is not a full Fuchs-Sondheimer or Mayadas-Shatzkes calculation.",
  id: "semiconductor/copper-interconnect-resistivity-size-effect",
  inputs: [
    {
      description: "Interconnect linewidth. Must be greater than 0 nm.",
      id: "linewidthNm",
      kind: "number",
      label: "Linewidth",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      default: 0.4,
      description:
        "Dimensionless size effect coefficient. Must be at least 0; 0 yields 0 % increase.",
      id: "sizeEffectCoefficient",
      kind: "number",
      label: "Size effect coefficient",
      minimum: 0,
    },
    {
      default: 39.9,
      description: "Electron mean free path. Must be greater than 0 nm.",
      id: "meanFreePathNm",
      kind: "number",
      label: "Electron mean free path",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description:
        "Relative resistivity increase over bulk copper. At least 0 %.",
      id: "resistivityIncreasePercent",
      kind: "number",
      label: "Resistivity increase",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Copper Size Effect Calculator",
});
export const runCopperInterconnectResistivitySizeEffect =
  copperInterconnectResistivitySizeEffectTool.execute;
export default copperInterconnectResistivitySizeEffectTool;
