import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RafterLengthTheoreticalInput = Readonly<{
  readonly runM: number;
  readonly riseM: number;
}>;
export type RafterLengthTheoreticalOutput = Readonly<{
  readonly rafterLengthM: number;
}>;

export const calculateRafterLengthTheoretical = (
  x: RafterLengthTheoreticalInput,
): RafterLengthTheoreticalOutput => {
  if (!Number.isFinite(x.runM) || x.runM < 0)
    simpleError("runM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.riseM) || x.riseM < 0)
    simpleError("riseM", "Provide a finite number at least 0.");
  const rafterLengthM = Math.hypot(x.runM, x.riseM);
  if (!Number.isFinite(rafterLengthM))
    simpleError("rafterLengthM", "The inputs produce an invalid result.");
  return { rafterLengthM: Object.is(rafterLengthM, -0) ? 0 : rafterLengthM };
};

export const example = {
  input: { runM: 3, riseM: 4 },
  output: { rafterLengthM: 5 },
} satisfies ToolExample<
  RafterLengthTheoreticalInput,
  RafterLengthTheoreticalOutput
>;

export const tool = createSimpleTool({
  id: "construction/rafter-length-theoretical",
  title: "Theoretical Rafter Length",
  description:
    "Find the straight-line rafter length between eave and ridge from horizontal run and vertical rise; excludes overhang and cuts.",
  inputs: [
    {
      id: "runM",
      kind: "number",
      label: "Horizontal run",
      unit: "m",
      minimum: 0,
    },
    {
      id: "riseM",
      kind: "number",
      label: "Vertical rise",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rafterLengthM",
      kind: "number",
      label: "Theoretical rafter length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateRafterLengthTheoretical({
      runM: input.runM as number,
      riseM: input.riseM as number,
    }),
});
export const rafterLengthTheoreticalTool = tool;
export const runRafterLengthTheoretical = tool.execute;
export default tool;
