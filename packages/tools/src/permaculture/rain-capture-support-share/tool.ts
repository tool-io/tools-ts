import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rainDepths: readonly number[];
  readonly catchmentAreas: readonly number[];
  readonly captureFractions: readonly number[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly potentialVolume: number;
  readonly capturedVolume: number;
  readonly supportedCapturedVolume: number;
  readonly supportedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rainDepths: { type: "array", maxItems: 256, items: { type: "number" } },
    catchmentAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    captureFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "rainDepths",
    "catchmentAreas",
    "captureFractions",
    "sourceVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    potentialVolume: { type: "number" },
    capturedVolume: { type: "number" },
    supportedCapturedVolume: { type: "number" },
    supportedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "potentialVolume",
    "capturedVolume",
    "supportedCapturedVolume",
    "supportedShare",
    "defined",
  ],
} as const;
/** Calculate rain capture support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rainDepths, catchmentAreas, captureFractions, sourceVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(rainDepths, catchmentAreas);
    H.sameLength(rainDepths, captureFractions);
    H.sameLength(rainDepths, sourceVerified);
    H.domain(
      [...rainDepths, ...catchmentAreas].every((x) => x >= 0) &&
        captureFractions.every((x) => x >= 0 && x <= 1),
    );
    return (() => {
      const potentialVolume = rainDepths.reduce(
          (s, x, i) => s + x * catchmentAreas[i],
          0,
        ),
        capturedVolume = rainDepths.reduce(
          (s, x, i) => s + x * catchmentAreas[i] * captureFractions[i],
          0,
        ),
        supportedCapturedVolume = rainDepths.reduce(
          (s, x, i) =>
            s +
            (sourceVerified[i]
              ? x * catchmentAreas[i] * captureFractions[i]
              : 0),
          0,
        );
      return {
        potentialVolume,
        capturedVolume,
        supportedCapturedVolume,
        supportedShare:
          capturedVolume > 0 ? supportedCapturedVolume / capturedVolume : 0,
        defined: capturedVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rainDepths: [1, 2],
    catchmentAreas: [10, 5],
    captureFractions: [0.5, 1],
    sourceVerified: [true, false],
  },
  output: {
    potentialVolume: 20,
    capturedVolume: 15,
    supportedCapturedVolume: 5,
    supportedShare: 0.3333333333333333,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const rainCaptureSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/rain-capture-support-share",
    title: "Rain Capture Support Share Tool",
    description:
      "Calculate rain capture support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rainDepths: { type: "array", maxItems: 256, items: { type: "number" } },
        catchmentAreas: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        captureFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "rainDepths",
        "catchmentAreas",
        "captureFractions",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        potentialVolume: { type: "number" },
        capturedVolume: { type: "number" },
        supportedCapturedVolume: { type: "number" },
        supportedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "potentialVolume",
        "capturedVolume",
        "supportedCapturedVolume",
        "supportedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "rainDepths",
          label: "Rain Depths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "catchmentAreas",
          label: "Catchment Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "captureFractions",
          label: "Capture Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "potentialVolume",
          label: "Potential Volume",
          valueType: { type: "number" },
        },
        {
          id: "capturedVolume",
          label: "Captured Volume",
          valueType: { type: "number" },
        },
        {
          id: "supportedCapturedVolume",
          label: "Supported Captured Volume",
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
export const run = rainCaptureSupportShareTool.execute;
export default rainCaptureSupportShareTool;
