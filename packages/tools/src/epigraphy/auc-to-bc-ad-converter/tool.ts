import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AucToBcAdConverterInput = {
  readonly aucYear: number;
  readonly foundingEpoch?:
    "varro753bc" | "polybianCatonian752bc" | "dionysian751bc";
};

export type AucToBcAdConverterOutput = {
  readonly era: "BC" | "AD";
  readonly year: number;
  readonly foundingYearBc: number;
};

const FOUNDING_YEAR_BC: Record<
  NonNullable<AucToBcAdConverterInput["foundingEpoch"]>,
  number
> = {
  varro753bc: 753,
  polybianCatonian752bc: 752,
  dionysian751bc: 751,
};

export const calculateAucToBcAdConverter = (
  input: AucToBcAdConverterInput,
): AucToBcAdConverterOutput => {
  const foundingYearBc = FOUNDING_YEAR_BC[input.foundingEpoch ?? "varro753bc"];
  if (input.aucYear <= foundingYearBc)
    return {
      era: "BC",
      year: foundingYearBc - input.aucYear + 1,
      foundingYearBc,
    };
  return { era: "AD", year: input.aucYear - foundingYearBc, foundingYearBc };
};

export const aucToBcAdConverterExample = {
  input: { aucYear: 710, foundingEpoch: "varro753bc" },
  output: { era: "BC", year: 44, foundingYearBc: 753 },
} satisfies ToolExample<AucToBcAdConverterInput, AucToBcAdConverterOutput>;

export const aucToBcAdConverterTool = createSimpleTool({
  id: "epigraphy/auc-to-bc-ad-converter",
  title: "AUC Ab Urbe Condita to BC/AD Converter",
  description:
    "Convert an Ab Urbe Condita year to a BC or AD calendar year using the Varronian founding epoch of 753 BC by default, or the Polybian-Catonian 752 BC and Dionysian 751 BC epochs.",
  inputs: [
    {
      description:
        "Year since the founding of Rome (AUC), counting inclusively from year 1.",
      id: "aucYear",
      kind: "integer",
      label: "AUC year",
      minimum: 1,
    },
    {
      default: "varro753bc",
      description: "Founding epoch convention.",
      enum: ["varro753bc", "polybianCatonian752bc", "dionysian751bc"],
      id: "foundingEpoch",
      kind: "string",
      label: "Founding epoch",
    },
  ],
  outputs: [
    {
      description: "Resulting calendar era.",
      enum: ["BC", "AD"],
      id: "era",
      kind: "string",
      label: "Era",
    },
    {
      description: "Calendar year within that era.",
      id: "year",
      kind: "integer",
      label: "Year",
    },
    {
      description: "Founding year in BC implied by the chosen epoch.",
      id: "foundingYearBc",
      kind: "integer",
      label: "Founding BC",
    },
  ],
  calculate: (input) =>
    calculateAucToBcAdConverter(input as unknown as AucToBcAdConverterInput),
});

export const runAucToBcAdConverter = aucToBcAdConverterTool.execute;
export default aucToBcAdConverterTool;
