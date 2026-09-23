import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrations: readonly number[];
  readonly sampledVolumes: readonly number[];
  readonly inWindow: readonly boolean[];
  readonly methodVerified: readonly boolean[];
};
export type Output = {
  readonly windowMass: number;
  readonly supportedMass: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrations: { type: "array", maxItems: 256, items: { type: "number" } },
    sampledVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    inWindow: { type: "array", maxItems: 256, items: { type: "boolean" } },
    methodVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["concentrations", "sampledVolumes", "inWindow", "methodVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowMass: { type: "number" },
    supportedMass: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["windowMass", "supportedMass", "share", "defined"],
} as const;
/** Calculate contaminant window support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrations, sampledVolumes, inWindow, methodVerified } = request;
  const compute = (): Output => {
    H.sameLength(concentrations, sampledVolumes);
    H.sameLength(concentrations, inWindow);
    H.sameLength(concentrations, methodVerified);
    H.domain([...concentrations, ...sampledVolumes].every((x) => x >= 0));
    return (() => {
      const windowMass = concentrations.reduce(
          (s, x, i) => s + (inWindow[i] ? x * sampledVolumes[i] : 0),
          0,
        ),
        supportedMass = concentrations.reduce(
          (s, x, i) =>
            s + (inWindow[i] && methodVerified[i] ? x * sampledVolumes[i] : 0),
          0,
        );
      return {
        windowMass,
        supportedMass,
        share: windowMass > 0 ? supportedMass / windowMass : 0,
        defined: windowMass > 0,
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
    sampledVolumes: [1, 2, 1],
    inWindow: [true, true, false],
    methodVerified: [true, false, true],
  },
  output: { windowMass: 8, supportedMass: 2, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const contaminantWindowSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/contaminant-window-support-share",
    title: "Contaminant Window Support Share Tool",
    description:
      "Calculate contaminant window support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        sampledVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        inWindow: { type: "array", maxItems: 256, items: { type: "boolean" } },
        methodVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "concentrations",
        "sampledVolumes",
        "inWindow",
        "methodVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowMass: { type: "number" },
        supportedMass: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["windowMass", "supportedMass", "share", "defined"],
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
          id: "sampledVolumes",
          label: "Sampled Volumes",
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
          id: "methodVerified",
          label: "Method Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "windowMass",
          label: "Window Mass",
          valueType: { type: "number" },
        },
        {
          id: "supportedMass",
          label: "Supported Mass",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = contaminantWindowSupportShareTool.execute;
export default contaminantWindowSupportShareTool;
