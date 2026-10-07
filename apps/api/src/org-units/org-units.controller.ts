import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import {
  createOrgUnitSchema,
  moveOrgUnitSchema,
} from "@loom/shared";
import { OrgUnitsService } from "./org-units.service.js";

@Controller("api/org-units")
export class OrgUnitsController {
  constructor(
    @Inject(OrgUnitsService)
    private readonly orgUnitsService: OrgUnitsService,
  ) {}

  @Get()
  async getTree() {
    const data = await this.orgUnitsService.getTree();
    return { success: true, data };
  }

  @Post()
  async createUnit(@Body() body: any) {
    const parsed = createOrgUnitSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid team creation parameters",
        fields: parsed.error.flatten().fieldErrors,
      });
    }
    const data = await this.orgUnitsService.createUnit(parsed.data);
    return { success: true, data };
  }

  @Patch(":id/move")
  async moveUnit(@Param("id") id: string, @Body() body: any) {
    const parsed = moveOrgUnitSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        code: "VALIDATION_ERROR",
        message: "Invalid move parameters",
        fields: parsed.error.flatten().fieldErrors,
      });
    }
    const data = await this.orgUnitsService.moveUnit(id, parsed.data.newParentId);
    return { success: true, data };
  }

  @Delete(":id")
  async deleteUnit(@Param("id") id: string) {
    const data = await this.orgUnitsService.deleteUnit(id);
    return { success: true, data };
  }
}
