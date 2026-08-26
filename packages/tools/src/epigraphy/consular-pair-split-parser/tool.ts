import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConsularPairSplitParserInput = {
  readonly consuls: string;
};

export type ConsularPairSplitParserOutput = {
  readonly consulPrior: string;
  readonly consulPosterior: string;
};

export const calculateConsularPairSplitParser = (
  input: ConsularPairSplitParserInput,
): ConsularPairSplitParserOutput => {
  if (!input.consuls.trim())
    simpleError(
      "consuls",
      "Consular line must contain characters.",
      "empty_consuls",
    );
  const parts = input.consuls.split(",").map((part) => part.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1])
    return simpleError(
      "consuls",
      "Expected exactly two comma-separated consuls.",
      "invalid_pair",
    );
  return { consulPrior: parts[0], consulPosterior: parts[1] };
};

export const consularPairSplitParserExample = {
  input: { consuls: "L. Calpurnius Piso Frugi, C. Cassius Longinus" },
  output: {
    consulPrior: "L. Calpurnius Piso Frugi",
    consulPosterior: "C. Cassius Longinus",
  },
} satisfies ToolExample<
  ConsularPairSplitParserInput,
  ConsularPairSplitParserOutput
>;

export const consularPairSplitParserTool = createSimpleTool({
  id: "epigraphy/consular-pair-split-parser",
  title: "Consular Pair Name Split Comma Parser",
  description:
    "Splits a comma-separated consular year line into its prior and posterior consuls.",
  inputs: [
    {
      id: "consuls",
      kind: "string",
      label: "Consuls",
      description: "Consular pair separated by one comma.",
    },
  ],
  outputs: [
    {
      id: "consulPrior",
      kind: "string",
      label: "Prior consul",
      description: "Name before the comma.",
    },
    {
      id: "consulPosterior",
      kind: "string",
      label: "Posterior consul",
      description: "Name after the comma.",
    },
  ],
  calculate: (input) =>
    calculateConsularPairSplitParser(
      input as unknown as ConsularPairSplitParserInput,
    ),
});

export const runConsularPairSplitParser = consularPairSplitParserTool.execute;
export default consularPairSplitParserTool;
