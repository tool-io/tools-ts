import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FootageToRuntimeInput = Readonly<{
  readonly footageFeet: number;
  readonly framesPerFoot: number;
  readonly framesPerSecond: number;
}>;
export type FootageToRuntimeOutput = Readonly<{
  readonly runtimeMinutes: number;
}>;

export const calculateFootageToRuntime = (
  x: FootageToRuntimeInput,
): FootageToRuntimeOutput => {
  if (!Number.isFinite(x.footageFeet) || x.footageFeet < 0)
    simpleError("footageFeet", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerFoot) || x.framesPerFoot < 0)
    simpleError("framesPerFoot", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  const runtimeMinutes =
    (x.footageFeet * x.framesPerFoot) / (x.framesPerSecond * 60);
  if (!Number.isFinite(runtimeMinutes))
    simpleError(
      "runtimeMinutes",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { runtimeMinutes: Object.is(runtimeMinutes, -0) ? 0 : runtimeMinutes };
};

export const example = {
  input: { footageFeet: 900, framesPerFoot: 16, framesPerSecond: 24 },
  output: { runtimeMinutes: 10 },
} satisfies ToolExample<FootageToRuntimeInput, FootageToRuntimeOutput>;

export const tool = createSimpleTool({
  id: "film/footage-to-runtime",
  title: "Footage To Runtime",
  description:
    "Film runtime from footage, gauge-specific frames per foot and projection frame rate.",
  inputs: [
    {
      id: "footageFeet",
      kind: "number",
      label: "Footage Feet",
      unit: "ft",
      minimum: 0,
    },
    {
      id: "framesPerFoot",
      kind: "number",
      label: "Frames Per Foot",
      unit: "frames/ft",
      minimum: 0,
    },
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "runtimeMinutes",
      kind: "number",
      label: "Runtime Minutes",
      unit: "min",
    },
  ],
  calculate: (input) =>
    calculateFootageToRuntime({
      footageFeet: input.footageFeet as number,
      framesPerFoot: input.framesPerFoot as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const footageToRuntimeTool = tool;
export const runFootageToRuntime = tool.execute;
export default tool;
