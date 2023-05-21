import { ValidationService } from "@/src/helper/validation.service";
import { AdminService } from "../../services/admin.service";
import { HandleFunc } from "@/src/controller";
import { AdminBetInput, AdminDepositInput } from "../../types/admin.types";
import { JSONSchemaType } from "ajv";

export class AdminController {
  constructor(private adminService: AdminService, private validation: ValidationService) {}

  getListBankWaiting(): HandleFunc {
    return async (req, res, next) => {
      const data = await this.adminService.getListBankWaiting();
      res.status(200).json({ data });
    };
  }

  getListBankDone(): HandleFunc {
    return async (req, res, next) => {
      const data = await this.adminService.getListBankDone();
      res.status(200).json({ data });
    };
  }

  acceptDeposit(): HandleFunc {
    const schema: JSONSchemaType<AdminDepositInput> = {
      type: "object",
      properties: {
        depositId: { type: "string" },
        username: { type: "string" },
      },
      required: ["depositId", "username"],
    };
    return async (req, res, next) => {
      const payload = this.validation.validate(schema, req.body);
      console.log(payload);
      const data = await this.adminService.acceptDeposit(payload);
      res.status(200).json({ data });
    };
  }

  rejectDeposit(): HandleFunc {
    const schema: JSONSchemaType<AdminDepositInput> = {
      type: "object",
      properties: {
        depositId: { type: "string" },
        username: { type: "string" },
      },
      required: ["depositId", "username"],
    };
    return async (req, res, next) => {
      const payload = this.validation.validate(schema, req.body);
      console.log(payload);
      const data = await this.adminService.rejectDeposit(payload);
      res.status(200).json({ data });
    };
  }

  getListBetWaiting(): HandleFunc {
    return async (req, res, next) => {
      const data = await this.adminService.getListBetWaiting();
      res.status(200).json({ data });
    };
  }

  getListBetDone(): HandleFunc {
    return async (req, res, next) => {
      const data = await this.adminService.getListBetDone();
      res.status(200).json({ data });
    };
  }

  winBet(): HandleFunc {
    const schema: JSONSchemaType<AdminBetInput> = {
      type: "object",
      properties: {
        betId: { type: "string" },
        username: { type: "string" },
      },
      required: ["betId", "username"],
    };
    return async (req, res, next) => {
      const payload = this.validation.validate(schema, req.body);
      const data = await this.adminService.winBet(payload);
      res.status(200).json({ data });
    };
  }

  loseBet(): HandleFunc {
    const schema: JSONSchemaType<AdminBetInput> = {
      type: "object",
      properties: {
        betId: { type: "string" },
        username: { type: "string" },
      },
      required: ["betId", "username"],
    };
    return async (req, res, next) => {
      const payload = this.validation.validate(schema, req.body);
      console.log(payload);
      const data = await this.adminService.loseBet(payload);
      res.status(200).json({ data });
    };
  }
}
