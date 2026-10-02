import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrations: readonly number[];
  readonly durations: readonly number[];
  readonly inWindow: readonly boolean[];
  readonly quantified: readonly boolean[];
};
export type Output = {
  readonly windowIntegral: number;
  readonly supportedIntegral: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrations: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    inWindow: { type: "array", maxItems: 256, items: { type: "boolean" } },
    quantified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["concentrations", "durations", "inWindow", "quantified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowIntegral: { type: "number" },
    supportedIntegral: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["windowIntegral", "supportedIntegral", "share", "defined"],
} as const;
/** Account for supplied piecewise-constant nonclinical concentration-time cells; no inferred AUC or dosing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrations, durations, inWindow, quantified } = request;
  const compute = (): Output => {
    H.sameLength(concentrations, durations);
    H.sameLength(concentrations, inWindow);
    H.sameLength(concentrations, quantified);
    H.domain([...concentrations, ...durations].every((x) => x >= 0));
    return (() => {
      const windowIntegral = concentrations.reduce(
          (s, x, i) => s + (inWindow[i] ? x * durations[i] : 0),
          0,
        ),
        supportedIntegral = concentrations.reduce(
          (s, x, i) =>
            s + (inWindow[i] && quantified[i] ? x * durations[i] : 0),
          0,
        );
      return {
        windowIntegral,
        supportedIntegral,
        share: windowIntegral > 0 ? supportedIntegral / windowIntegral : 0,
        defined: windowIntegral > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentrations: [2, 3, 5],
    durations: [1, 2, 1],
    inWindow: [true, true, false],
    quantified: [true, false, true],
  },
  output: {
    windowIntegral: 8,
    supportedIntegral: 2,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const concentrationSupportWindowShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/concentration-support-window-share",
    title: "Concentration Support Window Share Tool",
    description:
      "Account for supplied piecewise-constant nonclinical concentration-time cells; no inferred AUC or dosing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        inWindow: { type: "array", maxItems: 256, items: { type: "boolean" } },
        quantified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["concentrations", "durations", "inWindow", "quantified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowIntegral: { type: "number" },
        supportedIntegral: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["windowIntegral", "supportedIntegral", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "concentrations",
          label: "Concentrations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inWindow",
          label: "In Window",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "quantified",
          label: "Quantified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "windowIntegral",
          label: "Window Integral",
          valueType: { type: "number" },
        },
        {
          id: "supportedIntegral",
          label: "Supported Integral",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = concentrationSupportWindowShareTool.execute;
export default concentrationSupportWindowShareTool;
