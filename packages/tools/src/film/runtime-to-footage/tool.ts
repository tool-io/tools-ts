import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RuntimeToFootageInput = Readonly<{
  readonly runtimeMinutes: number;
  readonly framesPerSecond: number;
  readonly framesPerFoot: number;
}>;
export type RuntimeToFootageOutput = Readonly<{
  readonly footageFeet: number;
}>;

export const calculateRuntimeToFootage = (
  x: RuntimeToFootageInput,
): RuntimeToFootageOutput => {
  if (!Number.isFinite(x.runtimeMinutes) || x.runtimeMinutes < 0)
    simpleError("runtimeMinutes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerFoot) || x.framesPerFoot < 0)
    simpleError("framesPerFoot", "Provide a finite number at least 0.");
  const footageFeet =
    (x.runtimeMinutes * 60 * x.framesPerSecond) / x.framesPerFoot;
  if (!Number.isFinite(footageFeet))
    simpleError(
      "footageFeet",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { footageFeet: Object.is(footageFeet, -0) ? 0 : footageFeet };
};

export const example = {
  input: { runtimeMinutes: 10, framesPerSecond: 24, framesPerFoot: 16 },
  output: { footageFeet: 900 },
} satisfies ToolExample<RuntimeToFootageInput, RuntimeToFootageOutput>;

export const tool = createSimpleTool({
  id: "film/runtime-to-footage",
  title: "Runtime To Footage",
  description:
    "Film footage needed for a runtime at a specified frame rate and gauge-dependent frames-per-foot value.",
  inputs: [
    {
      id: "runtimeMinutes",
      kind: "number",
      label: "Runtime Minutes",
      unit: "min",
      minimum: 0,
    },
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
    {
      id: "framesPerFoot",
      kind: "number",
      label: "Frames Per Foot",
      unit: "frames/ft",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "footageFeet", kind: "number", label: "Footage Feet", unit: "ft" },
  ],
  calculate: (input) =>
    calculateRuntimeToFootage({
      runtimeMinutes: input.runtimeMinutes as number,
      framesPerSecond: input.framesPerSecond as number,
      framesPerFoot: input.framesPerFoot as number,
    }),
});
export const runtimeToFootageTool = tool;
export const runRuntimeToFootage = tool.execute;
export default tool;
