import { ValidationService } from "@/src/helper/validation.service";
import { AdminService } from "../../services/admin.service";
import { HandleFunc } from "@/src/controller";

export class AdminController {
  constructor(private adminService: AdminService, private validation: ValidationService) {}

  login(): HandleFunc {
    return async (req, res, next) => {
      const test = this.adminService.login();
      res.status(200).json({ test });
    };
  }
}
