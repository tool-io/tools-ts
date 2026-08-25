import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const ARRANGEMENTS = [
  "uniseriate",
  "biseriate",
  "multiseriate",
  "fasciculate",
] as const;

export type AscosporeArrangementDecoderInput = {
  readonly arrangement: (typeof ARRANGEMENTS)[number];
};

export type AscosporeArrangementDecoderOutput = {
  readonly arrangementClass: AscosporeArrangementDecoderInput["arrangement"];
  readonly interpretation: string;
};

export const ascosporeArrangementDecoderExample = {
  input: { arrangement: "uniseriate" },
  output: {
    arrangementClass: "uniseriate",
    interpretation: "Ascospores are arranged in one row within the ascus.",
  },
} satisfies ToolExample<
  AscosporeArrangementDecoderInput,
  AscosporeArrangementDecoderOutput
>;

const INTERPRETATIONS: Record<
  AscosporeArrangementDecoderInput["arrangement"],
  string
> = {
  biseriate: "Ascospores are arranged in two rows within the ascus.",
  fasciculate: "Ascospores are grouped in a parallel bundle within the ascus.",
  multiseriate: "Ascospores occupy more than two rows within the ascus.",
  uniseriate: "Ascospores are arranged in one row within the ascus.",
};

export const calculateAscosporeArrangementDecoder = (
  input: AscosporeArrangementDecoderInput,
): AscosporeArrangementDecoderOutput => {
  const interpretation = INTERPRETATIONS[input.arrangement];
  if (interpretation === undefined)
    return simpleError(
      "arrangement",
      "Select a supported ascospore arrangement.",
      "invalid_arrangement",
    );
  return { arrangementClass: input.arrangement, interpretation };
};

export const ascosporeArrangementDecoderTool = createSimpleTool({
  id: "mycology/ascospore-arrangement-decoder",
  title: "Arrangement Decoder",
  description: "Decode the ascospore arrangement observed inside an ascus.",
  inputs: [
    {
      enum: ARRANGEMENTS,
      id: "arrangement",
      kind: "string",
      label: "Arrangement",
    },
  ],
  outputs: [
    {
      enum: ARRANGEMENTS,
      id: "arrangementClass",
      kind: "string",
      label: "Arrangement class",
    },
    { id: "interpretation", kind: "string", label: "Interpretation" },
  ],
  calculate: (input) =>
    calculateAscosporeArrangementDecoder({
      arrangement:
        input.arrangement as AscosporeArrangementDecoderInput["arrangement"],
    }),
});
export const runAscosporeArrangementDecoder =
  ascosporeArrangementDecoderTool.execute;
export default ascosporeArrangementDecoderTool;
