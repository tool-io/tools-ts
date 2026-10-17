import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly germanicOriginTokens: number;
  readonly latinateOriginTokens: number;
  readonly unknownOriginTokens: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "germanicOriginTokens",
    label: "Germanic origin tokens",
    kind: "number",
  },
  {
    id: "latinateOriginTokens",
    label: "Latinate origin tokens",
    kind: "number",
  },
  { id: "unknownOriginTokens", label: "Unknown origin tokens", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  [
    i.germanicOriginTokens,
    i.latinateOriginTokens,
    i.unknownOriginTokens,
  ].forEach((v) => bounded(v, "tokens", 0, 1000000000));
  const total = positive(
    i.germanicOriginTokens + i.latinateOriginTokens + i.unknownOriginTokens,
    "total",
  );
  return {
    germanicPercent: (100 * i.germanicOriginTokens) / total,
    latinatePercent: (100 * i.latinateOriginTokens) / total,
    unknownPercent: (100 * i.unknownOriginTokens) / total,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    germanicOriginTokens: 50,
    latinateOriginTokens: 30,
    unknownOriginTokens: 20,
  },
  output: {
    result: { germanicPercent: 50, latinatePercent: 30, unknownPercent: 20 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/english-germanic-latin-origin-percent-estimate",
  title: "English Germanic vs Latin Origin Percent Estimate",
  description:
    "Observed caller independently etymologized token shares, unknowns retained; does not infer word origins from spellings or offer a universal English percentage.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          germanicPercent: { type: "number" },
          latinatePercent: { type: "number" },
          unknownPercent: { type: "number" },
        },
        required: ["germanicPercent", "latinatePercent", "unknownPercent"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
