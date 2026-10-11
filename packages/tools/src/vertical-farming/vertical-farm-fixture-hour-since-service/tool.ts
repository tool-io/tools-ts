import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceHourReading: number;
  readonly currentHourReading: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceHourReading: { type: "number" },
    currentHourReading: { type: "number" },
  },
  required: ["serviceHourReading", "currentHourReading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit fixture service and current hour-counter readings without selecting maintenance intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceHourReading, currentHourReading } = request;
  const compute = (): Output => {
    return { signedGap: currentHourReading - serviceHourReading };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { serviceHourReading: 12, currentHourReading: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmFixtureHourSinceServiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["vertical-farming", "vertical farming", "agriculture"],
        keywords: ["vertical farming", "agriculture"],
      },
      id: "vertical-farming/vertical-farm-fixture-hour-since-service",
      title: "Vertical Farm Fixture Hour Since Service",
      description:
        "Subtract explicit fixture service and current hour-counter readings without selecting maintenance intervals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          serviceHourReading: { type: "number" },
          currentHourReading: { type: "number" },
        },
        required: ["serviceHourReading", "currentHourReading"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "serviceHourReading",
            label: "Service Hour Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentHourReading",
            label: "Current Hour Reading",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = verticalFarmFixtureHourSinceServiceTool.execute;
export default verticalFarmFixtureHourSinceServiceTool;
