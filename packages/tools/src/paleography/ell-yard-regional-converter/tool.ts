import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EllYardRegionalConverterInput = {
  readonly value: number;
  readonly unit?: "ell" | "yard";
  readonly region?:
    | "english_ell_45in"
    | "flemish_ell_27in"
    | "scottish_ell_37in"
    | "custom_inches";
  readonly customEllInches?: number;
};

export type EllYardRegionalConverterOutput = {
  readonly totalInches: number;
  readonly yards: number;
  readonly ells: number;
};

const REGION_INCHES = {
  english_ell_45in: 45,
  flemish_ell_27in: 27,
  scottish_ell_37in: 37,
} as const;

export const calculateEllYardRegionalConverter = (
  input: EllYardRegionalConverterInput,
): EllYardRegionalConverterOutput => {
  if (!(
    typeof input.value === "number" &&
    Number.isFinite(input.value) &&
    input.value > 0
  ))
    return simpleError(
      "value",
      "Value must be a finite number greater than zero.",
      "invalid_value",
    );
  const region = input.region ?? "english_ell_45in";
  const inchesPerEll =
    region === "custom_inches"
      ? (input.customEllInches ?? 45)
      : REGION_INCHES[region];
  if (!(Number.isFinite(inchesPerEll) && inchesPerEll > 0))
    return simpleError(
      "customEllInches",
      "Custom ell length must be greater than zero.",
      "invalid_ell_length",
    );
  const totalInches = input.value * (input.unit === "yard" ? 36 : inchesPerEll);
  if (!Number.isFinite(totalInches))
    return simpleError(
      "value",
      "The converted length is outside the finite numeric range.",
      "numeric_range",
    );
  const yards = totalInches / 36;
  const ells = totalInches / inchesPerEll;
  if (!(
    Number.isFinite(yards) &&
    yards > 0 &&
    Number.isFinite(ells) &&
    ells > 0
  ))
    return simpleError(
      "value",
      "The converted length is outside the finite numeric range.",
      "numeric_range",
    );
  return { totalInches, yards, ells };
};

export const ellYardRegionalConverterExample = {
  input: { value: 10, unit: "ell", region: "english_ell_45in" },
  output: { totalInches: 450, yards: 12.5, ells: 10 },
} satisfies ToolExample<
  EllYardRegionalConverterInput,
  EllYardRegionalConverterOutput
>;

export const ellYardRegionalConverterTool = createSimpleTool({
  id: "paleography/ell-yard-regional-converter",
  title: "Ell Yard Regional Converter",
  description:
    "Convert cloth lengths between ells and statute yards (36 in) using documented regional ell standards - English statutory 45 in, common Flemish 27 in, Scottish 37 in (approximate; local practice varied), or a custom length.",
  inputs: [
    {
      description: "Length in the chosen unit.",
      id: "value",
      kind: "number",
      label: "Value",
      minimum: Number.MIN_VALUE,
    },
    {
      default: "ell",
      description: "Unit of the entered value.",
      enum: ["ell", "yard"],
      id: "unit",
      kind: "string",
      label: "Unit",
    },
    {
      default: "english_ell_45in",
      description: "Regional ell standard to apply.",
      enum: [
        "english_ell_45in",
        "flemish_ell_27in",
        "scottish_ell_37in",
        "custom_inches",
      ],
      id: "region",
      kind: "string",
      label: "Region",
    },
    {
      default: 45,
      description:
        "Ell length in English inches when the custom region is chosen.",
      id: "customEllInches",
      kind: "number",
      label: "Custom ell (in)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Length in inches.",
      id: "totalInches",
      kind: "number",
      label: "Inches",
    },
    {
      description: "Length in statute yards.",
      id: "yards",
      kind: "number",
      label: "Yards",
    },
    {
      description: "Length in ells of the chosen standard.",
      id: "ells",
      kind: "number",
      label: "Ells",
    },
  ],
  calculate: (input) =>
    calculateEllYardRegionalConverter({
      customEllInches: input.customEllInches as number | undefined,
      region: input.region as EllYardRegionalConverterInput["region"],
      unit: input.unit as EllYardRegionalConverterInput["unit"],
      value: input.value as number,
    }),
});

export const runEllYardRegionalConverter = ellYardRegionalConverterTool.execute;
export default ellYardRegionalConverterTool;
