interface OutputTestPsicometrico {
  tests: {
    ["SDS"]: {
      scores: {
        [dimension in "R" | "I" | "A" | "S" | "E" | "C"]: number;
      };
    };
    ["RAVEN"]: {
      results: {
        answers: string;
        age: number;
      };
    };
  };
}
