import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const jahnTellerDistortionCheckerTool = createSimpleTool({
  id: "chemistry/jahn-teller-distortion-checker",
  title: "Octahedral Jahn-Teller Distortion Checker",
  description:
    "Check whether an octahedral complex has uneven e_g occupancy and therefore a strong Jahn-Teller distortion; t2g-only weak distortions are outside this check.",
  inputs: [
    {
      description:
        "Number of electrons in the two degenerate e_g orbitals (0 through 4).",
      id: "egElectronCount",
      kind: "integer",
      label: "e_g electrons",
      maximum: 4,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Whether uneven e_g occupancy predicts a strong distortion.",
      id: "strongDistortionExpected",
      kind: "boolean",
      label: "Strong distortion expected",
    },
  ],
  calculate: (input) => ({
    strongDistortionExpected: [1, 3].includes(input.egElectronCount as number),
  }),
});
export default jahnTellerDistortionCheckerTool;
export const runJahnTellerDistortionChecker =
  jahnTellerDistortionCheckerTool.execute;

export type JahnTellerDistortionCheckerInput = {
  readonly egElectronCount: number;
};
export type JahnTellerDistortionCheckerOutput = {
  readonly strongDistortionExpected: boolean;
};

export const jahnTellerDistortionCheckerExample = {
  input: { egElectronCount: 3 },
  output: { strongDistortionExpected: true },
} satisfies ToolExample<
  JahnTellerDistortionCheckerInput,
  JahnTellerDistortionCheckerOutput
>;
