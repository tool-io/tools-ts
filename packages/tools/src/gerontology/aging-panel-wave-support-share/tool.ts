import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personIds: readonly string[];
  readonly waveIds: readonly string[];
  readonly observed: readonly boolean[];
  readonly selectedWave: string;
};
export type Output = {
  readonly eligiblePeople: number;
  readonly observedPeople: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    waveIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedWave: { type: "string", maxLength: 8192 },
  },
  required: ["personIds", "waveIds", "observed", "selectedWave"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePeople: { type: "integer" },
    observedPeople: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["eligiblePeople", "observedPeople", "share", "defined"],
} as const;
/** Calculate aging panel wave support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personIds, waveIds, observed, selectedWave } = request;
  const compute = (): Output => {
    H.sameLength(personIds, waveIds);
    H.sameLength(personIds, observed);
    return (() => {
      const a = new Set(
          personIds.filter((x, i) => waveIds[i] === selectedWave),
        ),
        b = new Set(
          personIds.filter(
            (x, i) => waveIds[i] === selectedWave && observed[i],
          ),
        );
      return {
        eligiblePeople: a.size,
        observedPeople: b.size,
        share: a.size > 0 ? b.size / a.size : 0,
        defined: a.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personIds: ["p1", "p1", "p2"],
    waveIds: ["1", "1", "1"],
    observed: [true, false, false],
    selectedWave: "1",
  },
  output: { eligiblePeople: 2, observedPeople: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const agingPanelWaveSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/aging-panel-wave-support-share",
    title: "Aging Panel Wave Support Share Tool",
    description:
      "Calculate aging panel wave support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        waveIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedWave: { type: "string", maxLength: 8192 },
      },
      required: ["personIds", "waveIds", "observed", "selectedWave"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligiblePeople: { type: "integer" },
        observedPeople: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["eligiblePeople", "observedPeople", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "personIds",
          label: "Person Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "waveIds",
          label: "Wave Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedWave",
          label: "Selected Wave",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "eligiblePeople",
          label: "Eligible People",
          valueType: { type: "integer" },
        },
        {
          id: "observedPeople",
          label: "Observed People",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = agingPanelWaveSupportShareTool.execute;
export default agingPanelWaveSupportShareTool;
