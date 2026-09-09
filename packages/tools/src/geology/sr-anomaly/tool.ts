import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualReferenceNormalizedSr: number;
  readonly actualReferenceNormalizedCe: number;
  readonly actualReferenceNormalizedNd: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualReferenceNormalizedSr",
    label: "Actual reference normalized sr",
    kind: "number",
  },
  {
    id: "actualReferenceNormalizedCe",
    label: "Actual reference normalized ce",
    kind: "number",
  },
  {
    id: "actualReferenceNormalizedNd",
    label: "Actual reference normalized nd",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualReferenceNormalizedSr, "SrN");
  positive(input.actualReferenceNormalizedCe, "CeN");
  positive(input.actualReferenceNormalizedNd, "NdN");
  return {
    observedGeometricCeNdSrAnomaly:
      input.actualReferenceNormalizedSr /
      Math.sqrt(
        input.actualReferenceNormalizedCe * input.actualReferenceNormalizedNd,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualReferenceNormalizedSr: 2,
    actualReferenceNormalizedCe: 1,
    actualReferenceNormalizedNd: 4,
  },
  output: { result: { observedGeometricCeNdSrAnomaly: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/sr-anomaly",
  title: "Geology Sr Anomaly Calculator",
  description:
    "Declared Sranomaly SrN/sqrt(CeN\u00d7NdN), not silently linear interpolation or Prneighbor convention. Same independently verified normalization reference required; not infer mineral source/age.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
