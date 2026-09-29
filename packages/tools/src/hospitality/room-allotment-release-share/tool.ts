import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allottedRooms: number;
  readonly heldRooms: number;
  readonly releaseRooms: number;
};
export type Output = {
  readonly remainingHeld: number;
  readonly releasedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allottedRooms: { type: "integer", minimum: 1 },
    heldRooms: { type: "integer", minimum: 0 },
    releaseRooms: { type: "integer", minimum: 0 },
  },
  required: ["allottedRooms", "heldRooms", "releaseRooms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingHeld: { type: "integer" },
    releasedShare: { type: "number" },
  },
  required: ["remainingHeld", "releasedShare"],
} as const;
/** Calculate room allotment release share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allottedRooms, heldRooms, releaseRooms } = request;
  const compute = (): Output => {
    H.integer(allottedRooms, 1);
    H.integer(heldRooms, 0, allottedRooms);
    H.integer(releaseRooms, 0, heldRooms);
    return {
      remainingHeld: heldRooms - releaseRooms,
      releasedShare: releaseRooms / allottedRooms,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allottedRooms: 100, heldRooms: 60, releaseRooms: 20 },
  output: { remainingHeld: 40, releasedShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const roomAllotmentReleaseShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/room-allotment-release-share",
    title: "Room Allotment Release Share Tool",
    description:
      "Calculate room allotment release share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allottedRooms: { type: "integer", minimum: 1 },
        heldRooms: { type: "integer", minimum: 0 },
        releaseRooms: { type: "integer", minimum: 0 },
      },
      required: ["allottedRooms", "heldRooms", "releaseRooms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingHeld: { type: "integer" },
        releasedShare: { type: "number" },
      },
      required: ["remainingHeld", "releasedShare"],
    },
    ports: {
      inputs: [
        {
          id: "allottedRooms",
          label: "Allotted Rooms",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "heldRooms",
          label: "Held Rooms",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "releaseRooms",
          label: "Release Rooms",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingHeld",
          label: "Remaining Held",
          valueType: { type: "integer" },
        },
        {
          id: "releasedShare",
          label: "Released Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = roomAllotmentReleaseShareTool.execute;
export default roomAllotmentReleaseShareTool;
