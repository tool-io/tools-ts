import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaffoldId: string;
  readonly areaText: string;
  readonly suppliedAreaUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaffoldId: { type: "string", maxLength: 8192, minLength: 1 },
    areaText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAreaUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scaffoldId", "areaText", "suppliedAreaUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit scaffold cross-section area transcription and unit without choosing a geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaffoldId, areaText, suppliedAreaUnit } = request;
  const compute = (): Output => {
    H.domain(scaffoldId.length > 0, "scaffoldId");
    H.domain(areaText.length > 0, "areaText");
    H.domain(suppliedAreaUnit.length > 0, "suppliedAreaUnit");
    return { token: JSON.stringify([scaffoldId, areaText, suppliedAreaUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaffoldId: "S17", areaText: "12", suppliedAreaUnit: "mm²" },
  output: { token: '["S17","12","mm²"]' },
} satisfies ToolExample<Input, Output>;
export const scaffoldCrossSectionAreaLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/scaffold-cross-section-area-label",
    title: "Scaffold Cross Section Area Label",
    description:
      "Record an explicit scaffold cross-section area transcription and unit without choosing a geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaffoldId: { type: "string", maxLength: 8192, minLength: 1 },
        areaText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAreaUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scaffoldId", "areaText", "suppliedAreaUnit"],
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
          id: "scaffoldId",
          label: "Scaffold Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "areaText",
          label: "Area Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAreaUnit",
          label: "Supplied Area Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = scaffoldCrossSectionAreaLabelTool.execute;
export default scaffoldCrossSectionAreaLabelTool;
