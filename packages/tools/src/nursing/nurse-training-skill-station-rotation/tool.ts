import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trainees: number;
  readonly stations: number;
  readonly round: number;
};
export type Output = {
  readonly stationByTrainee: readonly number[];
  readonly collisions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainees: { type: "integer", minimum: 0, maximum: 256 },
    stations: { type: "integer", minimum: 1 },
    round: { type: "integer", minimum: 0 },
  },
  required: ["trainees", "stations", "round"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationByTrainee: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    collisions: { type: "integer" },
  },
  required: ["stationByTrainee", "collisions"],
} as const;
/** Assign cyclic training stations under supplied station and round counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trainees, stations, round } = request;
  const compute = (): Output => {
    H.integer(trainees, 0, 256);
    H.integer(stations, 1);
    H.integer(round, 0);
    const stationByTrainee = Array.from({ length: trainees }, (_, i) =>
      Number((BigInt(i) + BigInt(round)) % BigInt(stations)),
    );
    return {
      stationByTrainee,
      collisions: trainees - new Set(stationByTrainee).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trainees: 5, stations: 3, round: 1 },
  output: { stationByTrainee: [1, 2, 0, 1, 2], collisions: 2 },
} satisfies ToolExample<Input, Output>;
export const nurseTrainingSkillStationRotationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nurse-training-skill-station-rotation",
    title: "Nurse Training Skill Station Rotation Tool",
    description:
      "Assign cyclic training stations under supplied station and round counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trainees: { type: "integer", minimum: 0, maximum: 256 },
        stations: { type: "integer", minimum: 1 },
        round: { type: "integer", minimum: 0 },
      },
      required: ["trainees", "stations", "round"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stationByTrainee: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        collisions: { type: "integer" },
      },
      required: ["stationByTrainee", "collisions"],
    },
    ports: {
      inputs: [
        {
          id: "trainees",
          label: "Trainees",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "stations",
          label: "Stations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "round",
          label: "Round",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "stationByTrainee",
          label: "Station By Trainee",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "collisions",
          label: "Collisions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = nurseTrainingSkillStationRotationTool.execute;
export default nurseTrainingSkillStationRotationTool;
