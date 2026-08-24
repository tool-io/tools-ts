import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AcreVirgateHideConverterInput = {
  readonly convention?: "standard_120_acre_hide" | "custom_acres_per_hide";
  readonly customAcresPerHide?: number;
  readonly hides?: number;
  readonly virgates?: number;
  readonly oxgangs?: number;
  readonly acres?: number;
};

export type AcreVirgateHideConverterOutput = {
  readonly totalAcres: number;
  readonly totalVirgates: number;
  readonly totalOxgangs: number;
  readonly hideEquivalent: number;
};

export const calculateAcreVirgateHideConverter = (
  input: AcreVirgateHideConverterInput,
): AcreVirgateHideConverterOutput => {
  const acresPerHide =
    (input.convention ?? "standard_120_acre_hide") === "custom_acres_per_hide"
      ? (input.customAcresPerHide ?? 120)
      : 120;
  if (!(Number.isFinite(acresPerHide) && acresPerHide > 0))
    return simpleError(
      "customAcresPerHide",
      "Custom hide size must be greater than zero.",
      "invalid_hide_size",
    );
  for (const key of ["hides", "virgates", "oxgangs", "acres"] as const) {
    const value = input[key] ?? 0;
    if (!(typeof value === "number" && Number.isFinite(value) && value >= 0))
      return simpleError(
        key,
        "Land quantities must be non-negative numbers.",
        "invalid_land",
      );
  }
  const totalAcres =
    (input.hides ?? 0) * acresPerHide +
    (input.virgates ?? 0) * (acresPerHide / 4) +
    (input.oxgangs ?? 0) * (acresPerHide / 8) +
    (input.acres ?? 0);
  const hasPositiveQuantity = [
    input.hides,
    input.virgates,
    input.oxgangs,
    input.acres,
  ].some((value) => (value ?? 0) > 0);
  if (!Number.isFinite(totalAcres) || (hasPositiveQuantity && totalAcres === 0))
    return simpleError(
      "acres",
      "The converted area is outside the finite numeric range.",
      "numeric_range",
    );
  const totalVirgates = totalAcres / (acresPerHide / 4);
  const totalOxgangs = totalAcres / (acresPerHide / 8);
  const hideEquivalent = totalAcres / acresPerHide;
  if (
    ![totalVirgates, totalOxgangs, hideEquivalent].every(Number.isFinite) ||
    (totalAcres > 0 &&
      (totalVirgates === 0 || totalOxgangs === 0 || hideEquivalent === 0))
  )
    return simpleError(
      "acres",
      "The converted area is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    totalAcres,
    totalVirgates,
    totalOxgangs,
    hideEquivalent,
  };
};

export const acreVirgateHideConverterExample = {
  input: { hides: 2, virgates: 1 },
  output: {
    totalAcres: 270,
    totalVirgates: 9,
    totalOxgangs: 18,
    hideEquivalent: 2.25,
  },
} satisfies ToolExample<
  AcreVirgateHideConverterInput,
  AcreVirgateHideConverterOutput
>;

export const acreVirgateHideConverterTool = createSimpleTool({
  id: "paleography/acre-virgate-hide-converter",
  title: "Acre Virgate Hide Converter",
  description:
    "Sum Domesday-style land holdings into acres using the standard four-virgate 120-acre hide (1 hide = 4 virgates = 8 oxgangs) or a custom documented hide size, since hide sizes varied locally.",
  inputs: [
    {
      default: "standard_120_acre_hide",
      description: "Hide-size convention to apply.",
      enum: ["standard_120_acre_hide", "custom_acres_per_hide"],
      id: "convention",
      kind: "string",
      label: "Convention",
    },
    {
      default: 120,
      description: "Acres per hide when the custom convention is chosen.",
      id: "customAcresPerHide",
      kind: "number",
      label: "Custom acres/hide",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 0,
      description: "Hides in the holding.",
      id: "hides",
      kind: "number",
      label: "Hides",
      minimum: 0,
    },
    {
      default: 0,
      description: "Virgates (yardlands) in the holding.",
      id: "virgates",
      kind: "number",
      label: "Virgates",
      minimum: 0,
    },
    {
      default: 0,
      description: "Oxgangs (bovates) in the holding.",
      id: "oxgangs",
      kind: "number",
      label: "Oxgangs",
      minimum: 0,
    },
    {
      default: 0,
      description: "Loose acres to add.",
      id: "acres",
      kind: "number",
      label: "Acres",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total area in acres.",
      id: "totalAcres",
      kind: "number",
      label: "Total acres",
    },
    {
      description: "Same area expressed in virgates.",
      id: "totalVirgates",
      kind: "number",
      label: "Virgates",
    },
    {
      description: "Same area expressed in oxgangs.",
      id: "totalOxgangs",
      kind: "number",
      label: "Oxgangs",
    },
    {
      description: "Same area expressed as a (possibly fractional) hide count.",
      id: "hideEquivalent",
      kind: "number",
      label: "Hides",
    },
  ],
  calculate: (input) =>
    calculateAcreVirgateHideConverter({
      acres: input.acres as number | undefined,
      convention:
        input.convention as AcreVirgateHideConverterInput["convention"],
      customAcresPerHide: input.customAcresPerHide as number | undefined,
      hides: input.hides as number | undefined,
      oxgangs: input.oxgangs as number | undefined,
      virgates: input.virgates as number | undefined,
    }),
});

export const runAcreVirgateHideConverter = acreVirgateHideConverterTool.execute;
export default acreVirgateHideConverterTool;
