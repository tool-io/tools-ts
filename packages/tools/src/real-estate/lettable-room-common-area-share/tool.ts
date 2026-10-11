import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roomExclusiveArea: number;
  readonly assignedCommonArea: number;
};
export type Output = {
  readonly allocatedLettableArea: number;
  readonly commonShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomExclusiveArea: { type: "number", minimum: 0 },
    assignedCommonArea: { type: "number", minimum: 0 },
  },
  required: ["roomExclusiveArea", "assignedCommonArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedLettableArea: { type: "number" },
    commonShare: { type: "number" },
  },
  required: ["allocatedLettableArea", "commonShare"],
} as const;
/** Combine explicit exclusive and assigned common areas and report their common-area share without applying a measurement standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roomExclusiveArea, assignedCommonArea } = request;
  const compute = (): Output => {
    H.domain(
      roomExclusiveArea >= 0 && assignedCommonArea >= 0,
      "roomExclusiveArea",
    );
    H.domain(roomExclusiveArea + assignedCommonArea > 0, "roomExclusiveArea");
    return {
      allocatedLettableArea: roomExclusiveArea + assignedCommonArea,
      commonShare:
        assignedCommonArea / (roomExclusiveArea + assignedCommonArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roomExclusiveArea: 80, assignedCommonArea: 20 },
  output: { allocatedLettableArea: 100, commonShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const lettableRoomCommonAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/lettable-room-common-area-share",
    title: "Lettable Room Common Area Share",
    description:
      "Combine explicit exclusive and assigned common areas and report their common-area share without applying a measurement standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roomExclusiveArea: { type: "number", minimum: 0 },
        assignedCommonArea: { type: "number", minimum: 0 },
      },
      required: ["roomExclusiveArea", "assignedCommonArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedLettableArea: { type: "number" },
        commonShare: { type: "number" },
      },
      required: ["allocatedLettableArea", "commonShare"],
    },
    ports: {
      inputs: [
        {
          id: "roomExclusiveArea",
          label: "Room Exclusive Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assignedCommonArea",
          label: "Assigned Common Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedLettableArea",
          label: "Allocated Lettable Area",
          valueType: { type: "number" },
        },
        {
          id: "commonShare",
          label: "Common Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lettableRoomCommonAreaShareTool.execute;
export default lettableRoomCommonAreaShareTool;
