import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerImageCountsByClass: readonly number[];
  readonly callerVerifiedBytesPerImageByClass: readonly number[];
  readonly callerExplicitReplicaCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerImageCountsByClass",
    label: "Caller image counts by class",
    kind: "numberList",
  },
  {
    id: "callerVerifiedBytesPerImageByClass",
    label: "Caller verified bytes per image by class",
    kind: "numberList",
  },
  {
    id: "callerExplicitReplicaCount",
    label: "Caller explicit replica count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.callerImageCountsByClass,
    input.callerVerifiedBytesPerImageByClass,
    "classes",
  );
  input.callerImageCountsByClass.forEach((v) =>
    bounded(v, "images", 0, 1000000000),
  );
  input.callerVerifiedBytesPerImageByClass.forEach((v) =>
    bounded(v, "bytes", 0, 1000000000000),
  );
  bounded(input.callerExplicitReplicaCount, "replicas", 1, 100);
  const t =
    input.callerImageCountsByClass.reduce(
      (a, v, i) =>
        a + BigInt(v) * BigInt(input.callerVerifiedBytesPerImageByClass[i]),
      0n,
    ) * BigInt(input.callerExplicitReplicaCount);
  return {
    conditionalTotalStorageBytesText: t.toString(),
    conditionalDecimalTerabytes:
      Number(t / 1000000000000n) + Number(t % 1000000000000n) / 1e12,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerImageCountsByClass: [10, 20],
    callerVerifiedBytesPerImageByClass: [1000, 2000],
    callerExplicitReplicaCount: 2,
  },
  output: {
    result: {
      conditionalTotalStorageBytesText: "100000",
      conditionalDecimalTerabytes: 1e-7,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/image-storage-tb-estimate",
  title: "Image File Storage TB Estimate Calculator",
  description:
    "Conditional museum-image storage inventory with actual independently declared encoded sizes and replica count. Exact byte text retained, decimal TB=10^12bytes, not TiB, compression prediction, filesystem overhead or resilience guarantee.",
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
