import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LochreiheSystem32BohrungenInput = Readonly<{
  readonly firstCenterMillimeters: number;
  readonly lastUsableMillimeters: number;
}>;
export type LochreiheSystem32BohrungenOutput = Readonly<{
  readonly holeCount: number;
}>;

export const calculateLochreiheSystem32Bohrungen = (
  x: LochreiheSystem32BohrungenInput,
): LochreiheSystem32BohrungenOutput => {
  if (
    !Number.isFinite(x.firstCenterMillimeters) ||
    x.firstCenterMillimeters < 0
  )
    simpleError(
      "firstCenterMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.lastUsableMillimeters) || x.lastUsableMillimeters < 0)
    simpleError("lastUsableMillimeters", "Provide a finite number at least 0.");
  if (x.lastUsableMillimeters < x.firstCenterMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const holeCount =
    Math.floor((x.lastUsableMillimeters - x.firstCenterMillimeters) / 32) + 1;
  if (!Number.isFinite(holeCount) || !Number.isSafeInteger(holeCount))
    simpleError(
      "holeCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { holeCount: Object.is(holeCount, -0) ? 0 : holeCount };
};

export const example = {
  input: { firstCenterMillimeters: 37, lastUsableMillimeters: 165 },
  output: { holeCount: 5 },
} satisfies ToolExample<
  LochreiheSystem32BohrungenInput,
  LochreiheSystem32BohrungenOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/lochreihe-system32-bohrungen",
  title: "Lochreihe System32 Bohrungen",
  description:
    "Number of 32 mm-spaced hole centers that fit from a first center through a maximum usable end position, inclusive.",
  inputs: [
    {
      id: "firstCenterMillimeters",
      kind: "number",
      label: "First Center Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "lastUsableMillimeters",
      kind: "number",
      label: "Last Usable Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "holeCount", kind: "integer", label: "Hole Count" }],
  calculate: (input) =>
    calculateLochreiheSystem32Bohrungen({
      firstCenterMillimeters: input.firstCenterMillimeters as number,
      lastUsableMillimeters: input.lastUsableMillimeters as number,
    }),
});
export const lochreiheSystem32BohrungenTool = tool;
export const runLochreiheSystem32Bohrungen = tool.execute;
export default tool;
