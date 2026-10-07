import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly motionWording: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    motionWording: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "motionWording", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit motion record with supplied unit wording without measuring motion or assessing a condition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, motionWording, unitText } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(motionWording.length > 0, "motionWording");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([recordId, motionWording, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", motionWording: "rotation", unitText: "degrees" },
  output: { token: '["R17","rotation","degrees"]' },
} satisfies ToolExample<Input, Output>;
export const spinalMotionRecordUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/spinal-motion-record-unit",
    title: "Spinal Motion Record Unit",
    description:
      "Qualify an explicit motion record with supplied unit wording without measuring motion or assessing a condition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        motionWording: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "motionWording", "unitText"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "motionWording",
          label: "Motion Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = spinalMotionRecordUnitTool.execute;
export default spinalMotionRecordUnitTool;
