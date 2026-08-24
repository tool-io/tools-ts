import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmpersandEraMapperInput = {
  readonly century: number;
  readonly style:
    | "classical_ligature"
    | "caroline_rounded"
    | "gothic_compressed"
    | "humanist_roman";
};

export type AmpersandEraMapperOutput = {
  readonly plausibleForCentury: boolean;
  readonly expectedStyles: string;
};

const ERA_BANDS: ReadonlyArray<{
  readonly from: number;
  readonly style: string;
  readonly to: number;
}> = [
  { from: 1, style: "classical_ligature", to: 4 },
  { from: 8, style: "caroline_rounded", to: 12 },
  { from: 13, style: "gothic_compressed", to: 15 },
  { from: 15, style: "humanist_roman", to: 21 },
];

export const calculateAmpersandEraMapper = (
  input: AmpersandEraMapperInput,
): AmpersandEraMapperOutput => {
  if (!(
    Number.isSafeInteger(input.century) &&
    input.century >= 1 &&
    input.century <= 21
  ))
    return simpleError(
      "century",
      "Century must be a positive integer.",
      "invalid_century",
    );
  const expectedStyles = ERA_BANDS.filter(
    (band) => input.century >= band.from && input.century <= band.to,
  )
    .map((band) => band.style)
    .join("|");
  return {
    plausibleForCentury: expectedStyles.split("|").includes(input.style),
    expectedStyles,
  };
};

export const ampersandEraMapperExample = {
  input: { century: 15, style: "humanist_roman" },
  output: {
    plausibleForCentury: true,
    expectedStyles: "gothic_compressed|humanist_roman",
  },
} satisfies ToolExample<AmpersandEraMapperInput, AmpersandEraMapperOutput>;

export const ampersandEraMapperTool = createSimpleTool({
  id: "paleography/ampersand-era-mapper",
  title: "Ampersand Era Mapper",
  description:
    "Check whether an ampersand style fits a century against the stated band table (classical Et ligature 1st-4th c., Caroline rounded 8th-12th, Gothic compressed 13th-15th, humanist roman 15th-21st) and list all styles the century admits.",
  inputs: [
    {
      description: "Century of the witness.",
      id: "century",
      kind: "integer",
      label: "Century",
      maximum: 21,
      minimum: 1,
    },
    {
      description: "Observed ampersand form.",
      enum: [
        "classical_ligature",
        "caroline_rounded",
        "gothic_compressed",
        "humanist_roman",
      ],
      id: "style",
      kind: "string",
      label: "Style",
    },
  ],
  outputs: [
    {
      description: "True when the observed style lies inside its stated band.",
      id: "plausibleForCentury",
      kind: "boolean",
      label: "Plausible",
    },
    {
      description: "Pipe-separated styles whose bands cover the century.",
      id: "expectedStyles",
      kind: "string",
      label: "Expected styles",
    },
  ],
  calculate: (input) =>
    calculateAmpersandEraMapper({
      century: input.century as number,
      style: input.style as AmpersandEraMapperInput["style"],
    }),
});

export const runAmpersandEraMapper = ampersandEraMapperTool.execute;
export default ampersandEraMapperTool;
