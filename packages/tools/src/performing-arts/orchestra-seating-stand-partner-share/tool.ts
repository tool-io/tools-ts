import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly players: number;
  readonly playersPerStand: number;
  readonly spareStands: number;
};
export type Output = {
  readonly occupiedStands: number;
  readonly totalStands: number;
  readonly unusedPlaces: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    players: { type: "integer", minimum: 0 },
    playersPerStand: { type: "integer", minimum: 1 },
    spareStands: { type: "integer", minimum: 0 },
  },
  required: ["players", "playersPerStand", "spareStands"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedStands: { type: "integer" },
    totalStands: { type: "integer" },
    unusedPlaces: { type: "integer" },
  },
  required: ["occupiedStands", "totalStands", "unusedPlaces"],
} as const;
/** Calculate orchestra seating stand partner share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { players, playersPerStand, spareStands } = request;
  const compute = (): Output => {
    H.integer(players, 0);
    H.integer(playersPerStand, 1);
    H.integer(spareStands, 0);
    return {
      occupiedStands: Math.ceil(players / playersPerStand),
      totalStands: Math.ceil(players / playersPerStand) + spareStands,
      unusedPlaces:
        Math.ceil(players / playersPerStand) * playersPerStand - players,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { players: 13, playersPerStand: 2, spareStands: 1 },
  output: { occupiedStands: 7, totalStands: 8, unusedPlaces: 1 },
} satisfies ToolExample<Input, Output>;
export const orchestraSeatingStandPartnerShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/orchestra-seating-stand-partner-share",
    title: "Orchestra Seating Stand Partner Share Tool",
    description:
      "Calculate orchestra seating stand partner share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        players: { type: "integer", minimum: 0 },
        playersPerStand: { type: "integer", minimum: 1 },
        spareStands: { type: "integer", minimum: 0 },
      },
      required: ["players", "playersPerStand", "spareStands"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedStands: { type: "integer" },
        totalStands: { type: "integer" },
        unusedPlaces: { type: "integer" },
      },
      required: ["occupiedStands", "totalStands", "unusedPlaces"],
    },
    ports: {
      inputs: [
        {
          id: "players",
          label: "Players",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "playersPerStand",
          label: "Players Per Stand",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "spareStands",
          label: "Spare Stands",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "occupiedStands",
          label: "Occupied Stands",
          valueType: { type: "integer" },
        },
        {
          id: "totalStands",
          label: "Total Stands",
          valueType: { type: "integer" },
        },
        {
          id: "unusedPlaces",
          label: "Unused Places",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = orchestraSeatingStandPartnerShareTool.execute;
export default orchestraSeatingStandPartnerShareTool;
