import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly witnessId: string;
  readonly interpreterId: string;
};
export type Output = {
  readonly sameRecordedPerson: boolean;
  readonly rolesKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    interpreterId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "witnessId", "interpreterId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameRecordedPerson: { type: "boolean" },
    rolesKey: { type: "string", maxLength: 8192 },
  },
  required: ["sameRecordedPerson", "rolesKey"],
} as const;
/** Compare explicit witness and interpreter identifiers without deciding independence or valid consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, witnessId, interpreterId } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && witnessId.length > 0 && interpreterId.length > 0,
      "recordId",
    );
    return {
      sameRecordedPerson: witnessId === interpreterId,
      rolesKey: JSON.stringify([recordId, witnessId, interpreterId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", witnessId: "P2", interpreterId: "P3" },
  output: { sameRecordedPerson: false, rolesKey: '["R17","P2","P3"]' },
} satisfies ToolExample<Input, Output>;
export const consentWitnessVersusInterpreterRoleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bioethics", "research and quality management"],
        keywords: ["bioethics", "research and quality management"],
      },
      id: "bioethics/consent-witness-versus-interpreter-role",
      title: "Consent Witness Versus Interpreter Role",
      description:
        "Compare explicit witness and interpreter identifiers without deciding independence or valid consent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          witnessId: { type: "string", maxLength: 8192, minLength: 1 },
          interpreterId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "witnessId", "interpreterId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sameRecordedPerson: { type: "boolean" },
          rolesKey: { type: "string", maxLength: 8192 },
        },
        required: ["sameRecordedPerson", "rolesKey"],
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
            id: "witnessId",
            label: "Witness Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "interpreterId",
            label: "Interpreter Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "sameRecordedPerson",
            label: "Same Recorded Person",
            valueType: { type: "boolean" },
          },
          { id: "rolesKey", label: "Roles Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = consentWitnessVersusInterpreterRoleTool.execute;
export default consentWitnessVersusInterpreterRoleTool;
