import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roomId: string;
  readonly cleaningRecordId: string;
  readonly releaseReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomId: { type: "string", maxLength: 8192, minLength: 1 },
    cleaningRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    releaseReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["roomId", "cleaningRecordId", "releaseReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit room cleaning and release references without specifying or verifying cleaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roomId, cleaningRecordId, releaseReference } = request;
  const compute = (): Output => {
    H.domain(roomId.length > 0, "roomId");
    H.domain(cleaningRecordId.length > 0, "cleaningRecordId");
    H.domain(releaseReference.length > 0, "releaseReference");
    return {
      token: JSON.stringify([roomId, cleaningRecordId, releaseReference]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roomId: "ROOM17",
    cleaningRecordId: "CLN2",
    releaseReference: "REL2",
  },
  output: { token: '["ROOM17","CLN2","REL2"]' },
} satisfies ToolExample<Input, Output>;
export const gmpRoomCleaningReleaseReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gmp",
        "good manufacturing practice",
        "research and quality management",
      ],
      keywords: [
        "good manufacturing practice",
        "research and quality management",
        "GMP",
      ],
    },
    id: "gmp/gmp-room-cleaning-release-reference",
    title: "GMP Room Cleaning Release Reference",
    description:
      "Pair explicit room cleaning and release references without specifying or verifying cleaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roomId: { type: "string", maxLength: 8192, minLength: 1 },
        cleaningRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        releaseReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["roomId", "cleaningRecordId", "releaseReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "roomId",
          label: "Room Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cleaningRecordId",
          label: "Cleaning Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "releaseReference",
          label: "Release Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gmpRoomCleaningReleaseReferenceTool.execute;
export default gmpRoomCleaningReleaseReferenceTool;
