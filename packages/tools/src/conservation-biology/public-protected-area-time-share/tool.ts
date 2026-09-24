import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly durations: readonly number[];
  readonly activeDesignation: readonly boolean[];
};
export type Output = {
  readonly areaTime: number;
  readonly designatedAreaTime: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    durations: { type: "array", maxItems: 256, items: { type: "number" } },
    activeDesignation: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["areas", "durations", "activeDesignation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaTime: { type: "number" },
    designatedAreaTime: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["areaTime", "designatedAreaTime", "share", "defined"],
} as const;
/** Aggregate supplied area-time records and public designation flags without legal geographic classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, durations, activeDesignation } = request;
  const compute = (): Output => {
    H.sameLength(areas, durations);
    H.sameLength(areas, activeDesignation);
    H.domain([...areas, ...durations].every((x) => x >= 0));
    return (() => {
      const areaTime = areas.reduce((s, x, i) => s + x * durations[i], 0),
        designatedAreaTime = areas.reduce(
          (s, x, i) => s + (activeDesignation[i] ? x * durations[i] : 0),
          0,
        );
      return {
        areaTime,
        designatedAreaTime,
        share: areaTime > 0 ? designatedAreaTime / areaTime : 0,
        defined: areaTime > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    areas: [2, 3],
    durations: [5, 10],
    activeDesignation: [true, false],
  },
  output: { areaTime: 40, designatedAreaTime: 10, share: 0.25, defined: true },
} satisfies ToolExample<Input, Output>;
export const publicProtectedAreaTimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/public-protected-area-time-share",
    title: "Public Protected Area Time Share Tool",
    description:
      "Aggregate supplied area-time records and public designation flags without legal geographic classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areas: { type: "array", maxItems: 256, items: { type: "number" } },
        durations: { type: "array", maxItems: 256, items: { type: "number" } },
        activeDesignation: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["areas", "durations", "activeDesignation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaTime: { type: "number" },
        designatedAreaTime: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["areaTime", "designatedAreaTime", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "areas",
          label: "Areas",
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
          id: "activeDesignation",
          label: "Active Designation",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "areaTime", label: "Area Time", valueType: { type: "number" } },
        {
          id: "designatedAreaTime",
          label: "Designated Area Time",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = publicProtectedAreaTimeShareTool.execute;
export default publicProtectedAreaTimeShareTool;
