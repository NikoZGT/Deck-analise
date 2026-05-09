export type EvalCase = { name: string; passed: boolean; message: string };
export function summarizeEval(cases: EvalCase[]) {
  return {
    total: cases.length,
    passed: cases.filter((c) => c.passed).length,
    failed: cases.filter((c) => !c.passed).length
  };
}
