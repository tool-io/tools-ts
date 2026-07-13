export type ToolExample<Input, Output = never> = {
  readonly input: Input;
  readonly output?: Output;
};
