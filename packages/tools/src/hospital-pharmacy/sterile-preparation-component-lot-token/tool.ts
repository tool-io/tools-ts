import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preparationId: string;
  readonly componentId: string;
  readonly lotId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preparationId: { type: "string", maxLength: 8192, minLength: 1 },
    componentId: { type: "string", maxLength: 8192, minLength: 1 },
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["preparationId", "componentId", "lotId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit preparation component lot without specifying compounding or sterility procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preparationId, componentId, lotId } = request;
  const compute = (): Output => {
    H.domain(preparationId.length > 0, "preparationId");
    H.domain(componentId.length > 0, "componentId");
    H.domain(lotId.length > 0, "lotId");
    return { token: JSON.stringify([preparationId, componentId, lotId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preparationId: "PREP17", componentId: "CMP2", lotId: "LOT2" },
  output: { token: '["PREP17","CMP2","LOT2"]' },
} satisfies ToolExample<Input, Output>;
export const sterileprepComponentLotTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/sterile-preparation-component-lot-token",
    title: "Sterile Preparation Component Lot Token",
    description:
      "Qualify an explicit preparation component lot without specifying compounding or sterility procedures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preparationId: { type: "string", maxLength: 8192, minLength: 1 },
        componentId: { type: "string", maxLength: 8192, minLength: 1 },
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["preparationId", "componentId", "lotId"],
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
          id: "preparationId",
          label: "Preparation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "componentId",
          label: "Component Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lotId",
          label: "Lot Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sterileprepComponentLotTokenTool.execute;
export default sterileprepComponentLotTokenTool;
