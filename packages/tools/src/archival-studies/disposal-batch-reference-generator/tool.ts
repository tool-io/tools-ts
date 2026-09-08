import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly institutionNamespace: string;
  readonly callerAuthorizedDisposalBatchId: string;
  readonly actualApprovedRecordIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "institutionNamespace",
    label: "Institution namespace",
    kind: "string",
  },
  {
    id: "callerAuthorizedDisposalBatchId",
    label: "Caller authorized disposal batch id",
    kind: "string",
  },
  {
    id: "actualApprovedRecordIds",
    label: "Actual approved record ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !/^[A-Za-z0-9_-]{1,64}$/.test(input.institutionNamespace) ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(input.callerAuthorizedDisposalBatchId)
  )
    simpleError(
      "namespace",
      "Explicit restricted institution and independently authorized batch IDs.",
    );
  unique(input.actualApprovedRecordIds, "records");
  if (input.actualApprovedRecordIds.some((v) => !v.trim() || v.length > 256))
    simpleError("records", "Bounded explicit actual approved record IDs.");
  const b =
    input.institutionNamespace + ":" + input.callerAuthorizedDisposalBatchId;
  return {
    disposalBatchReference: b,
    recordReferences: input.actualApprovedRecordIds.map(
      (v, i) => b + ":" + (i + 1) + ":" + encodeURIComponent(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    institutionNamespace: "ARC",
    callerAuthorizedDisposalBatchId: "B2026-001",
    actualApprovedRecordIds: ["r1", "r2"],
  },
  output: {
    result: {
      disposalBatchReference: "ARC:B2026-001",
      recordReferences: ["ARC:B2026-001:1:r1", "ARC:B2026-001:2:r2"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/disposal-batch-reference-generator",
  title: "Disposal Certificate Batch Reference Generator",
  description:
    "Generate deterministic references for actual independently authorized disposal batch and approved record IDs. Caller namespace/batch uniqueness external; no execution/deletion, legal authorization, issued certificate or cryptographic authenticity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
