import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Duebelabstand32mmSystemInput = Readonly<{
  readonly firstCenterMillimeters: number;
  readonly holeIndex: number;
}>;
export type Duebelabstand32mmSystemOutput = Readonly<{
  readonly centerMillimeters: number;
}>;

export const calculateDuebelabstand32mmSystem = (
  x: Duebelabstand32mmSystemInput,
): Duebelabstand32mmSystemOutput => {
  if (
    !Number.isFinite(x.firstCenterMillimeters) ||
    x.firstCenterMillimeters < 0
  )
    simpleError(
      "firstCenterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.holeIndex) ||
    !Number.isSafeInteger(x.holeIndex) ||
    x.holeIndex < 0
  )
    simpleError("holeIndex", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.holeIndex))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerMillimeters = x.firstCenterMillimeters + 32 * x.holeIndex;
  if (!Number.isFinite(centerMillimeters))
    simpleError(
      "centerMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    centerMillimeters: Object.is(centerMillimeters, -0) ? 0 : centerMillimeters,
  };
};

export const example = {
  input: { firstCenterMillimeters: 37, holeIndex: 4 },
  output: { centerMillimeters: 165 },
} satisfies ToolExample<
  Duebelabstand32mmSystemInput,
  Duebelabstand32mmSystemOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/duebelabstand-32mm-system",
  title: "Duebelabstand 32mm System",
  description:
    "Center position of a selected hole on a 32 mm cabinet-system row from its first center and zero-based hole index.",
  inputs: [
    {
      id: "firstCenterMillimeters",
      kind: "number",
      label: "First Center Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "holeIndex", kind: "integer", label: "Hole Index", minimum: 0 },
  ],
  outputs: [
    {
      id: "centerMillimeters",
      kind: "number",
      label: "Center Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDuebelabstand32mmSystem({
      firstCenterMillimeters: input.firstCenterMillimeters as number,
      holeIndex: input.holeIndex as number,
    }),
});
export const duebelabstand32mmSystemTool = tool;
export const runDuebelabstand32mmSystem = tool.execute;
export default tool;
