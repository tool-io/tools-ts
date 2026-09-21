import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactHours: number;
  readonly remoteHours: number;
  readonly remoteWeight: number;
  readonly maxRemoteCredit: number;
};
export type Output = {
  readonly remoteCredit: number;
  readonly equivalentHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactHours: { type: "number", minimum: 0 },
    remoteHours: { type: "number", minimum: 0 },
    remoteWeight: { type: "number", minimum: 0 },
    maxRemoteCredit: { type: "number", minimum: 0 },
  },
  required: ["contactHours", "remoteHours", "remoteWeight", "maxRemoteCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remoteCredit: { type: "number" },
    equivalentHours: { type: "number" },
  },
  required: ["remoteCredit", "equivalentHours"],
} as const;
/** Calculate attendance equivalent distance learning hour from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactHours, remoteHours, remoteWeight, maxRemoteCredit } = request;
  const compute = (): Output => {
    H.domain(
      contactHours >= 0 &&
        remoteHours >= 0 &&
        remoteWeight >= 0 &&
        maxRemoteCredit >= 0,
    );
    return {
      remoteCredit: Math.min(maxRemoteCredit, remoteHours * remoteWeight),
      equivalentHours:
        contactHours + Math.min(maxRemoteCredit, remoteHours * remoteWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactHours: 10,
    remoteHours: 20,
    remoteWeight: 0.5,
    maxRemoteCredit: 8,
  },
  output: { remoteCredit: 8, equivalentHours: 18 },
} satisfies ToolExample<Input, Output>;
export const attendanceEquivalentDistanceLearningHourTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "adult-education/attendance-equivalent-distance-learning-hour",
      title: "Attendance Equivalent Distance Learning Hour Tool",
      description:
        "Calculate attendance equivalent distance learning hour from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactHours: { type: "number", minimum: 0 },
          remoteHours: { type: "number", minimum: 0 },
          remoteWeight: { type: "number", minimum: 0 },
          maxRemoteCredit: { type: "number", minimum: 0 },
        },
        required: [
          "contactHours",
          "remoteHours",
          "remoteWeight",
          "maxRemoteCredit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remoteCredit: { type: "number" },
          equivalentHours: { type: "number" },
        },
        required: ["remoteCredit", "equivalentHours"],
      },
      ports: {
        inputs: [
          {
            id: "contactHours",
            label: "Contact Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remoteHours",
            label: "Remote Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "remoteWeight",
            label: "Remote Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maxRemoteCredit",
            label: "Max Remote Credit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remoteCredit",
            label: "Remote Credit",
            valueType: { type: "number" },
          },
          {
            id: "equivalentHours",
            label: "Equivalent Hours",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = attendanceEquivalentDistanceLearningHourTool.execute;
export default attendanceEquivalentDistanceLearningHourTool;
