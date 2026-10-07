import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly medicineRecordId: string;
  readonly routeWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medicineRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    routeWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["medicineRecordId", "routeWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit medicine-route wording by record source without prescribing a route. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { medicineRecordId, routeWording, source } = request;
  const compute = (): Output => {
    H.domain(medicineRecordId.length > 0, "medicineRecordId");
    H.domain(routeWording.length > 0, "routeWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([medicineRecordId, routeWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    medicineRecordId: "MED17",
    routeWording: "oral",
    source: "Patient list",
  },
  output: { token: '["MED17","oral","Patient list"]' },
} satisfies ToolExample<Input, Output>;
export const medicineListRouteSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/medicine-list-route-source-key",
    title: "Medicine List Route Source Key",
    description:
      "Qualify explicit medicine-route wording by record source without prescribing a route.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        medicineRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        routeWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["medicineRecordId", "routeWording", "source"],
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
          id: "medicineRecordId",
          label: "Medicine Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "routeWording",
          label: "Route Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = medicineListRouteSourceKeyTool.execute;
export default medicineListRouteSourceKeyTool;
