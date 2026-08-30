import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openingItems: number;
  readonly newItems: number;
  readonly closedItems: number;
  readonly waivedItems: number;
  readonly materialOpenItems: number;
}>;
export type Output = Readonly<{
  readonly calculatedOpenItems: number;
  readonly zeroOpenItems: boolean;
  readonly certificationReady: boolean;
}>;

export const calculate = (input: Input): Output => {
  const calculatedOpenItems =
    input.openingItems + input.newItems - input.closedItems - input.waivedItems;
  if (calculatedOpenItems < 0 || input.materialOpenItems > calculatedOpenItems)
    simpleError(
      "closedItems",
      "Closures and waivers cannot exceed available items.",
      "invalid_rollforward",
    );
  return {
    calculatedOpenItems,
    zeroOpenItems: calculatedOpenItems === 0,
    certificationReady:
      calculatedOpenItems === 0 && input.materialOpenItems === 0,
  };
};

export const exampleInput = {
  openingItems: 5,
  newItems: 2,
  closedItems: 6,
  waivedItems: 1,
  materialOpenItems: 0,
} satisfies Input;
export const exampleOutput = {
  calculatedOpenItems: 0,
  zeroOpenItems: true,
  certificationReady: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openingItems: input.openingItems as number,
      newItems: input.newItems as number,
      closedItems: input.closedItems as number,
      waivedItems: input.waivedItems as number,
      materialOpenItems: input.materialOpenItems as number,
    }),
  description:
    "Roll forward audit issues and assess zero-open-item certification readiness.",
  id: "auditing/open-item-certification",
  inputs: [
    {
      id: "openingItems",
      label: "Opening rollforward items",
      kind: "integer",
      minimum: 0,
    },
    { id: "newItems", label: "New items", kind: "integer", minimum: 0 },
    { id: "closedItems", label: "Closed items", kind: "integer", minimum: 0 },
    { id: "waivedItems", label: "Waived items", kind: "integer", minimum: 0 },
    {
      id: "materialOpenItems",
      label: "Material open items",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "calculatedOpenItems",
      label: "Calculated open items",
      kind: "integer",
      minimum: 0,
    },
    { id: "zeroOpenItems", label: "No open items", kind: "boolean" },
    {
      id: "certificationReady",
      label: "Ready for zero-open-item certification",
      kind: "boolean",
    },
  ],
  title: "Open-Item Certification",
});

export const run = tool.execute;
export default tool;
