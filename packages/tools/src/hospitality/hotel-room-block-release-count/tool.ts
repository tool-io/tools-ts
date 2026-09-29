import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly blocked: number;
  readonly pickup: number;
  readonly protectedUnbooked: number;
};
export type Output = { readonly released: number; readonly retained: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blocked: { type: "integer", minimum: 0 },
    pickup: { type: "integer", minimum: 0 },
    protectedUnbooked: { type: "integer", minimum: 0 },
  },
  required: ["blocked", "pickup", "protectedUnbooked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { released: { type: "integer" }, retained: { type: "integer" } },
  required: ["released", "retained"],
} as const;
/** Calculate hotel room block release count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { blocked, pickup, protectedUnbooked } = request;
  const compute = (): Output => {
    H.integer(blocked, 0);
    H.integer(pickup, 0, blocked);
    H.integer(protectedUnbooked, 0, blocked - pickup);
    return {
      released: blocked - pickup - protectedUnbooked,
      retained: pickup + protectedUnbooked,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { blocked: 100, pickup: 70, protectedUnbooked: 10 },
  output: { released: 20, retained: 80 },
} satisfies ToolExample<Input, Output>;
export const hotelRoomBlockReleaseCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/hotel-room-block-release-count",
    title: "Hotel Room Block Release Count Tool",
    description:
      "Calculate hotel room block release count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        blocked: { type: "integer", minimum: 0 },
        pickup: { type: "integer", minimum: 0 },
        protectedUnbooked: { type: "integer", minimum: 0 },
      },
      required: ["blocked", "pickup", "protectedUnbooked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        released: { type: "integer" },
        retained: { type: "integer" },
      },
      required: ["released", "retained"],
    },
    ports: {
      inputs: [
        {
          id: "blocked",
          label: "Blocked",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pickup",
          label: "Pickup",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "protectedUnbooked",
          label: "Protected Unbooked",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "released", label: "Released", valueType: { type: "integer" } },
        { id: "retained", label: "Retained", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = hotelRoomBlockReleaseCountTool.execute;
export default hotelRoomBlockReleaseCountTool;
