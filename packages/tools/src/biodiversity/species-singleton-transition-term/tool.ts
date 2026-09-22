import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCount: number;
  readonly addedObservations: number;
};
export type Output = {
  readonly wasSingleton: boolean;
  readonly nowSingleton: boolean;
  readonly singletonCountDelta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCount: { type: "integer", minimum: 0 },
    addedObservations: { type: "integer", minimum: 0 },
  },
  required: ["previousCount", "addedObservations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wasSingleton: { type: "boolean" },
    nowSingleton: { type: "boolean" },
    singletonCountDelta: { type: "integer" },
  },
  required: ["wasSingleton", "nowSingleton", "singletonCountDelta"],
} as const;
/** Calculate species singleton transition term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCount, addedObservations } = request;
  const compute = (): Output => {
    H.integer(previousCount, 0);
    H.integer(addedObservations, 0);
    return {
      wasSingleton: previousCount === 1,
      nowSingleton: previousCount + addedObservations === 1,
      singletonCountDelta:
        (previousCount + addedObservations === 1 ? 1 : 0) -
        (previousCount === 1 ? 1 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCount: 1, addedObservations: 1 },
  output: { wasSingleton: true, nowSingleton: false, singletonCountDelta: -1 },
} satisfies ToolExample<Input, Output>;
export const speciesSingletonTransitionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/species-singleton-transition-term",
    title: "Species Singleton Transition Term Tool",
    description:
      "Calculate species singleton transition term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCount: { type: "integer", minimum: 0 },
        addedObservations: { type: "integer", minimum: 0 },
      },
      required: ["previousCount", "addedObservations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wasSingleton: { type: "boolean" },
        nowSingleton: { type: "boolean" },
        singletonCountDelta: { type: "integer" },
      },
      required: ["wasSingleton", "nowSingleton", "singletonCountDelta"],
    },
    ports: {
      inputs: [
        {
          id: "previousCount",
          label: "Previous Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "addedObservations",
          label: "Added Observations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "wasSingleton",
          label: "Was Singleton",
          valueType: { type: "boolean" },
        },
        {
          id: "nowSingleton",
          label: "Now Singleton",
          valueType: { type: "boolean" },
        },
        {
          id: "singletonCountDelta",
          label: "Singleton Count Delta",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = speciesSingletonTransitionTermTool.execute;
export default speciesSingletonTransitionTermTool;
