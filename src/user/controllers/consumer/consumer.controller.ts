import { JSONSchemaType } from "ajv";
import { ValidationService } from "@/src/helper/validation.service";
import { HandleFunc } from "@/src/controller";
import { UserService } from "@/src/user/services/user.service";
import { ConsumerRegisterInput, ConsumerLoginInput } from "@/src/user/types/consumer.types";
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
}
