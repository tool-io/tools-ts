import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly moistureText: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    moistureText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "moistureText", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit amphibian microhabitat moisture transcription and unit without converting sensor scales or judging habitat quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, moistureText, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(moistureText.length > 0, "moistureText");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return {
      token: JSON.stringify([observationId, moistureText, suppliedUnit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    moistureText: "35",
    suppliedUnit: "percent sensor scale",
  },
  output: { token: '["O17","35","percent sensor scale"]' },
} satisfies ToolExample<Input, Output>;
export const amphibianMicrohabitatMoistureRecordUnitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/amphibian-microhabitat-moisture-record-unit",
      title: "Amphibian Microhabitat Moisture Record Unit Tool",
      description:
        "Preserve explicit amphibian microhabitat moisture transcription and unit without converting sensor scales or judging habitat quality.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationId: { type: "string", maxLength: 8192, minLength: 1 },
          moistureText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["observationId", "moistureText", "suppliedUnit"],
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
            id: "observationId",
            label: "Observation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "moistureText",
            label: "Moisture Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedUnit",
            label: "Supplied Unit",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = amphibianMicrohabitatMoistureRecordUnitTool.execute;
export default amphibianMicrohabitatMoistureRecordUnitTool;
