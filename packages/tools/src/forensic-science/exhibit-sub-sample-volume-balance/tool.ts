import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingVolume: number;
  readonly withdrawnVolumes: readonly number[];
  readonly returnedVolume: number;
};
export type Output = {
  readonly remainingVolume: number;
  readonly totalWithdrawn: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingVolume: { type: "number", minimum: 0 },
    withdrawnVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    returnedVolume: { type: "number", minimum: 0 },
  },
  required: ["openingVolume", "withdrawnVolumes", "returnedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingVolume: { type: "number" },
    totalWithdrawn: { type: "number" },
  },
  required: ["remainingVolume", "totalWithdrawn"],
} as const;
/** Reconcile supplied exhibit subsample volumes, retaining signed deficits for record review. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingVolume, withdrawnVolumes, returnedVolume } = request;
  const compute = (): Output => {
    H.domain(openingVolume >= 0 && returnedVolume >= 0, "openingVolume");
    H.domain(
      withdrawnVolumes.every((v) => v >= 0),
      "withdrawnVolumes",
    );
    return (() => {
      const totalWithdrawn = withdrawnVolumes.reduce((a, b) => a + b, 0);
      return {
        remainingVolume: openingVolume - totalWithdrawn + returnedVolume,
        totalWithdrawn,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingVolume: 10, withdrawnVolumes: [1.5, 2], returnedVolume: 0.5 },
  output: { remainingVolume: 7, totalWithdrawn: 3.5 },
} satisfies ToolExample<Input, Output>;
export const exhibitSubSampleVolumeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/exhibit-sub-sample-volume-balance",
    title: "Exhibit Sub Sample Volume Balance",
    description:
      "Reconcile supplied exhibit subsample volumes, retaining signed deficits for record review.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingVolume: { type: "number", minimum: 0 },
        withdrawnVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        returnedVolume: { type: "number", minimum: 0 },
      },
      required: ["openingVolume", "withdrawnVolumes", "returnedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingVolume: { type: "number" },
        totalWithdrawn: { type: "number" },
      },
      required: ["remainingVolume", "totalWithdrawn"],
    },
    ports: {
      inputs: [
        {
          id: "openingVolume",
          label: "Opening Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawnVolumes",
          label: "Withdrawn Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "returnedVolume",
          label: "Returned Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingVolume",
          label: "Remaining Volume",
          valueType: { type: "number" },
        },
        {
          id: "totalWithdrawn",
          label: "Total Withdrawn",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exhibitSubSampleVolumeBalanceTool.execute;
export default exhibitSubSampleVolumeBalanceTool;
