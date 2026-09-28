import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly binMasses: readonly number[];
  readonly binLowerDiameters: readonly number[];
  readonly binUpperDiameters: readonly number[];
  readonly supportedLower: number;
  readonly supportedUpper: number;
};
export type Output = {
  readonly totalMass: number;
  readonly fullySupportedMass: number;
  readonly supportedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    binLowerDiameters: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    binUpperDiameters: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    supportedLower: { type: "number", exclusiveMinimum: 0 },
    supportedUpper: { type: "number" },
  },
  required: [
    "binMasses",
    "binLowerDiameters",
    "binUpperDiameters",
    "supportedLower",
    "supportedUpper",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMass: { type: "number" },
    fullySupportedMass: { type: "number" },
    supportedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalMass", "fullySupportedMass", "supportedShare", "defined"],
} as const;
/** Count only wholly supported supplied grain-size bins, without prorating unknown within-bin distributions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    binMasses,
    binLowerDiameters,
    binUpperDiameters,
    supportedLower,
    supportedUpper,
  } = request;
  const compute = (): Output => {
    H.sameLength(binMasses, binLowerDiameters);
    H.sameLength(binMasses, binUpperDiameters);
    H.domain(
      binMasses.every((x) => x >= 0) &&
        binLowerDiameters.every((x, i) => x > 0 && binUpperDiameters[i] >= x) &&
        supportedLower > 0 &&
        supportedUpper >= supportedLower,
    );
    return (() => {
      const totalMass = binMasses.reduce((a, b) => a + b, 0),
        fullySupportedMass = binMasses.reduce(
          (s, x, i) =>
            s +
            (binLowerDiameters[i] >= supportedLower &&
            binUpperDiameters[i] <= supportedUpper
              ? x
              : 0),
          0,
        );
      return {
        totalMass,
        fullySupportedMass,
        supportedShare: totalMass > 0 ? fullySupportedMass / totalMass : 0,
        defined: totalMass > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    binMasses: [2, 3],
    binLowerDiameters: [1, 2],
    binUpperDiameters: [2, 4],
    supportedLower: 1,
    supportedUpper: 2,
  },
  output: {
    totalMass: 5,
    fullySupportedMass: 2,
    supportedShare: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const grainSizeSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/grain-size-support-share",
    title: "Grain Size Support Share Tool",
    description:
      "Count only wholly supported supplied grain-size bins, without prorating unknown within-bin distributions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        binLowerDiameters: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        binUpperDiameters: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        supportedLower: { type: "number", exclusiveMinimum: 0 },
        supportedUpper: { type: "number" },
      },
      required: [
        "binMasses",
        "binLowerDiameters",
        "binUpperDiameters",
        "supportedLower",
        "supportedUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMass: { type: "number" },
        fullySupportedMass: { type: "number" },
        supportedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalMass",
        "fullySupportedMass",
        "supportedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "binMasses",
          label: "Bin Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "binLowerDiameters",
          label: "Bin Lower Diameters",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "binUpperDiameters",
          label: "Bin Upper Diameters",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "supportedLower",
          label: "Supported Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supportedUpper",
          label: "Supported Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalMass", label: "Total Mass", valueType: { type: "number" } },
        {
          id: "fullySupportedMass",
          label: "Fully Supported Mass",
          valueType: { type: "number" },
        },
        {
          id: "supportedShare",
          label: "Supported Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = grainSizeSupportShareTool.execute;
export default grainSizeSupportShareTool;
