import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EtchSelectivityInput = {
  readonly filmEtchRateNmPerMin: number;
  readonly maskEtchRateNmPerMin: number;
};

export type EtchSelectivityOutput = {
  readonly selectivity: number;
};

export const etchSelectivityExample = {
  input: { filmEtchRateNmPerMin: 150, maskEtchRateNmPerMin: 1 },
  output: { selectivity: 150 },
} satisfies ToolExample<EtchSelectivityInput, EtchSelectivityOutput>;

export const calculateEtchSelectivity = (
  input: EtchSelectivityInput,
): EtchSelectivityOutput => {
  if (
    !Number.isFinite(input.filmEtchRateNmPerMin) ||
    input.filmEtchRateNmPerMin < 0
  )
    simpleError(
      "filmEtchRateNmPerMin",
      "Film etch rate must be a finite number at least 0.",
      "invalid_film_rate",
    );
  if (
    !Number.isFinite(input.maskEtchRateNmPerMin) ||
    input.maskEtchRateNmPerMin <= 0
  )
    simpleError(
      "maskEtchRateNmPerMin",
      "Mask etch rate must be a finite positive number.",
      "invalid_mask_rate",
    );
  const selectivity =
    input.filmEtchRateNmPerMin === 0
      ? 0
      : input.filmEtchRateNmPerMin / input.maskEtchRateNmPerMin;
  if (
    !Number.isFinite(selectivity) ||
    (input.filmEtchRateNmPerMin > 0 && selectivity === 0)
  )
    simpleError(
      "maskEtchRateNmPerMin",
      "Selectivity is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    selectivity,
  };
};

export const etchSelectivityTool = createSimpleTool({
  calculate: (input) =>
    calculateEtchSelectivity({
      filmEtchRateNmPerMin: input.filmEtchRateNmPerMin as number,
      maskEtchRateNmPerMin: input.maskEtchRateNmPerMin as number,
    }),
  description:
    "Divide the film etch rate by the mask etch rate to get the etch selectivity.",
  id: "semiconductor/etch-selectivity",
  inputs: [
    {
      description:
        "Etch rate of the target film. Must be at least 0 nm/min; 0 yields selectivity 0.",
      format: "rate",
      id: "filmEtchRateNmPerMin",
      kind: "number",
      label: "Film etch rate",
      minimum: 0,
      unit: "nm/min",
    },
    {
      description:
        "Etch rate of the masking material. Must be greater than 0 nm/min.",
      format: "rate",
      id: "maskEtchRateNmPerMin",
      kind: "number",
      label: "Mask etch rate",
      minimum: Number.MIN_VALUE,
      unit: "nm/min",
    },
  ],
  outputs: [
    {
      description:
        "Selectivity ratio of film removal to mask removal; zero when the film does not etch.",
      format: "ratio",
      id: "selectivity",
      kind: "number",
      label: "Selectivity",
      minimum: 0,
    },
  ],
  title: "Etch Selectivity Calculator",
});
export const runEtchSelectivity = etchSelectivityTool.execute;
export default etchSelectivityTool;
