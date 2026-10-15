import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch53-shared.js";

export type Input = Readonly<{
  startCodonOffset: number;
  stopCodonOffset: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "startCodonOffset", label: "Start codon offset", kind: "number" },
  { id: "stopCodonOffset", label: "Stop codon offset", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.startCodonOffset, "start", 0, 1e12);
  bounded(i.stopCodonOffset, "stop", i.startCodonOffset + 3, 1e12);
  const codingBases = i.stopCodonOffset - i.startCodonOffset;
  if (codingBases % 3)
    simpleError("frame", "Same-frame zero-based codon starts required.");
  return {
    codingBasesExcludingStop: codingBases,
    aminoAcidCount: codingBases / 3,
    spanIncludingStop: codingBases + 3,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { startCodonOffset: 0, stopCodonOffset: 9 },
  output: {
    result: {
      codingBasesExcludingStop: 9,
      aminoAcidCount: 3,
      spanIncludingStop: 12,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/startstop-distance-orf-length-calculator",
  title: "Start-Stop Codon Distance bp ORF Length Calculator",
  description:
    "Compute ORF length from independently identified same-frame zero-based codon starts, excluding the stop from translated length; no ORF scan.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          codingBasesExcludingStop: { type: "number" },
          aminoAcidCount: { type: "number" },
          spanIncludingStop: { type: "number" },
        },
        required: [
          "codingBasesExcludingStop",
          "aminoAcidCount",
          "spanIncludingStop",
        ],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
