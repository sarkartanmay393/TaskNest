import { Request, Response } from "express";
import { ParsedQs } from "qs";

type ReqTypeArrayBody = Request<
  Record<string, string>[],
  any,
  Record<string, string>,
  ParsedQs
>;
type ReqType = Request<
  Record<string, string>,
  any,
  Record<string, string>,
  ParsedQs
>;
type ResType = Response;

export { ReqType, ResType, ReqTypeArrayBody };
