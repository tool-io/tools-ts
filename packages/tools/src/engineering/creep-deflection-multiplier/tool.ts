import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CreepDeflectionMultiplierInput = Readonly<{
  readonly instantDeflectionMillimeters: number;
  readonly creepCoefficient: number;
}>;
export type CreepDeflectionMultiplierOutput = Readonly<{
  readonly longTermDeflectionMillimeters: number;
}>;

export const calculateCreepDeflectionMultiplier = (
  x: CreepDeflectionMultiplierInput,
): CreepDeflectionMultiplierOutput => {
  if (
    !Number.isFinite(x.instantDeflectionMillimeters) ||
    x.instantDeflectionMillimeters < 0
  )
    simpleError(
      "instantDeflectionMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.creepCoefficient) || x.creepCoefficient < 0)
    simpleError("creepCoefficient", "Provide a finite number at least 0.");
  const longTermDeflectionMillimeters =
    x.instantDeflectionMillimeters * (1 + x.creepCoefficient);
  if (!Number.isFinite(longTermDeflectionMillimeters))
    simpleError(
      "longTermDeflectionMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    longTermDeflectionMillimeters: Object.is(longTermDeflectionMillimeters, -0)
      ? 0
      : longTermDeflectionMillimeters,
  };
};

export const example = {
  input: { instantDeflectionMillimeters: 10, creepCoefficient: 2 },
  output: { longTermDeflectionMillimeters: 30 },
} satisfies ToolExample<
  CreepDeflectionMultiplierInput,
  CreepDeflectionMultiplierOutput
>;

export const tool = createSimpleTool({
  id: "engineering/creep-deflection-multiplier",
  title: "Creep Deflection Multiplier",
  description:
    "Long-term deflection estimate δinstant(1+φ) from an assumed creep amplification coefficient; excludes shrinkage.",
  inputs: [
    {
      id: "instantDeflectionMillimeters",
      kind: "number",
      label: "Instant Deflection Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "creepCoefficient",
      kind: "number",
      label: "Creep Coefficient",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "longTermDeflectionMillimeters",
      kind: "number",
      label: "Long Term Deflection Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCreepDeflectionMultiplier({
      instantDeflectionMillimeters:
        input.instantDeflectionMillimeters as number,
      creepCoefficient: input.creepCoefficient as number,
    }),
});
export const creepDeflectionMultiplierTool = tool;
export const runCreepDeflectionMultiplier = tool.execute;
export default tool;
