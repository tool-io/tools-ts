import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly grossCededLoss: number;
  readonly layerAttachments: readonly number[];
  readonly layerLimits: readonly number[];
}>;
export type Output = Readonly<{
  readonly layerRecoveries: readonly number[];
  readonly totalRecovery: number;
  readonly netRetainedLoss: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.layerAttachments.length;
  if (
    n === 0 ||
    input.layerLimits.length !== n ||
    input.layerAttachments.some((value) => value < 0) ||
    input.layerLimits.some((value) => value < 0)
  )
    simpleError(
      "layerAttachments",
      "Aligned nonnegative attachments and limits are required.",
      "invalid_layers",
    );
  const layerRecoveries = input.layerAttachments.map((attachment, index) =>
      Math.min(
        input.layerLimits[index],
        Math.max(0, input.grossCededLoss - attachment),
      ),
    ),
    totalRecovery = Math.min(
      input.grossCededLoss,
      layerRecoveries.reduce((a, b) => a + b, 0),
    );
  return {
    layerRecoveries,
    totalRecovery,
    netRetainedLoss: input.grossCededLoss - totalRecovery,
  };
};

export const exampleInput = {
  grossCededLoss: 500,
  layerAttachments: [100, 300],
  layerLimits: [200, 100],
} satisfies Input;
export const exampleOutput = {
  layerRecoveries: [200, 100],
  totalRecovery: 300,
  netRetainedLoss: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      grossCededLoss: input.grossCededLoss as number,
      layerAttachments: input.layerAttachments as readonly number[],
      layerLimits: input.layerLimits as readonly number[],
    }),
  description:
    "Apply retrocession attachments and limits to a gross ceded loss.",
  id: "insurance/retrocession-waterfall",
  inputs: [
    {
      id: "grossCededLoss",
      label: "Gross ceded loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "layerAttachments",
      label: "Retrocession layer attachments",
      kind: "numberList",
    },
    {
      id: "layerLimits",
      label: "Retrocession layer limits",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "layerRecoveries", label: "Recoveries by layer", kind: "numberList" },
    {
      id: "totalRecovery",
      label: "Total retrocession recovery",
      kind: "number",
      minimum: 0,
    },
    {
      id: "netRetainedLoss",
      label: "Net retained loss",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Retrocession Waterfall",
});

export const run = tool.execute;
export default tool;
