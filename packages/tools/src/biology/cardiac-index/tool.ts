import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CardiacIndexInput = {
  readonly cardiacOutputLPerMin: number;
  readonly bodySurfaceAreaM2: number;
};

export type CardiacIndexOutput = {
  readonly cardiacIndex: number;
};

export const cardiacIndexExample = {
  input: { cardiacOutputLPerMin: 5, bodySurfaceAreaM2: 1.8 },
  output: { cardiacIndex: 2.7777777777777777 },
} satisfies ToolExample<CardiacIndexInput, CardiacIndexOutput>;

export const cardiacIndexTool = createSimpleTool({
  id: "biology/cardiac-index",
  title: "Cardiac Index",
  description:
    "Compute cardiac index as cardiac output divided by body surface area.",
  inputs: [
    {
      id: "cardiacOutputLPerMin",
      kind: "number",
      label: "Cardiac output",
      minimum: Number.MIN_VALUE,
      unit: "L/min",
    },
    {
      id: "bodySurfaceAreaM2",
      kind: "number",
      label: "Body surface area",
      minimum: Number.MIN_VALUE,
      unit: "m²",
    },
  ],
  outputs: [
    {
      id: "cardiacIndex",
      kind: "number",
      label: "Cardiac index",
      unit: "L/min/m²",
    },
  ],
  calculate: (input) => ({
    cardiacIndex:
      (input.cardiacOutputLPerMin as number) /
      (input.bodySurfaceAreaM2 as number),
  }),
});
export const runCardiacIndex = cardiacIndexTool.execute;
export default cardiacIndexTool;
