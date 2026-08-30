import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly seaLevelChangeM: number;
  readonly activeProfileWidthM: number;
  readonly closureDepthM: number;
  readonly bermHeightM: number;
}>;
export type Output = Readonly<{ readonly signedBruunRetreatM: number }>;
const inputFields = [
  { id: "seaLevelChangeM", label: "Sea level change m", kind: "number" },
  {
    id: "activeProfileWidthM",
    label: "Active profile width m",
    kind: "number",
  },
  { id: "closureDepthM", label: "Closure depth m", kind: "number" },
  { id: "bermHeightM", label: "Berm height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.activeProfileWidthM, "activeProfileWidthM");
  positive(input.closureDepthM, "closureDepthM");
  nonnegative(input.bermHeightM, "bermHeightM");
  return {
    signedBruunRetreatM:
      (input.seaLevelChangeM * input.activeProfileWidthM) /
      (input.closureDepthM + input.bermHeightM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  seaLevelChangeM: 0.5,
  activeProfileWidthM: 100,
  closureDepthM: 10,
  bermHeightM: 2,
} satisfies Input;
export const exampleOutput = {
  signedBruunRetreatM: 4.166666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/brunn-rule-shoreline-retreat",
  title: "Bruun Rule Shoreline Retreat",
  description:
    "Compute signed ideal Bruun profile-translation retreat using supplied active width/closure/berm, assuming conservation and no alongshore exchange; not a site forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBruunRetreatM",
      label: "Signed bruun retreat m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      seaLevelChangeM: value.seaLevelChangeM as number,
      activeProfileWidthM: value.activeProfileWidthM as number,
      closureDepthM: value.closureDepthM as number,
      bermHeightM: value.bermHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
