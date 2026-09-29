import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly initialConcentration: number;
  readonly addedVolume: number;
  readonly addedConcentration: number;
};
export type Output = {
  readonly finalVolume: number;
  readonly mixedConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", minimum: 0 },
    initialConcentration: { type: "number", minimum: 0 },
    addedVolume: { type: "number", minimum: 0 },
    addedConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "initialVolume",
    "initialConcentration",
    "addedVolume",
    "addedConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finalVolume: { type: "number" },
    mixedConcentration: { type: "number" },
  },
  required: ["finalVolume", "mixedConcentration"],
} as const;
/** Calculate reservoir topup concentration balance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialVolume,
    initialConcentration,
    addedVolume,
    addedConcentration,
  } = request;
  const compute = (): Output => {
    H.domain(
      initialVolume >= 0 &&
        addedVolume >= 0 &&
        initialVolume + addedVolume > 0 &&
        initialConcentration >= 0 &&
        addedConcentration >= 0,
    );
    return {
      finalVolume: initialVolume + addedVolume,
      mixedConcentration:
        (initialVolume * initialConcentration +
          addedVolume * addedConcentration) /
        (initialVolume + addedVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialVolume: 80,
    initialConcentration: 10,
    addedVolume: 20,
    addedConcentration: 0,
  },
  output: { finalVolume: 100, mixedConcentration: 8 },
} satisfies ToolExample<Input, Output>;
export const reservoirTopupConcentrationBalanceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/reservoir-topup-concentration-balance-term",
      title: "Reservoir Topup Concentration Balance Term Tool",
      description:
        "Calculate reservoir topup concentration balance term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialVolume: { type: "number", minimum: 0 },
          initialConcentration: { type: "number", minimum: 0 },
          addedVolume: { type: "number", minimum: 0 },
          addedConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "initialVolume",
          "initialConcentration",
          "addedVolume",
          "addedConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          finalVolume: { type: "number" },
          mixedConcentration: { type: "number" },
        },
        required: ["finalVolume", "mixedConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "initialVolume",
            label: "Initial Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialConcentration",
            label: "Initial Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "addedVolume",
            label: "Added Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "addedConcentration",
            label: "Added Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "finalVolume",
            label: "Final Volume",
            valueType: { type: "number" },
          },
          {
            id: "mixedConcentration",
            label: "Mixed Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reservoirTopupConcentrationBalanceTermTool.execute;
export default reservoirTopupConcentrationBalanceTermTool;
