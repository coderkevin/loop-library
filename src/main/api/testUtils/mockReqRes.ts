export type MockReq = {
  body?: unknown;
};

export type MockRes = {
  statusCode: number | null;
  jsonBody: unknown;
  status: (code: number) => MockRes;
  json: (body: unknown) => MockRes;
};

export function createMockReq({ body }: { body?: unknown } = {}): MockReq {
  return { body };
}

export function createMockRes(): MockRes {
  const res: MockRes = {
    statusCode: null,
    jsonBody: undefined,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.jsonBody = body;
      return res;
    },
  };
  return res;
}


