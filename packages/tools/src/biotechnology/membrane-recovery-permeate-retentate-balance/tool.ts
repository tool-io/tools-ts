import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedVolume: number;
  readonly feedConcentration: number;
  readonly permeateVolume: number;
  readonly permeateConcentration: number;
};
export type Output = {
  readonly retentateVolume: number;
  readonly retentateConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedVolume: { type: "number" },
    feedConcentration: { type: "number", minimum: 0 },
    permeateVolume: { type: "number", minimum: 0 },
    permeateConcentration: { type: "number", minimum: 0 },
  },
  required: [
    "feedVolume",
    "feedConcentration",
    "permeateVolume",
    "permeateConcentration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retentateVolume: { type: "number" },
    retentateConcentration: { type: "number" },
  },
  required: ["retentateVolume", "retentateConcentration"],
} as const;
/** Calculate membrane recovery permeate retentate balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    feedVolume,
    feedConcentration,
    permeateVolume,
    permeateConcentration,
  } = request;
  const compute = (): Output => {
    H.domain(
      feedVolume > permeateVolume &&
        permeateVolume >= 0 &&
        feedConcentration >= 0 &&
        permeateConcentration >= 0 &&
        feedVolume * feedConcentration >=
          permeateVolume * permeateConcentration,
    );
    return {
      retentateVolume: feedVolume - permeateVolume,
      retentateConcentration:
        (feedVolume * feedConcentration -
          permeateVolume * permeateConcentration) /
        (feedVolume - permeateVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedVolume: 100,
    feedConcentration: 5,
    permeateVolume: 40,
    permeateConcentration: 2,
  },
  output: { retentateVolume: 60, retentateConcentration: 7 },
} satisfies ToolExample<Input, Output>;
export const membraneRecoveryPermeateRetentateBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biotechnology/membrane-recovery-permeate-retentate-balance",
      title: "Membrane Recovery Permeate Retentate Balance Tool",
      description:
        "Calculate membrane recovery permeate retentate balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedVolume: { type: "number" },
          feedConcentration: { type: "number", minimum: 0 },
          permeateVolume: { type: "number", minimum: 0 },
          permeateConcentration: { type: "number", minimum: 0 },
        },
        required: [
          "feedVolume",
          "feedConcentration",
          "permeateVolume",
          "permeateConcentration",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retentateVolume: { type: "number" },
          retentateConcentration: { type: "number" },
        },
        required: ["retentateVolume", "retentateConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "feedVolume",
            label: "Feed Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feedConcentration",
            label: "Feed Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permeateVolume",
            label: "Permeate Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permeateConcentration",
            label: "Permeate Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retentateVolume",
            label: "Retentate Volume",
            valueType: { type: "number" },
          },
          {
            id: "retentateConcentration",
            label: "Retentate Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = membraneRecoveryPermeateRetentateBalanceTool.execute;
export default membraneRecoveryPermeateRetentateBalanceTool;
