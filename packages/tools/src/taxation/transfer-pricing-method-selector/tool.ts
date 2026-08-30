import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reliableComparablePrice: boolean;
  readonly reliableResaleMargin: boolean;
  readonly reliableCostBase: boolean;
  readonly reliableMarkup: boolean;
}>;
export type Output = Readonly<{
  readonly selectedMethod: string;
  readonly supportedMethodCount: number;
}>;

export const calculate = (input: Input): Output => {
  const supported: string[] = [];
  if (input.reliableComparablePrice) supported.push("cup");
  if (input.reliableResaleMargin) supported.push("resale-price");
  if (input.reliableCostBase && input.reliableMarkup)
    supported.push("cost-plus");
  return {
    selectedMethod: supported.length === 1 ? supported[0] : "insufficient-data",
    supportedMethodCount: supported.length,
  };
};

export const exampleInput = {
  reliableComparablePrice: true,
  reliableResaleMargin: false,
  reliableCostBase: false,
  reliableMarkup: false,
} satisfies Input;
export const exampleOutput = {
  selectedMethod: "cup",
  supportedMethodCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      reliableComparablePrice: input.reliableComparablePrice as boolean,
      reliableResaleMargin: input.reliableResaleMargin as boolean,
      reliableCostBase: input.reliableCostBase as boolean,
      reliableMarkup: input.reliableMarkup as boolean,
    }),
  description:
    "Select a transfer-pricing method from caller-confirmed data availability without making a compliance determination.",
  id: "taxation/transfer-pricing-method-selector",
  inputs: [
    {
      id: "reliableComparablePrice",
      label: "Reliable uncontrolled comparable price",
      kind: "boolean",
    },
    {
      id: "reliableResaleMargin",
      label: "Reliable resale margin",
      kind: "boolean",
    },
    { id: "reliableCostBase", label: "Reliable cost base", kind: "boolean" },
    {
      id: "reliableMarkup",
      label: "Reliable arm’s-length markup",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "selectedMethod",
      label: "Selected method",
      kind: "string",
      enum: ["cup", "resale-price", "cost-plus", "insufficient-data"],
    },
    {
      id: "supportedMethodCount",
      label: "Supported method count",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Transfer-Pricing Method Selector",
});

export const run = tool.execute;
export default tool;
