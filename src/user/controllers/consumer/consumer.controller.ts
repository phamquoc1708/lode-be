import { JSONSchemaType } from "ajv";
import { ValidationService } from "@/src/helper/validation.service";
import { HandleFunc } from "@/src/controller";
import { UserService } from "@/src/user/services/user.service";
import {
  ConsumerRegisterInput,
  ConsumerLoginInput,
  ConsumerBankAccountInput,
  ConsumerBetInput,
  ConsumerMoneyInput,
  ConsumerUpdateProfileInput,
  ConsumerCreateDepositInput,
  ConsumerCreateWithdrawInput,
} from "@/src/user/types/consumer.types";
import { StatusCodes } from "http-status-codes";

export class ConsumerController {
  constructor(private userService: UserService, private validation: ValidationService) {}

  register(): HandleFunc {
    const schema: JSONSchemaType<ConsumerRegisterInput> = {
      type: "object",
      properties: {
        username: { type: "string", minLength: 6, maxLength: 30 },
        password: { type: "string", minLength: 6, maxLength: 32 },
        phone: { type: "string" },
        displayName: { type: "string", minLength: 6, maxLength: 50 },
      },
      required: ["username", "password", "phone", "displayName"],
    };
    return async (req, res, next) => {
      const payload = this.validation.validate(schema, req.body);
      const result = await this.userService.register(payload);
      res.status(StatusCodes.CREATED).json({ data: result });
    };
  }

  login(): HandleFunc {
    const schema: JSONSchemaType<ConsumerLoginInput> = {
      type: "object",
      properties: {
        username: { type: "string", minLength: 6, maxLength: 30 },
        password: { type: "string", minLength: 6, maxLength: 32 },
      },
      required: ["username", "password"],
    };
    return async (req, res, next) => {
      const payload = this.validation.validate(schema, req.body);
      const result = await this.userService.login(payload);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  getMyProfile(): HandleFunc {
    return async (req, res, next) => {
      const user = req.user;
      const result = await this.userService.getMyProfile(user.userId);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  logout(): HandleFunc {
    return async (req, res, next) => {
      const user = req.user;
      const result = await this.userService.logout(user.userId);
      res.status(StatusCodes.OK).json({});
    };
  }

  createBankAccount(): HandleFunc {
    const schema: JSONSchemaType<ConsumerBankAccountInput> = {
      type: "object",
      properties: {
        bank: { type: "string" },
        numberBank: { type: "string" },
        ownBank: { type: "string" },
      },
      required: ["bank", "numberBank", "ownBank"],
    };
    return async (req, res, next) => {
      console.log(req.body);
      const payload = this.validation.validate(schema, req.body);
      const user = req.user;
      const result = await this.userService.createBankAccount(user.userId, payload);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  getBankAccount(): HandleFunc {
    return async (req, res, next) => {
      const user = req.user;
      const paginate = req.query;
      const result = await this.userService.getBankAccount(user.userId, paginate);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  getBankWithdraw(): HandleFunc {
    return async (req, res, next) => {
      const result = await this.userService.getBankWithdraw();
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  create;

  getBankDeposit(): HandleFunc {
    return async (req, res, next) => {
      const result = await this.userService.getBankDeposit();
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  betGame(): HandleFunc {
    const schema: JSONSchemaType<ConsumerBetInput> = {
      type: "object",
      properties: {
        totalMoney: { type: "number" },
        bonus: { type: "number" },
        winOrLose: { type: "string" },
        typeBet: { type: "string" },
        region: { type: "string" },
        numberBet: { type: "string" },
        rateBet: { type: "number" },
      },
      required: ["totalMoney", "bonus", "typeBet", "winOrLose", "region", "numberBet", "rateBet"],
    };
    return async (req, res, next) => {
      const user = req.user;
      const payload = this.validation.validate(schema, req.body);
      const result = await this.userService.createBet(user.userId, payload);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  getHistoryGame(): HandleFunc {
    return async (req, res, next) => {
      const user = req.user;
      const result = await this.userService.getHistoryBet(user.userId);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  addMoney(): HandleFunc {
    const schema: JSONSchemaType<ConsumerMoneyInput> = {
      type: "object",
      properties: {
        bank: { type: "string" },
        totalMoney: { type: "number" },
        codeTransfer: { type: "string" },
      },
      required: ["bank", "totalMoney", "codeTransfer"],
    };
    return async (req, res, next) => {
      const user = req.user;
      const payload = this.validation.validate(schema, req.body);
      const result = await this.userService.addMoney(user.userId, payload);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  getHistoryMoney(): HandleFunc {
    return async (req, res, next) => {
      const user = req.user;
      const limit = req.query.limit;
      const result = await this.userService.getHistoryMoney(user.userId, parseInt(limit as string));
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  updateProfile(): HandleFunc {
    const schema: JSONSchemaType<ConsumerUpdateProfileInput> = {
      type: "object",
      properties: {
        fullName: { type: "string" },
      },
      required: ["fullName"],
    };
    return async (req, res) => {
      const user = req.user;
      const payload = this.validation.validate(schema, req.body);

      const result = await this.userService.updateProfile(user.userId, payload);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  getBankExist(): HandleFunc {
    return async (req, res) => {
      const user = req.user;
      const bank = req.query.bank as string;
      const result = await this.userService.getBankExist(user.userId, bank);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }

  createBankWithdraw(): HandleFunc {
    const schema: JSONSchemaType<ConsumerCreateWithdrawInput> = {
      type: "object",
      properties: {
        bank: { type: "string" },
        totalMoney: { type: "number" },
        ownBank: { type: "string" },
        numberBank: { type: "string" },
      },
      required: ["ownBank", "totalMoney", "bank", "numberBank"],
    };
    return async (req, res) => {
      const user = req.user;
      console.log(user);
      console.log(req.body);
      const payload = this.validation.validate(schema, req.body);

      const result = await this.userService.createBankWithdraw(user.userId, payload);
      res.status(StatusCodes.OK).json({ data: result });
    };
  }
}
