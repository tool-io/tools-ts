import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialConcentration: number;
  readonly finalConcentration: number;
  readonly initialVolume: number;
  readonly finalVolume: number;
  readonly unitFactor: number;
};
export type Output = { readonly massChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialConcentration: { type: "number", minimum: 0 },
    finalConcentration: { type: "number", minimum: 0 },
    initialVolume: { type: "number", minimum: 0 },
    finalVolume: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "initialConcentration",
    "finalConcentration",
    "initialVolume",
    "finalVolume",
    "unitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massChange: { type: "number" } },
  required: ["massChange"],
} as const;
/** Calculate aquaponic nitrate mass change one interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialConcentration,
    finalConcentration,
    initialVolume,
    finalVolume,
    unitFactor,
  } = request;
  const compute = (): Output => {
    H.domain(
      initialConcentration >= 0 &&
        finalConcentration >= 0 &&
        initialVolume >= 0 &&
        finalVolume >= 0,
    );
    H.positive(unitFactor);
    return {
      massChange:
        (finalConcentration * finalVolume -
          initialConcentration * initialVolume) *
        unitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialConcentration: 10,
    finalConcentration: 12,
    initialVolume: 100,
    finalVolume: 90,
    unitFactor: 0.001,
  },
  output: { massChange: 0.08 },
} satisfies ToolExample<Input, Output>;
export const aquaponicNitrateMassChangeOneIntervalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-nitrate-mass-change-one-interval",
      title: "Aquaponic Nitrate Mass Change One Interval Tool",
      description:
        "Calculate aquaponic nitrate mass change one interval from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialConcentration: { type: "number", minimum: 0 },
          finalConcentration: { type: "number", minimum: 0 },
          initialVolume: { type: "number", minimum: 0 },
          finalVolume: { type: "number", minimum: 0 },
          unitFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "initialConcentration",
          "finalConcentration",
          "initialVolume",
          "finalVolume",
          "unitFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { massChange: { type: "number" } },
        required: ["massChange"],
      },
      ports: {
        inputs: [
          {
            id: "initialConcentration",
            label: "Initial Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalConcentration",
            label: "Final Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialVolume",
            label: "Initial Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalVolume",
            label: "Final Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitFactor",
            label: "Unit Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "massChange",
            label: "Mass Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicNitrateMassChangeOneIntervalTool.execute;
export default aquaponicNitrateMassChangeOneIntervalTool;
