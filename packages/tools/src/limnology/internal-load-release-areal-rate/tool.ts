import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly waterColumnStorageChangeKg: number;
  readonly externalImportedPhosphorusKg: number;
  readonly exportedPhosphorusKg: number;
  readonly intervalDays: number;
  readonly activeSedimentAreaM2: number;
}>;
export type Output = Readonly<{
  readonly inferredInternalReleaseKg: number;
  readonly signedArealReleaseGramsPerM2Day: number;
}>;
const inputFields = [
  {
    id: "waterColumnStorageChangeKg",
    label: "Water column storage change kg",
    kind: "number",
  },
  {
    id: "externalImportedPhosphorusKg",
    label: "External imported phosphorus kg",
    kind: "number",
  },
  {
    id: "exportedPhosphorusKg",
    label: "Exported phosphorus kg",
    kind: "number",
  },
  { id: "intervalDays", label: "Interval days", kind: "number" },
  {
    id: "activeSedimentAreaM2",
    label: "Active sediment area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.intervalDays, "intervalDays");
  positive(input.activeSedimentAreaM2, "activeSedimentAreaM2");
  nonnegative(
    input.externalImportedPhosphorusKg,
    "externalImportedPhosphorusKg",
  );
  nonnegative(input.exportedPhosphorusKg, "exportedPhosphorusKg");
  const inferredInternalReleaseKg =
    input.waterColumnStorageChangeKg +
    input.exportedPhosphorusKg -
    input.externalImportedPhosphorusKg;
  return {
    inferredInternalReleaseKg,
    signedArealReleaseGramsPerM2Day:
      (1000 * inferredInternalReleaseKg) /
      (input.intervalDays * input.activeSedimentAreaM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waterColumnStorageChangeKg: 10,
  externalImportedPhosphorusKg: 3,
  exportedPhosphorusKg: 5,
  intervalDays: 2,
  activeSedimentAreaM2: 100,
} satisfies Input;
export const exampleOutput = {
  inferredInternalReleaseKg: 12,
  signedArealReleaseGramsPerM2Day: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/internal-load-release-areal-rate",
  title: "Internal Load Release Areal Rate",
  description:
    "Infer signed internal phosphorus release as the residual of observed water inventory and external exchange, normalized by active sediment area/time; other missing processes can contribute to the residual.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredInternalReleaseKg",
      label: "Inferred internal release kg",
      kind: "number",
    },
    {
      id: "signedArealReleaseGramsPerM2Day",
      label: "Signed areal release grams per m2 day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      waterColumnStorageChangeKg: value.waterColumnStorageChangeKg as number,
      externalImportedPhosphorusKg:
        value.externalImportedPhosphorusKg as number,
      exportedPhosphorusKg: value.exportedPhosphorusKg as number,
      intervalDays: value.intervalDays as number,
      activeSedimentAreaM2: value.activeSedimentAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
