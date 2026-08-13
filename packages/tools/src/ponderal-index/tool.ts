import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";
export const calculatePonderalIndex = (
  group: "adult" | "newborn",
  system: "metric" | "us",
  weight: number,
  height: number,
): number | null => {
  if (
    !Number.isFinite(weight) ||
    !Number.isFinite(height) ||
    weight <= 0 ||
    height <= 0
  )
    return null;
  const kilograms = system === "metric" ? weight : weight * 0.45359237,
    meters = system === "metric" ? height / 100 : height * 0.0254,
    index = kilograms / meters ** 3;
  return group === "newborn" ? index / 10 : index;
};
export const ponderalIndexExample = {
  input: { group: "adult", height: 180, system: "metric", weight: 80 },
  output: { index: 13.717421124828531 },
} satisfies ToolExample<
  {
    readonly group: string;
    readonly height: number;
    readonly system: string;
    readonly weight: number;
  },
  { readonly index: number }
>;
export const ponderalIndexTool = createSimpleTool({
  id: "ponderal-index",
  title: "Ponderal Index Calculator",
  description:
    "Calculate the adult or newborn Ponderal Index from weight and height.",
  inputs: [
    {
      enum: ["adult", "newborn"],
      id: "group",
      kind: "string",
      label: "Calculation",
    },
    {
      enum: ["metric", "us"],
      id: "system",
      kind: "string",
      label: "Measurement system",
    },
    {
      id: "weight",
      kind: "number",
      label: "Weight",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "height",
      kind: "number",
      label: "Height or length",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "body-index/ponderal",
      id: "index",
      kind: "number",
      label: "Ponderal Index",
    },
  ],
  calculate: (input) => {
    const index = calculatePonderalIndex(
      input.group as "adult" | "newborn",
      input.system as "metric" | "us",
      input.weight as number,
      input.height as number,
    );
    if (index === null)
      return simpleError("weight", "Weight and height must be positive.");
    return { index };
  },
});
export const runPonderalIndex = ponderalIndexTool.execute;
export default ponderalIndexTool;
