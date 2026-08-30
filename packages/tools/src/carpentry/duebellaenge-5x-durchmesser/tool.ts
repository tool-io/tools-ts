import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Duebellaenge5xDurchmesserInput = Readonly<{
  readonly diameterMillimeters: number;
}>;
export type Duebellaenge5xDurchmesserOutput = Readonly<{
  readonly suggestedLengthMillimeters: number;
}>;

export const calculateDuebellaenge5xDurchmesser = (
  x: Duebellaenge5xDurchmesserInput,
): Duebellaenge5xDurchmesserOutput => {
  if (!Number.isFinite(x.diameterMillimeters) || x.diameterMillimeters < 0)
    simpleError("diameterMillimeters", "Provide a finite number at least 0.");
  const suggestedLengthMillimeters = 5 * x.diameterMillimeters;
  if (!Number.isFinite(suggestedLengthMillimeters))
    simpleError(
      "suggestedLengthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    suggestedLengthMillimeters: Object.is(suggestedLengthMillimeters, -0)
      ? 0
      : suggestedLengthMillimeters,
  };
};

export const example = {
  input: { diameterMillimeters: 8 },
  output: { suggestedLengthMillimeters: 40 },
} satisfies ToolExample<
  Duebellaenge5xDurchmesserInput,
  Duebellaenge5xDurchmesserOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/duebellaenge-5x-durchmesser",
  title: "Duebellaenge 5x Durchmesser",
  description:
    "Rule-of-thumb wooden dowel length equal to five times dowel diameter; verify actual embedment and joint design.",
  inputs: [
    {
      id: "diameterMillimeters",
      kind: "number",
      label: "Diameter Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "suggestedLengthMillimeters",
      kind: "number",
      label: "Suggested Length Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDuebellaenge5xDurchmesser({
      diameterMillimeters: input.diameterMillimeters as number,
    }),
});
export const duebellaenge5xDurchmesserTool = tool;
export const runDuebellaenge5xDurchmesser = tool.execute;
export default tool;
