import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prepared: number;
  readonly offered: number;
  readonly returned: number;
  readonly spilled: number;
  readonly uncertainLoss: number;
};
export type Output = {
  readonly unoffered: number;
  readonly nominalRetained: number;
  readonly lowerRetained: number;
  readonly upperRetained: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prepared: { type: "number" },
    offered: { type: "number", minimum: 0 },
    returned: { type: "number", minimum: 0 },
    spilled: { type: "number", minimum: 0 },
    uncertainLoss: { type: "number" },
  },
  required: ["prepared", "offered", "returned", "spilled", "uncertainLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unoffered: { type: "number" },
    nominalRetained: { type: "number" },
    lowerRetained: { type: "number" },
    upperRetained: { type: "number" },
  },
  required: ["unoffered", "nominalRetained", "lowerRetained", "upperRetained"],
} as const;
/** Reconcile supplied diary container volumes and an uncertain-loss bound. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prepared, offered, returned, spilled, uncertainLoss } = request;
  const compute = (): Output => {
    H.domain(
      prepared >= offered &&
        offered >= 0 &&
        returned >= 0 &&
        spilled >= 0 &&
        returned + spilled <= offered &&
        uncertainLoss >= 0,
      "offered",
    );
    return {
      unoffered: prepared - offered,
      nominalRetained: offered - returned - spilled,
      lowerRetained: Math.max(0, offered - returned - spilled - uncertainLoss),
      upperRetained: offered - returned - spilled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    prepared: 100,
    offered: 90,
    returned: 10,
    spilled: 5,
    uncertainLoss: 3,
  },
  output: {
    unoffered: 10,
    nominalRetained: 75,
    lowerRetained: 72,
    upperRetained: 75,
  },
} satisfies ToolExample<Input, Output>;
export const infantDiaryFeedRecordVolumeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/infant-diary-feed-record-volume-balance",
    title: "Infant Diary Feed Record Volume Balance Tool",
    description:
      "Reconcile supplied diary container volumes and an uncertain-loss bound.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prepared: { type: "number" },
        offered: { type: "number", minimum: 0 },
        returned: { type: "number", minimum: 0 },
        spilled: { type: "number", minimum: 0 },
        uncertainLoss: { type: "number" },
      },
      required: ["prepared", "offered", "returned", "spilled", "uncertainLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unoffered: { type: "number" },
        nominalRetained: { type: "number" },
        lowerRetained: { type: "number" },
        upperRetained: { type: "number" },
      },
      required: [
        "unoffered",
        "nominalRetained",
        "lowerRetained",
        "upperRetained",
      ],
    },
    ports: {
      inputs: [
        {
          id: "prepared",
          label: "Prepared",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offered",
          label: "Offered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spilled",
          label: "Spilled",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "uncertainLoss",
          label: "Uncertain Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "unoffered", label: "Unoffered", valueType: { type: "number" } },
        {
          id: "nominalRetained",
          label: "Nominal Retained",
          valueType: { type: "number" },
        },
        {
          id: "lowerRetained",
          label: "Lower Retained",
          valueType: { type: "number" },
        },
        {
          id: "upperRetained",
          label: "Upper Retained",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = infantDiaryFeedRecordVolumeBalanceTool.execute;
export default infantDiaryFeedRecordVolumeBalanceTool;
