import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly warpDenier: number;
  readonly weftDenier: number;
  readonly warpEndsPerCm: number;
  readonly weftPicksPerCm: number;
  readonly warpCrimpFraction: number;
  readonly weftCrimpFraction: number;
  readonly finishingMassMultiplier: number;
}>;
export type Output = Readonly<{
  readonly warpGsm: number;
  readonly weftGsm: number;
  readonly finishedFabricGsm: number;
}>;
const inputFields = [
  { id: "warpDenier", label: "Warp denier", kind: "number" },
  { id: "weftDenier", label: "Weft denier", kind: "number" },
  { id: "warpEndsPerCm", label: "Warp ends per cm", kind: "number" },
  { id: "weftPicksPerCm", label: "Weft picks per cm", kind: "number" },
  { id: "warpCrimpFraction", label: "Warp crimp fraction", kind: "number" },
  { id: "weftCrimpFraction", label: "Weft crimp fraction", kind: "number" },
  {
    id: "finishingMassMultiplier",
    label: "Finishing mass multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.warpDenier, "warpDenier");
  positive(input.weftDenier, "weftDenier");
  positive(input.finishingMassMultiplier, "finishingMassMultiplier");
  nonnegative(input.warpEndsPerCm, "warpEndsPerCm");
  nonnegative(input.weftPicksPerCm, "weftPicksPerCm");
  nonnegative(input.warpCrimpFraction, "warpCrimpFraction");
  nonnegative(input.weftCrimpFraction, "weftCrimpFraction");
  const warpGsm =
      ((input.warpDenier * input.warpEndsPerCm) / 90) *
      (1 + input.warpCrimpFraction),
    weftGsm =
      ((input.weftDenier * input.weftPicksPerCm) / 90) *
      (1 + input.weftCrimpFraction);
  return {
    warpGsm,
    weftGsm,
    finishedFabricGsm: (warpGsm + weftGsm) * input.finishingMassMultiplier,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  warpDenier: 90,
  weftDenier: 180,
  warpEndsPerCm: 20,
  weftPicksPerCm: 10,
  warpCrimpFraction: 0.1,
  weftCrimpFraction: 0.2,
  finishingMassMultiplier: 1.05,
} satisfies Input;
export const exampleOutput = {
  warpGsm: 22,
  weftGsm: 24,
  finishedFabricGsm: 48.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/fabric-gsm-from-denier-ends",
  title: "Fabric GSM From Denier Ends",
  description:
    "Estimate woven GSM from separate warp/weft denier, count and crimp with a caller finishing mass factor; excludes unmodeled dimensional shrinkage and nonwoven structure.",
  inputs: inputFields,
  outputs: [
    { id: "warpGsm", label: "Warp gsm", kind: "number" },
    { id: "weftGsm", label: "Weft gsm", kind: "number" },
    { id: "finishedFabricGsm", label: "Finished fabric gsm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      warpDenier: value.warpDenier as number,
      weftDenier: value.weftDenier as number,
      warpEndsPerCm: value.warpEndsPerCm as number,
      weftPicksPerCm: value.weftPicksPerCm as number,
      warpCrimpFraction: value.warpCrimpFraction as number,
      weftCrimpFraction: value.weftCrimpFraction as number,
      finishingMassMultiplier: value.finishingMassMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
