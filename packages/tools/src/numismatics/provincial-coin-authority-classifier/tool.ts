import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly civicEthnicLegend: boolean;
  readonly imperialPortraitOrName: boolean;
  readonly namedRomanAuthority: boolean;
  readonly struckUnderRomanRule: boolean;
}>;
export type Output = Readonly<{
  readonly classification:
    "roman-provincial-imperial" | "civic-autonomous" | "insufficient-evidence";
}>;

export const calculate = (input: Input): Output => {
  const classification = !input.struckUnderRomanRule
    ? "insufficient-evidence"
    : input.imperialPortraitOrName || input.namedRomanAuthority
      ? "roman-provincial-imperial"
      : input.civicEthnicLegend
        ? "civic-autonomous"
        : "insufficient-evidence";
  return { classification };
};

export const example = {
  input: {
    civicEthnicLegend: true,
    imperialPortraitOrName: true,
    namedRomanAuthority: false,
    struckUnderRomanRule: true,
  },
  output: { classification: "roman-provincial-imperial" },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    civicEthnicLegend: true,
    imperialPortraitOrName: false,
    namedRomanAuthority: false,
    struckUnderRomanRule: true,
  },
  output: { classification: "civic-autonomous" },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      civicEthnicLegend: input.civicEthnicLegend as boolean,
      imperialPortraitOrName: input.imperialPortraitOrName as boolean,
      namedRomanAuthority: input.namedRomanAuthority as boolean,
      struckUnderRomanRule: input.struckUnderRomanRule as boolean,
    }),
  description:
    "Classify supplied authority and legend evidence as Roman provincial imperial, civic autonomous, or insufficient; the result is not an attribution.",
  id: "numismatics/provincial-coin-authority-classifier",
  inputs: [
    {
      id: "civicEthnicLegend",
      kind: "boolean",
      label: "Civic ethnic legend observed",
    },
    {
      id: "imperialPortraitOrName",
      kind: "boolean",
      label: "Imperial portrait or name observed",
    },
    {
      id: "namedRomanAuthority",
      kind: "boolean",
      label: "Named Roman authority observed",
    },
    {
      id: "struckUnderRomanRule",
      kind: "boolean",
      label: "Evidence supports Roman-period issue",
    },
  ],
  outputs: [
    {
      id: "classification",
      kind: "string",
      label: "Authority classification",
      enum: [
        "roman-provincial-imperial",
        "civic-autonomous",
        "insufficient-evidence",
      ],
    },
  ],
  title: "Provincial Coin Authority Classifier",
});

export const run = tool.execute;
export default tool;
