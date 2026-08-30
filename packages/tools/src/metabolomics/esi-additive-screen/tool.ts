import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly usedAdditives: readonly string[];
  readonly approvedAdditives: readonly string[];
}>;
export type Output = Readonly<{
  readonly incompatibleAdditives: readonly string[];
  readonly approvedCount: number;
  readonly compatible: boolean;
}>;
export const calculate = (input: Input): Output => {
  const allowed = new Set(
    input.approvedAdditives.map((v) => v.trim().toLowerCase()),
  );
  const incompatibleAdditives = input.usedAdditives.filter(
    (v) => !allowed.has(v.trim().toLowerCase()),
  );
  return {
    incompatibleAdditives,
    approvedCount: input.usedAdditives.length - incompatibleAdditives.length,
    compatible: incompatibleAdditives.length === 0,
  };
};
export const exampleInput = {
  usedAdditives: ["formate", "acetate"],
  approvedAdditives: ["formate", "acetate", "water"],
} satisfies Input;
export const exampleOutput = {
  incompatibleAdditives: [],
  approvedCount: 2,
  compatible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/esi-additive-screen",
  title: "ESI Additive Screen",
  description:
    "Check ESI mobile-phase additives against the caller’s validated compatibility list.",
  inputs: [
    { id: "usedAdditives", kind: "stringList", label: "Used additives" },
    {
      id: "approvedAdditives",
      kind: "stringList",
      label: "Approved additives",
    },
  ],
  outputs: [
    {
      id: "incompatibleAdditives",
      kind: "stringList",
      label: "Incompatible additives",
    },
    { id: "approvedCount", kind: "number", label: "Approved count" },
    { id: "compatible", kind: "boolean", label: "Compatible" },
  ],
  calculate: (value) =>
    calculate({
      usedAdditives: value.usedAdditives as readonly string[],
      approvedAdditives: value.approvedAdditives as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
