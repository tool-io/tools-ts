import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly caseIds: readonly string[];
  readonly conditionCodes: readonly string[];
}>;
export type Output = Readonly<{
  readonly uniquePatients: number;
  readonly conditionLabels: readonly string[];
  readonly patientCounts: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.caseIds, input.conditionCodes, "caseIds");
  if (
    input.caseIds.some((v) => !v.trim()) ||
    input.conditionCodes.some((v) => !v.trim())
  )
    simpleError(
      "caseIds",
      "Nonempty patient IDs and condition codes required.",
    );
  const grouped = new Map<string, Set<string>>();
  input.conditionCodes.forEach((code, i) => {
    if (!grouped.has(code)) grouped.set(code, new Set());
    grouped.get(code)!.add(input.caseIds[i]);
  });
  const conditionLabels = [...new Set(input.conditionCodes)].sort(),
    patientCounts = conditionLabels.map((code) => grouped.get(code)!.size);
  return {
    uniquePatients: new Set(input.caseIds).size,
    conditionLabels,
    patientCounts,
  };
};
export const exampleInput = {
  caseIds: ["A", "A", "B"],
  conditionCodes: ["hydrocele", "lymphedema", "hydrocele"],
} satisfies Input;
export const exampleOutput = {
  uniquePatients: 2,
  conditionLabels: ["hydrocele", "lymphedema"],
  patientCounts: [2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/morbidity-register-summary",
  title: "Morbidity Register Summary",
  description:
    "Deduplicate a morbidity register and tally unique patients by reported condition code.",
  inputs: [
    { id: "caseIds", label: "Case ids", kind: "stringList" },
    { id: "conditionCodes", label: "Condition codes", kind: "stringList" },
  ],
  outputs: [
    { id: "uniquePatients", label: "Unique patients", kind: "number" },
    { id: "conditionLabels", label: "Condition labels", kind: "stringList" },
    { id: "patientCounts", label: "Patient counts", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      caseIds: value.caseIds as readonly string[],
      conditionCodes: value.conditionCodes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
