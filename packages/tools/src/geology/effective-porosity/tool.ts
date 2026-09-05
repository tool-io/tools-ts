import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly coreBulkVolume: number;
  readonly connectedTracerVolume: number;
  readonly independentDeadEndVolume: number;
}>;
export type Output = Readonly<{
  readonly effectivePorosity: number;
  readonly connectedPorosity: number;
}>;
const inputFields = [
  { id: "coreBulkVolume", label: "Core bulk volume", kind: "number" },
  {
    id: "connectedTracerVolume",
    label: "Connected tracer volume",
    kind: "number",
  },
  {
    id: "independentDeadEndVolume",
    label: "Independent dead end volume",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coreBulkVolume, "coreBulkVolume");
  nonnegative(input.connectedTracerVolume, "connectedTracerVolume");
  nonnegative(input.independentDeadEndVolume, "independentDeadEndVolume");
  if (
    input.connectedTracerVolume > input.coreBulkVolume ||
    input.independentDeadEndVolume > input.connectedTracerVolume
  )
    simpleError("volumes", "Dead-end≤connected≤bulk.");
  return {
    effectivePorosity:
      (input.connectedTracerVolume - input.independentDeadEndVolume) /
      input.coreBulkVolume,
    connectedPorosity: input.connectedTracerVolume / input.coreBulkVolume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coreBulkVolume: 100,
  connectedTracerVolume: 20,
  independentDeadEndVolume: 5,
} satisfies Input;
export const exampleOutput = {
  effectivePorosity: 0.15,
  connectedPorosity: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/effective-porosity",
  title: "Geology Effective Porosity Calculator",
  description:
    "Connected tracer volume excluding independently resolved dead ends, unlike total pore/grain-density porosity. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "effectivePorosity", label: "Effective porosity", kind: "number" },
    { id: "connectedPorosity", label: "Connected porosity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      coreBulkVolume: value.coreBulkVolume as number,
      connectedTracerVolume: value.connectedTracerVolume as number,
      independentDeadEndVolume: value.independentDeadEndVolume as number,
    }),
});
export const run = tool.execute;
export default tool;
