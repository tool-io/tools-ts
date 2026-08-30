import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for mintmark record match.",
  expected: { id: "documentedMintmarks", label: "Documented mintmarks" },
  example: { expected: ["P", "D", "S"], observed: ["D", "S", "O"] },
  id: "numismatics/mintmark-record-match",
  observed: { id: "observedMintmarks", label: "Observed mintmarks" },
  title: "Mintmark Record Match",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
