import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly institutionCode: string;
  readonly localObjectId: string;
};
export type Output = { readonly namespacedId: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    institutionCode: { type: "string", maxLength: 8192 },
    localObjectId: { type: "string", maxLength: 8192 },
  },
  required: ["institutionCode", "localObjectId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { namespacedId: { type: "string", maxLength: 8192 } },
  required: ["namespacedId"],
} as const;
/** Namespace a literal local museum object identifier without removing leading zeros or assuming a continental identifier standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { institutionCode, localObjectId } = request;
  const compute = (): Output => {
    H.domain(
      institutionCode.length > 0 && localObjectId.length > 0,
      "institutionCode",
    );
    return { namespacedId: JSON.stringify([institutionCode, localObjectId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { institutionCode: "MUS-A", localObjectId: "0017" },
  output: { namespacedId: '["MUS-A","0017"]' },
} satisfies ToolExample<Input, Output>;
export const africanMuseumObjectIdFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-museum-object-id-field",
    title: "African Museum Object ID Field Tool",
    description:
      "Namespace a literal local museum object identifier without removing leading zeros or assuming a continental identifier standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        institutionCode: { type: "string", maxLength: 8192 },
        localObjectId: { type: "string", maxLength: 8192 },
      },
      required: ["institutionCode", "localObjectId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { namespacedId: { type: "string", maxLength: 8192 } },
      required: ["namespacedId"],
    },
    ports: {
      inputs: [
        {
          id: "institutionCode",
          label: "Institution Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "localObjectId",
          label: "Local Object Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "namespacedId",
          label: "Namespaced Id",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = africanMuseumObjectIdFieldTool.execute;
export default africanMuseumObjectIdFieldTool;
