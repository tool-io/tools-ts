import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deployedDurations: readonly number[];
  readonly servicingDurations: readonly number[];
  readonly usable: readonly boolean[];
};
export type Output = {
  readonly deployedTotal: number;
  readonly serviceTotal: number;
  readonly validExposure: number;
  readonly validShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deployedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    servicingDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    usable: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["deployedDurations", "servicingDurations", "usable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deployedTotal: { type: "number" },
    serviceTotal: { type: "number" },
    validExposure: { type: "number" },
    validShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "deployedTotal",
    "serviceTotal",
    "validExposure",
    "validShare",
    "defined",
  ],
} as const;
/** Calculate trap servicing valid share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deployedDurations, servicingDurations, usable } = request;
  const compute = (): Output => {
    H.sameLength(deployedDurations, servicingDurations);
    H.sameLength(deployedDurations, usable);
    H.domain(
      deployedDurations.every(
        (x, i) =>
          x >= 0 && servicingDurations[i] >= 0 && servicingDurations[i] <= x,
      ),
    );
    return (() => {
      const deployedTotal = deployedDurations.reduce((a, b) => a + b, 0),
        serviceTotal = servicingDurations.reduce((a, b) => a + b, 0),
        validExposure = deployedDurations.reduce(
          (s, x, i) => s + (usable[i] ? x - servicingDurations[i] : 0),
          0,
        );
      return {
        deployedTotal,
        serviceTotal,
        validExposure,
        validShare: deployedTotal > 0 ? validExposure / deployedTotal : 0,
        defined: deployedTotal > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deployedDurations: [10, 10],
    servicingDurations: [2, 1],
    usable: [true, false],
  },
  output: {
    deployedTotal: 20,
    serviceTotal: 3,
    validExposure: 8,
    validShare: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const trapServicingValidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/trap-servicing-valid-share",
    title: "Trap Servicing Valid Share Tool",
    description:
      "Calculate trap servicing valid share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deployedDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        servicingDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        usable: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["deployedDurations", "servicingDurations", "usable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deployedTotal: { type: "number" },
        serviceTotal: { type: "number" },
        validExposure: { type: "number" },
        validShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "deployedTotal",
        "serviceTotal",
        "validExposure",
        "validShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "deployedDurations",
          label: "Deployed Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "servicingDurations",
          label: "Servicing Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "usable",
          label: "Usable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "deployedTotal",
          label: "Deployed Total",
          valueType: { type: "number" },
        },
        {
          id: "serviceTotal",
          label: "Service Total",
          valueType: { type: "number" },
        },
        {
          id: "validExposure",
          label: "Valid Exposure",
          valueType: { type: "number" },
        },
        {
          id: "validShare",
          label: "Valid Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trapServicingValidShareTool.execute;
export default trapServicingValidShareTool;
