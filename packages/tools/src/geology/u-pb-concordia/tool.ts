import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UPbConcordiaInput = {
  readonly pb206U238: number;
  readonly pb207U235: number;
};

export type UPbConcordiaOutput = {
  readonly age206Pb238Ma: number;
  readonly age207Pb235Ma: number;
  readonly discordancePercent: number;
};

const LAMBDA_U238_PER_YEAR = 1.55125e-10;
const LAMBDA_U235_PER_YEAR = 9.8485e-10;

/**
 * Jaffey et al. (1971) decay constants: individual Pb/U ages from
 * t = ln(1 + r)/lambda and percent discordance 100*(t207 - t206)/t207.
 */
export const calculateUPbConcordia = (
  input: UPbConcordiaInput,
): UPbConcordiaOutput => {
  if (!(input.pb206U238 >= 0))
    return simpleError(
      "pb206U238",
      "The 206Pb/238U ratio must be non-negative.",
      "invalid_ratio",
    );
  if (!(input.pb207U235 > 0))
    return simpleError(
      "pb207U235",
      "The 207Pb/235U ratio must be greater than zero.",
      "invalid_ratio",
    );
  const age206Years = Math.log(1 + input.pb206U238) / LAMBDA_U238_PER_YEAR;
  const age207Years = Math.log(1 + input.pb207U235) / LAMBDA_U235_PER_YEAR;
  return {
    age206Pb238Ma: age206Years / 1e6,
    age207Pb235Ma: age207Years / 1e6,
    discordancePercent: (100 * (age207Years - age206Years)) / age207Years,
  };
};

export const uPbConcordiaExample = {
  input: { pb206U238: 0.5, pb207U235: 10 },
  output: {
    age206Pb238Ma: 2613.796023259722,
    age207Pb235Ma: 2434.7822234841556,
    discordancePercent: -7.352353654011779,
  },
} satisfies ToolExample<UPbConcordiaInput, UPbConcordiaOutput>;

export const uPbConcordiaTool = createSimpleTool({
  id: "geology/u-pb-concordia",
  title: "Geology U Pb Concordia Calculator",
  description:
    "Convert 206Pb/238U and 207Pb/235U ratios into concordia-style ages in Ma and their percent discordance.",
  inputs: [
    {
      description: "Radiogenic 206Pb/238U ratio.",
      id: "pb206U238",
      kind: "number",
      label: "206Pb/238U",
      minimum: 0,
    },
    {
      description: "Radiogenic 207Pb/235U ratio.",
      id: "pb207U235",
      kind: "number",
      label: "207Pb/235U",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Age from the 206Pb/238U ratio in Ma.",
      id: "age206Pb238Ma",
      kind: "number",
      label: "206Pb/238U age",
    },
    {
      description: "Age from the 207Pb/235U ratio in Ma.",
      id: "age207Pb235Ma",
      kind: "number",
      label: "207Pb/235U age",
    },
    {
      description:
        "Percent discordance, 100*(t207-t206)/t207; zero means concordant.",
      id: "discordancePercent",
      kind: "number",
      label: "Discordance",
    },
  ],
  calculate: (input) =>
    calculateUPbConcordia(input as unknown as UPbConcordiaInput),
});

export const runUPbConcordia = uPbConcordiaTool.execute;
export default uPbConcordiaTool;
