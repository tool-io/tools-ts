import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly missionName: string;
  readonly receivingState: string;
  readonly credentialDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missionName: { type: "string", maxLength: 8192 },
    receivingState: { type: "string", maxLength: 8192 },
    credentialDate: { type: "string", maxLength: 8192 },
  },
  required: ["missionName", "receivingState", "credentialDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label recorded diplomatic accreditation fields without verifying recognition or current status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { missionName, receivingState, credentialDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(
      missionName.length > 0 && receivingState.length > 0,
      "missionName",
    );
    namedDate(credentialDate, "credentialDate");
    return {
      label:
        missionName +
        " → " +
        receivingState +
        "; credentials " +
        credentialDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    missionName: "Mission A",
    receivingState: "State B",
    credentialDate: "2026-05-12",
  },
  output: { label: "Mission A → State B; credentials 2026-05-12" },
} satisfies ToolExample<Input, Output>;
export const diplomaticMissionAccreditationLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-relations/diplomatic-mission-accreditation-label",
      title: "Diplomatic Mission Accreditation Label Tool",
      description:
        "Label recorded diplomatic accreditation fields without verifying recognition or current status.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missionName: { type: "string", maxLength: 8192 },
          receivingState: { type: "string", maxLength: 8192 },
          credentialDate: { type: "string", maxLength: 8192 },
        },
        required: ["missionName", "receivingState", "credentialDate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "missionName",
            label: "Mission Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "receivingState",
            label: "Receiving State",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "credentialDate",
            label: "Credential Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = diplomaticMissionAccreditationLabelTool.execute;
export default diplomaticMissionAccreditationLabelTool;
