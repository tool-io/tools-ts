import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly groupSize: number;
  readonly individualMinutes: number;
  readonly overlapMinutes: number;
};
export type Output = {
  readonly groupPersonMinutes: number;
  readonly uniqueDirectMinutes: number;
  readonly allocatedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number", minimum: 0 },
    groupSize: { type: "integer", minimum: 1 },
    individualMinutes: { type: "number", minimum: 0 },
    overlapMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "sessionMinutes",
    "groupSize",
    "individualMinutes",
    "overlapMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupPersonMinutes: { type: "number" },
    uniqueDirectMinutes: { type: "number" },
    allocatedMinutes: { type: "number" },
  },
  required: ["groupPersonMinutes", "uniqueDirectMinutes", "allocatedMinutes"],
} as const;
/** Calculate rehabilitation group contact time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionMinutes, groupSize, individualMinutes, overlapMinutes } =
    request;
  const compute = (): Output => {
    H.integer(groupSize, 1);
    H.domain(
      sessionMinutes >= 0 &&
        individualMinutes >= 0 &&
        overlapMinutes >= 0 &&
        overlapMinutes <= Math.min(sessionMinutes, individualMinutes),
    );
    return {
      groupPersonMinutes: sessionMinutes * groupSize,
      uniqueDirectMinutes: sessionMinutes + individualMinutes - overlapMinutes,
      allocatedMinutes:
        sessionMinutes / groupSize +
        individualMinutes -
        overlapMinutes / groupSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionMinutes: 60,
    groupSize: 4,
    individualMinutes: 10,
    overlapMinutes: 5,
  },
  output: {
    groupPersonMinutes: 240,
    uniqueDirectMinutes: 65,
    allocatedMinutes: 23.75,
  },
} satisfies ToolExample<Input, Output>;
export const rehabilitationGroupContactTimeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiotherapy/rehabilitation-group-contact-time-share",
      title: "Rehabilitation Group Contact Time Share Tool",
      description:
        "Calculate rehabilitation group contact time share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionMinutes: { type: "number", minimum: 0 },
          groupSize: { type: "integer", minimum: 1 },
          individualMinutes: { type: "number", minimum: 0 },
          overlapMinutes: { type: "number", minimum: 0 },
        },
        required: [
          "sessionMinutes",
          "groupSize",
          "individualMinutes",
          "overlapMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          groupPersonMinutes: { type: "number" },
          uniqueDirectMinutes: { type: "number" },
          allocatedMinutes: { type: "number" },
        },
        required: [
          "groupPersonMinutes",
          "uniqueDirectMinutes",
          "allocatedMinutes",
        ],
      },
      ports: {
        inputs: [
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "groupSize",
            label: "Group Size",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "individualMinutes",
            label: "Individual Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "overlapMinutes",
            label: "Overlap Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "groupPersonMinutes",
            label: "Group Person Minutes",
            valueType: { type: "number" },
          },
          {
            id: "uniqueDirectMinutes",
            label: "Unique Direct Minutes",
            valueType: { type: "number" },
          },
          {
            id: "allocatedMinutes",
            label: "Allocated Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rehabilitationGroupContactTimeShareTool.execute;
export default rehabilitationGroupContactTimeShareTool;
